import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "../../../lib/utils";
import { FormInput } from "../../../components/atoms/form/FormInput";
import { useTranslation } from "react-i18next";

export type CategoryFormMode = "create" | "edit";

const getCategorySchema = () =>
  z.object({
    name: z.string().min(2, "categories:errors.nameRequired"),

    description: z.string().optional(),
    // en create obligas icon; en edit lo permites vacío si quieres
  });

export type CategoryFormValues = z.infer<ReturnType<typeof getCategorySchema>>;

type Props = {
  mode: CategoryFormMode;
  initialValues?: Partial<CategoryFormValues>;
  isSubmitting?: boolean;
  onSubmitForm: (values: CategoryFormValues) => Promise<void> | void;

  title?: string;
  submitLabel?: string;
};

export const CategoryForm: React.FC<Props> = ({
  mode,
  initialValues,
  isSubmitting = false,
  onSubmitForm,
  title,
  submitLabel,
}) => {
  const schema = React.useMemo(() => getCategorySchema(), []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialValues?.name ?? "",
      description: initialValues?.description ?? "",
    },
  });

  const { t } = useTranslation("categories");

  const onSubmit = async (values: CategoryFormValues) => {
    await onSubmitForm(values);
  };

  return (
    <div className="bg-white shadow border border-slate-200 rounded-2xl p-6 space-y-6">
      {title && (
        <h2 className="text-sm font-varien text-oxford-blue-800">{title}</h2>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit(onSubmit)(e);
        }}
        className="space-y-6"
        noValidate
      >
        <FormInput
          label={t("form.nameLabel")}
          placeholder={t("form.namePlaceholder")}
          error={errors.name}
          {...register("name")}
        />

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "px-4 py-2 rounded-lg",
              "bg-oxford-blue-600 text-white text-sm font-varien",
              "hover:bg-oxford-blue-700 disabled:opacity-60",
            )}
          >
            {isSubmitting
              ? mode === "create"
                ? t("actions.creating")
                : t("actions.saving")
              : (submitLabel ??
                (mode === "create"
                  ? t("actions.createCategory")
                  : t("actions.saveChanges")))}
          </button>
        </div>
      </form>
    </div>
  );
};
