// src/components/products/ProductForm.tsx
import * as React from "react";
import {
  useForm,
  type SubmitHandler,
  type Resolver,
  Controller,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { FormInput } from "../atoms/form/FormInput";
import { FormTextArea } from "../atoms/form/FormTextArea";
import { AsyncSelect } from "../atoms/inputs/AsyncSelect";
import { TicketImagesUploader } from "../atoms/inputs/TicketImagesUploader";
import { cn } from "../../lib/utils";

import { FormInputNumber } from "../atoms/form/FormInputNumber";
import type { FieldError } from "react-hook-form";
import {
  useGetCategoriesQuery,
  type Category,
} from "../../store/features/api/categoriesApi.ts";
import { useTranslation } from "react-i18next";

// helpers
const optionalTrimmed = z
  .string()
  .transform((v) => v.trim())
  .optional()
  .or(z.literal(""));

const getProductFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(2, t("errorsSchema.nameRequired"))
      .transform((v) => v.trim()),

    sku: optionalTrimmed
      .refine((v) => !v || v.length >= 2, {
        message: t("errorsSchema.skuTooShort"),
      })
      .optional(),

    description: z.string().optional(),

    stockQty: z
      .number({ message: t("errorsSchema.stockRequired") })
      .int(t("errorsSchema.stockInteger"))
      .min(0, t("errorsSchema.stockNonNegative")),

    cost: z
      .number({ message: t("errorsSchema.costRequired") })
      .min(0, t("errorsSchema.costNonNegative")),

    sell: z
      .number({ message: t("errorsSchema.sellRequired") })
      .min(0, t("errorsSchema.sellNonNegative")),

    categoryId: z.coerce.number().min(1, t("errorsSchema.categoryRequired")),

    imageUrl: z
      .string()
      .url(t("errorsSchema.imageUrl"))
      .optional()
      .or(z.literal("")),
  });

export type ProductFormValues = z.infer<
  ReturnType<typeof getProductFormSchema>
>;

type ProductFormMode = "create" | "edit";

