/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { Controller } from "react-hook-form";

import { cn } from "../../lib/utils";
import type { CloseTicketFormValues } from "./CloseTicketSchema";

import { AsyncSelect } from "../atoms/inputs/AsyncSelect";
import { FormInputNumber } from "../atoms/form/FormInputNumber";

// Ajusta estos imports a tu proyecto
import {
  useGetProductsQuery,
  type Product,
} from "../../store/features/api/productsApi";
import { FormInput } from "../atoms/form/FormInput";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

type Props = {
  idx: number;
  //@ts-ignore
  kind: CloseTicketFormValues["lineItems"][number]["kind"];
  control: Control<CloseTicketFormValues>;
  register: UseFormRegister<CloseTicketFormValues>;
  setValue: UseFormSetValue<CloseTicketFormValues>;
  remove: (index: number) => void;
  canRemove: boolean;
  isDisabled: boolean;
  errors: FieldErrors<CloseTicketFormValues>;
};

export function CloseLineItemRow({
  idx,
  kind,
  control,
  register,
  setValue,
  remove,
  canRemove,
  isDisabled,
  errors,
}: Props) {
  const rowErrors = errors.lineItems?.[idx];
  const useProductsOptions = () => {
    const { data, isLoading, isError } = useGetProductsQuery({
      page: 1,
      active: true,
      pageSize: 200,
    });
    return { data: data?.items ?? [], isLoading, isError };
  };
  const { t } = useTranslation("tickets");

  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs font-semibold text-slate-600">
          {t("closeLineItem.item", { index: idx + 1 })}
        </div>

        <div className="flex items-center gap-2 justify-between">
          {/* Kind toggle */}
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setValue(`lineItems.${idx}.kind`, "INVENTORY")}
              className={cn(
                "px-3 py-1 text-xs",
                kind === "INVENTORY"
                  ? "bg-[var(--color-oxford-blue-600)] text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              )}
              disabled={isDisabled}
            >
              {t("closeLineItem.kind.inventory")}
            </button>
            <button
              type="button"
              onClick={() => setValue(`lineItems.${idx}.kind`, "NON_INVENTORY")}
              className={cn(
                "px-3 py-1 text-xs",
                kind === "NON_INVENTORY"
                  ? "bg-[var(--color-oxford-blue-600)] text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              )}
              disabled={isDisabled}
            >
              {t("closeLineItem.kind.nonInventory")}
            </button>
          </div>

          <button
            type="button"
            onClick={() => remove(idx)}
            className="text-xs text-persian-red-600 bg-persian-red-200 hover:bg-persian-red-300
            rounded-lg p-2 hover:text-persian-red-700 "
            disabled={isDisabled || !canRemove}
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {kind === "INVENTORY" ? (
          <>
            {/* Product select */}
            <div className="lg:col-span-3">
              <Controller
                control={control}
                name={`lineItems.${idx}.productId`}
                render={({ field }) => (
                  <AsyncSelect<Product>
                    label={t("closeLineItem.inventory.productLabel")}
                    name={field.name}
                    value={field.value || ""}
                    onChange={field.onChange}
                    error={rowErrors?.productId as any}
                    placeholder={t("closeLineItem.inventory.selectProduct")}
                    enableSearch
                    filterOptions={(opts) =>
                      opts.filter((p: any) => (p.stockQty ?? 0) > 0)
                    }
                    useOptionsHook={useProductsOptions}
                    getOptionLabel={(p) =>
                      `${p.name}${
                        typeof (p as any).stockQty === "number"
                          ? ` · ${t("closeLineItem.inventory.stock", {
                              qty: (p as any).stockQty,
                            })}`
                          : ""
                      }`
                    }
                    getOptionValue={(p) => String(p.id)}
                  />
                )}
              />
            </div>

            {/* Qty */}
            <div className="lg:col-span-2">
              <Controller
                control={control}
                name={`lineItems.${idx}.quantity`}
                render={({ field }) => (
                  <FormInputNumber
                    label={t("closeLineItem.qty")}
                    name={field.name}
                    value={Number(field.value || 1)}
                    onChange={(v) => field.onChange(v)}
                    min={1}
                    disabled={isDisabled}
                    error={rowErrors?.quantity as any}
                    variant="integer"
                  />
                )}
              />
            </div>

            {/* Note */}
            <div className="sm:col-span-2 lg:col-span-5">
              <FormInput
                label={t("closeLineItem.note.label")}
                type="text"
                error={rowErrors?.note}
                placeholder={t("closeLineItem.note.placeholder")}
                {...register(`lineItems.${idx}.note`)}
              />
            </div>
          </>
        ) : (
          <>
            <div className="lg:col-span-3">
              <FormInput
                label={t("closeLineItem.nonInventory.nameLabel")}
                type="text"
                placeholder={t("closeLineItem.nonInventory.namePlaceholder")}
                error={rowErrors?.name}
                {...register(`lineItems.${idx}.name`)}
              />
            </div>

            {/* Qty */}
            <div className="lg:col-span-2">
              <Controller
                control={control}
                name={`lineItems.${idx}.quantity`}
                render={({ field }) => (
                  <FormInputNumber
                    label={t("closeLineItem.qty")}
                    name={field.name}
                    value={Number(field.value || 1)}
                    onChange={(v) => field.onChange(v)}
                    min={1}
                    disabled={isDisabled}
                    error={rowErrors?.quantity as any}
                    variant="integer"
                  />
                )}
              />
            </div>

            {/* Note */}
            <div className="sm:col-span-2 lg:col-span-5">
              <FormInput
                label={t("closeLineItem.note.label")}
                type="text"
                error={rowErrors?.note}
                placeholder={t("closeLineItem.note.placeholder")}
                {...register(`lineItems.${idx}.note`)}
                disabled={isDisabled}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
