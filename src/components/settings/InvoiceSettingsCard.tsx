import * as React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { cn } from "../../lib/utils";
import {
  useGetInvoiceSettingsQuery,
  useUpdateInvoiceSettingsMutation,
} from "../../store/features/api/invoiceSettingsApi";
import { toastNotify } from "../../lib/toastNotify";
import { FormInputNumber } from "../atoms/form/FormInputNumber";

function clampNumber(v: number, min: number, max: number) {
  if (Number.isNaN(v)) return min;
  return Math.min(max, Math.max(min, v));
}

type FormValues = {
  productTaxEnabled: boolean;
  productTaxPercent: number;

  invoiceTaxEnabled: boolean;
  invoiceTaxPercent: number;
  invoiceTaxFixed: number;
};

export const InvoiceSettingsCard: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { data, isLoading, isError, refetch } = useGetInvoiceSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] =
    useUpdateInvoiceSettingsMutation();

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      productTaxEnabled: false,
      productTaxPercent: 0,
      invoiceTaxEnabled: false,
      invoiceTaxPercent: 0,
      invoiceTaxFixed: 0,
    },
  });

  // Sync data -> form
  React.useEffect(() => {
    if (!data) return;

    reset({
      productTaxEnabled: !!data.productTaxEnabled,
      productTaxPercent: data.productTaxPercent ?? 0,

      invoiceTaxEnabled: !!data.invoiceTaxEnabled,
      invoiceTaxPercent: data.invoiceTaxPercent ?? 0,
      invoiceTaxFixed: data.invoiceTaxFixed ?? 0,
    });
  }, [data, reset]);

  const productTaxEnabled = watch("productTaxEnabled");
  const invoiceTaxEnabled = watch("invoiceTaxEnabled");

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      // Normalización números (MISMA idea que tenías, pero ahora desde RHF)
      const productTaxPercent = values.productTaxEnabled
        ? clampNumber(Number(values.productTaxPercent), 0, 100)
        : null;

      const invoiceTaxPercent = values.invoiceTaxEnabled
        ? clampNumber(Number(values.invoiceTaxPercent), 0, 100)
        : null;

      const invoiceTaxFixed = values.invoiceTaxEnabled
        ? clampNumber(Number(values.invoiceTaxFixed), 0, 999999)
        : null;

      await updateSettings({
        productTaxEnabled: values.productTaxEnabled,
        productTaxPercent,

        invoiceTaxEnabled: values.invoiceTaxEnabled,
        invoiceTaxPercent,
        invoiceTaxFixed,
      }).unwrap();

      toastNotify("Saved", "success");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toastNotify(err?.message || "Error saving settings", "error");
    }
  };

  if (isLoading) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-slate-200 bg-white shadow-sm p-5",
          className
        )}
      >
        <p className="text-sm text-slate-500">Loading settings...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-slate-200 bg-white shadow-sm p-5 space-y-3",
          className
        )}
      >
        <p className="text-sm text-red-500">Error loading settings.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-xs px-3 py-1 rounded-md border border-slate-300 hover:bg-slate-50"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit(onSubmit)(e);
      }}
      className={cn(
        "rounded-2xl border border-slate-200 bg-white shadow-sm p-5",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-sm font-varien text-oxford-blue-800">
            Invoice preferences
          </h2>
          <p className="text-[11px] text-slate-500">
            Configure taxes for products and invoices.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className={cn(
            "h-9 px-3 rounded-lg text-sm font-varien",
            "bg-oxford-blue-600 text-white hover:bg-oxford-blue-700",
            "disabled:opacity-60 disabled:cursor-not-allowed"
          )}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {/* Product Tax */}
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Product tax
              </p>
              <p className="text-[11px] text-slate-500">
                Adds a percent tax per product line.
              </p>
            </div>

            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={!!productTaxEnabled}
                onChange={(e) =>
                  setValue("productTaxEnabled", e.target.checked, {
                    shouldDirty: true,
                  })
                }
              />
              <span
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition",
                  productTaxEnabled ? "bg-oxford-blue-600" : "bg-slate-300"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-5 w-5 transform rounded-full bg-white transition",
                    productTaxEnabled ? "translate-x-5" : "translate-x-1"
                  )}
                />
              </span>
            </label>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2">
            <FormInputNumber
              label="Percent (%)"
              name="productTaxPercent"
              value={watch("productTaxPercent")}
              onChange={(v) =>
                setValue("productTaxPercent", v, { shouldDirty: true })
              }
              error={errors.productTaxPercent}
              disabled={!productTaxEnabled}
              min={0}
              max={100}
              step={0.01}
              variant="price"
              placeholder="e.g. 8.25"
            />
          </div>
        </div>

        {/* Invoice Tax */}
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Invoice tax / fee
              </p>
              <p className="text-[11px] text-slate-500">
                Adds fixed amount and/or percent to the invoice total.
              </p>
            </div>

            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={!!invoiceTaxEnabled}
                onChange={(e) =>
                  setValue("invoiceTaxEnabled", e.target.checked, {
                    shouldDirty: true,
                  })
                }
              />
              <span
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition",
                  invoiceTaxEnabled ? "bg-oxford-blue-600" : "bg-slate-300"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-5 w-5 transform rounded-full bg-white transition",
                    invoiceTaxEnabled ? "translate-x-5" : "translate-x-1"
                  )}
                />
              </span>
            </label>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3">
            <FormInputNumber
              label="Percent (%)"
              name="invoiceTaxPercent"
              value={watch("invoiceTaxPercent")}
              onChange={(v) =>
                setValue("invoiceTaxPercent", v, { shouldDirty: true })
              }
              error={errors.invoiceTaxPercent}
              disabled={!invoiceTaxEnabled}
              min={0}
              max={100}
              step={0.01}
              variant="price"
              placeholder="e.g. 5"
            />

            <FormInputNumber
              label="Fixed amount"
              name="invoiceTaxFixed"
              value={watch("invoiceTaxFixed")}
              onChange={(v) =>
                setValue("invoiceTaxFixed", v, { shouldDirty: true })
              }
              error={errors.invoiceTaxFixed}
              disabled={!invoiceTaxEnabled}
              min={0}
              max={999999}
              step={0.01}
              variant="price"
              placeholder="e.g. 15.00"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 text-[11px] text-slate-500">
        Tip: You can enable both product tax and invoice tax at the same time.
      </div>
    </form>
  );
};