interface ProductFormProps {
  mode: ProductFormMode;
  initialValues?: Partial<ProductFormValues>;
  submitLabel?: string;
  isSubmitting?: boolean;
  onSubmitForm: (values: ProductFormValues) => Promise<void> | void;
  onCancel?: () => void;
  className?: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  mode,
  initialValues,
  submitLabel,
  isSubmitting = false,
  onSubmitForm,
  onCancel,
  className,
}) => {
  const { t } = useTranslation("products");
  const schema = React.useMemo(() => getProductFormSchema(t), [t]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<ProductFormValues>,
    defaultValues: {
      name: initialValues?.name ?? "",
      sku: initialValues?.sku ?? "",
      description: initialValues?.description ?? "",

      stockQty: initialValues?.stockQty ?? 0,
      cost: initialValues?.cost ?? 0,
      sell: initialValues?.sell ?? 0,

      categoryId: initialValues?.categoryId ?? 0,
      imageUrl: initialValues?.imageUrl ?? "",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const imageUrl = watch("imageUrl");

  const onSubmit: SubmitHandler<ProductFormValues> = async (values) => {
    await onSubmitForm({
      ...values,
      sku: values.sku?.trim() || "",
      name: values.name.trim(),
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit(onSubmit)(e);
      }}
      className={cn(
        "bg-white rounded-2xl shadow border border-slate-200 p-6 space-y-4",
        className
      )}
      noValidate
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5">
          <div className="text-sm font-varien text-oxford-blue-800">
            {t(mode === "create" ? "form.titleCreate" : "form.titleEdit")}
          </div>
          <div className="text-[11px] text-slate-500">{t("form.subtitle")}</div>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className={cn(
              "px-2 flex flex-row py-1 text-sm items-center justify-center",
              "rounded-lg border border-slate-300 text-slate-700",
              "hover:bg-red-500 hover:text-white",
              isSubmitting && "opacity-60 cursor-not-allowed"
            )}
          >
            <XMarkIcon className="size-5" />
          </button>
        )}
      </div>

      {/* Name + SKU */}
      <div className="grid gap-4 md:grid-cols-2">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <FormInput
              label={t("form.fields.name")}
              type="text"
              name={field.name}
              placeholder={t("form.placeholders.name")}
              error={fieldState.error as FieldError | undefined}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          name="sku"
          control={control}
          render={({ field, fieldState }) => (
            <FormInput
              label={t("form.fields.skuOptional")}
              type="text"
              name={field.name}
              placeholder={t("form.placeholders.sku")}
              error={fieldState.error as FieldError | undefined}
              value={field.value ?? ""}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      {/* Description */}
      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <FormTextArea
            label={t("form.fields.description")}
            name={field.name}
            placeholder={t("form.placeholders.description")}
            error={fieldState.error as FieldError | undefined}
            rows={4}
            value={field.value ?? ""}
            onChange={field.onChange}
          />
        )}
      />

      {/* Prices + Stock */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Controller
          name="stockQty"
          control={control}
          render={({ field, fieldState }) => (
            <FormInputNumber
              label={t("form.fields.stockQty")}
              name={field.name}
              value={field.value ?? 0}
              onChange={field.onChange}
              variant="integer"
              min={0}
              placeholder="0"
              error={fieldState.error as FieldError | undefined}
            />
          )}
        />

        <Controller
          name="cost"
          control={control}
          render={({ field, fieldState }) => (
            <FormInputNumber
              label={t("form.fields.costUsd")}
              name={field.name}
              value={field.value ?? 0}
              onChange={field.onChange}
              variant="price"
              min={0}
              placeholder="0.00"
              error={fieldState.error as FieldError | undefined}
            />
          )}
        />

        <Controller
          name="sell"
          control={control}
          render={({ field, fieldState }) => (
            <FormInputNumber
              label={t("form.fields.sellUsd")}
              name={field.name}
              value={field.value ?? 0}
              onChange={field.onChange}
              variant="price"
              min={0}
              placeholder="0.00"
              error={fieldState.error as FieldError | undefined}
            />
          )}
        />
      </div>

      {/* Category */}
      <Controller
        name="categoryId"
        control={control}
        render={({ field }) => (
          <AsyncSelect<Category>
            mode="input"
            useLabel
            label={t("form.fields.category")}
            name={field.name}
            value={field.value ? String(field.value) : ""}
            onChange={(val) => field.onChange(Number(val))}
            error={errors.categoryId}
            placeholder={t("form.placeholders.selectCategory")}
            useOptionsHook={useGetCategoriesQuery}
            getOptionLabel={(cat) => cat.name}
            getOptionValue={(cat) => String(cat.id)}
            enableSearch
          />
        )}
      />

      {/* Image */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-600 tracking-[0.12em] uppercase">
          {t("form.fields.image")}
        </label>

        <TicketImagesUploader
          images={
            imageUrl
              ? [
                  {
                    id: "product-image",
                    url: imageUrl,
                  },
                ]
              : []
          }
          onAddImage={(url) =>
            setValue("imageUrl", url, { shouldValidate: true })
          }
          onRemoveImage={() =>
            setValue("imageUrl", "", { shouldValidate: true })
          }
        />

        {errors.imageUrl && (
          <p className="text-[11px] text-red-500 mt-0.5">
            {String(errors.imageUrl.message ?? "")}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={cn(
              "px-4 py-2 text-sm rounded-lg border border-slate-300",
              "text-slate-700 hover:bg-slate-50"
            )}
            disabled={isSubmitting}
          >
            {t("actions.cancel")}
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "px-4 py-2 text-sm rounded-lg",
            "bg-oxford-blue-600 text-white font-varien",
            "hover:bg-oxford-blue-700",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            "shadow-sm"
          )}
        >
          {isSubmitting
            ? mode === "create"
              ? t("actions.creating")
              : t("actions.saving")
            : submitLabel ??
              (mode === "create"
                ? t("actions.create")
                : t("actions.saveChanges"))}
        </button>
      </div>
    </form>
  );
};
