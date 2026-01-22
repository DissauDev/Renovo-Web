import * as React from "react";
import {
  useForm,
  type SubmitHandler,
  type Resolver,
  Controller,
  useFieldArray,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { cn } from "../../lib/utils";
import { FormInput } from "../atoms/form/FormInput";
import { FormTextArea } from "../atoms/form/FormTextArea";
import { AsyncSelect } from "../atoms/inputs/AsyncSelect";
import { TicketImagesUploader } from "../atoms/inputs/TicketImagesUploader";
import { UrgencySelect } from "../atoms/inputs/UrgencySelect";
import {
  useGetCategoriesQuery,
  type Category,
} from "../../store/features/api/categoriesApi.ts";
import { useTranslation } from "react-i18next";

// ✅ schema único (create/edit)
// eslint-disable-next-line react-refresh/only-export-components
export const ticketFormSchema = z.object({
  title: z.string().min(2, "tickets:form.validation.titleRequired"),
  description: z.string().min(5, "tickets:form.validation.descriptionRequired"),
  clientName: z.string().min(2, "tickets:form.validation.clientRequired"),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  clientPhone: z.string().min(5, "tickets:form.validation.phoneRequired"),
  clientEmail: z
    .string()
    .email("tickets:form.validation.invalidEmail")
    .optional()
    .or(z.literal("")),
  address: z.string().min(5, "tickets:form.validation.addressRequired"),
  categoryId: z.coerce
    .number()
    .min(1, "tickets:form.validation.categoryRequired"),
  photos: z
    .array(
      z.object({
        imageId: z.coerce.number().int().positive(),
        url: z.string().url(),
      }),
    )
    .optional(),
});

export type TicketFormValues = z.infer<typeof ticketFormSchema>;
export type TicketFormMode = "create" | "edit";

type Props = {
  mode: TicketFormMode;
  initialValues?: Partial<TicketFormValues>;
  isSubmitting?: boolean;
  submitLabel?: string;
  title?: string;

  onSubmitForm: (values: TicketFormValues) => Promise<void> | void;
  onCancel?: () => void;
  className?: string;
};

export const TicketForm: React.FC<Props> = ({
  mode,
  initialValues,
  isSubmitting = false,
  title,
  onSubmitForm,
  onCancel,
  className,
}) => {
  const { t, i18n } = useTranslation("tickets");

  // Traduce mensajes de Zod si vienen como "tickets:..."
  const trErr = React.useCallback(
    (msg?: string) => {
      if (!msg) return undefined;

      // Si el mensaje viene con namespace explícito (tickets:...)
      if (msg.startsWith("tickets:")) {
        const key = msg.slice("tickets:".length); // "form.validation.xxx"
        return i18n.exists(`tickets:${key}`) ? t(key) : key;
      }

      // Si es una key sin namespace (por si algún día lo cambias)
      if (i18n.exists(`tickets:${msg}`)) return t(msg);

      // Si es un mensaje plano
      return msg;
    },
    [t, i18n],
  );

  const resolver: Resolver<TicketFormValues> = React.useMemo(() => {
    const base = zodResolver(ticketFormSchema) as Resolver<TicketFormValues>;
    return async (values, context, options) => {
      const result = await base(values, context, options);

      if (result.errors) {
        Object.keys(result.errors).forEach((k) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const err = (result.errors as any)[k];
          if (err?.message) err.message = trErr(err.message);
        });

        // photos[] errors
        const photos = result.errors.photos;
        if (Array.isArray(photos)) {
          photos.forEach((p) => {
            if (p?.url?.message) p.url.message = trErr(p.url.message);
          });
        }
      }

      return result;
    };
  }, [trErr]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TicketFormValues>({
    resolver,
    defaultValues: {
      title: initialValues?.title ?? "",
      description: initialValues?.description ?? "",
      clientName: initialValues?.clientName ?? "",
      clientPhone: initialValues?.clientPhone ?? "",
      clientEmail: initialValues?.clientEmail ?? "",
      address: initialValues?.address ?? "",
      categoryId: initialValues?.categoryId ?? 0,
      urgency: initialValues?.urgency ?? "MEDIUM",
      photos: initialValues?.photos ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "photos",
  });

  const onSubmit: SubmitHandler<TicketFormValues> = async (values) => {
    await onSubmitForm(values);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit(onSubmit)(e);
      }}
      className={cn(
        "bg-white rounded-2xl shadow border border-slate-200 p-6 space-y-4",
        className,
      )}
      noValidate
    >
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <h1 className="text-lg font-varien text-oxford-blue-800 truncate">
            {title ??
              (mode === "create" ? t("form.createTitle") : t("form.editTitle"))}
          </h1>
          <p className="text-[11px] text-slate-500">
            {mode === "create"
              ? t("form.createSubtitle")
              : t("form.editSubtitle")}
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="shrink-0 px-2 py-1 rounded-lg border border-slate-300 text-slate-700 hover:bg-red-500 hover:text-white"
        >
          <XMarkIcon className="size-5" />
        </button>
      </div>

      {/* Title */}
      <FormInput
        label={t("form.fields.title.label")}
        placeholder={t("form.fields.title.placeholder")}
        type="text"
        error={
          errors.title
            ? { ...errors.title, message: trErr(errors.title.message) }
            : undefined
        }
        {...register("title")}
      />

      {/* Description */}
      <FormTextArea
        label={t("form.fields.description.label")}
        placeholder={t("form.fields.description.placeholder")}
        error={
          errors.description
            ? {
                ...errors.description,
                message: trErr(errors.description.message),
              }
            : undefined
        }
        rows={4}
        {...register("description")}
      />

      {/* Client */}
      <div className="grid md:grid-cols-2 gap-4">
        <FormInput
          type="text"
          label={t("form.fields.clientName.label")}
          placeholder={t("form.fields.clientName.placeholder")}
          error={
            errors.clientName
              ? {
                  ...errors.clientName,
                  message: trErr(errors.clientName.message),
                }
              : undefined
          }
          {...register("clientName")}
        />
        <FormInput
          type="tel"
          label={t("form.fields.clientPhone.label")}
          placeholder={t("form.fields.clientPhone.placeholder")}
          error={
            errors.clientPhone
              ? {
                  ...errors.clientPhone,
                  message: trErr(errors.clientPhone.message),
                }
              : undefined
          }
          {...register("clientPhone")}
        />
        <FormInput
          label={t("form.fields.clientEmail.label")}
          placeholder={t("form.fields.clientEmail.placeholder")}
          type="email"
          error={
            errors.clientEmail
              ? {
                  ...errors.clientEmail,
                  message: trErr(errors.clientEmail.message),
                }
              : undefined
          }
          {...register("clientEmail")}
        />
        <FormInput
          type="text"
          label={t("form.fields.address.label")}
          placeholder={t("form.fields.address.placeholder")}
          error={
            errors.address
              ? { ...errors.address, message: trErr(errors.address.message) }
              : undefined
          }
          {...register("address")}
        />
      </div>

      {/* Urgency + Category */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600 tracking-[0.12em] uppercase">
            {t("form.fields.urgency.label")}
          </label>

          <Controller
            name="urgency"
            control={control}
            render={({ field }) => (
              <UrgencySelect
                value={field.value}
                onChange={field.onChange}
                className="py-4 mt-0.5"
                placeholder={t("form.fields.urgency.placeholder")}
              />
            )}
          />

          {errors.urgency?.message && (
            <p className="text-[11px] text-red-500 mt-0.5">
              {trErr(errors.urgency.message)}
            </p>
          )}
        </div>

        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <AsyncSelect<Category>
              mode="input"
              name={field.name}
              value={field.value ? String(field.value) : ""}
              onChange={(val) => field.onChange(Number(val))}
              error={
                errors.categoryId
                  ? {
                      ...errors.categoryId,
                      message: trErr(errors.categoryId.message),
                    }
                  : undefined
              }
              label={t("form.fields.category.label")}
              placeholder={t("form.fields.category.placeholder")}
              useOptionsHook={useGetCategoriesQuery}
              getOptionLabel={(cat) => cat.name}
              getOptionValue={(cat) => String(cat.id)}
              enableSearch
            />
          )}
        />
      </div>

      {/* Photos */}
      <TicketImagesUploader
        images={fields.map((f) => ({ id: String(f.imageId), url: f.url }))}
        onAddImage={(img) => append(img)} // img debe ser { imageId, url }
        onRemoveImage={remove}
      />

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "px-4 py-2 text-sm rounded-lg",
            "bg-oxford-blue-600 text-white font-varien",
            "hover:bg-oxford-blue-700",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            "shadow-sm",
          )}
        >
          {isSubmitting
            ? mode === "create"
              ? t("form.actions.creating")
              : t("form.actions.saving")
            : mode === "create"
              ? t("form.actions.create")
              : t("form.actions.save")}
        </button>
      </div>
    </form>
  );
};
