import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import * as SolidIcons from "@heroicons/react/24/solid";
import { cn } from "../../../lib/utils";
import { FormInput } from "../../../components/atoms/form/FormInput";
import { useTranslation } from "react-i18next";

export type CategoryFormMode = "create" | "edit";

const getCategorySchema = (mode: CategoryFormMode) =>
  z.object({
    name: z.string().min(2, "categories:errors.nameRequired"),

    description: z.string().optional(),
    // en create obligas icon; en edit lo permites vacío si quieres
    icon:
      mode === "create"
        ? z.string().min(1, "categories:errors.iconRequired")
        : z.string().optional(),
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

type HeroIconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

function IconPicker({
  value,
  onChange,
  disabled,
}: {
  value?: string;
  onChange: (next: string) => void;
  disabled?: boolean;
}) {
  const [q, setQ] = React.useState("");

  // keys disponibles (solo los que terminan en Icon)
  const iconKeys = React.useMemo(() => {
    return Object.keys(SolidIcons)
      .filter((k) => k.endsWith("Icon"))
      .sort((a, b) => a.localeCompare(b));
  }, []);

  const filtered = React.useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return iconKeys.slice(0, 60); // muestra “algo” por defecto
    return iconKeys.filter((k) => k.toLowerCase().includes(term)).slice(0, 120);
  }, [q, iconKeys]);

  const SelectedIcon = value
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((SolidIcons as any)[value] as HeroIconComponent | undefined)
    : undefined;
  const { t } = useTranslation("categories");

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-xs font-medium text-slate-600 tracking-[0.12em] uppercase">
        {t("form.iconLabel")}
      </label>

      <div className="flex gap-2 items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("form.iconSearchPlaceholder")}
          disabled={disabled}
          className={cn(
            "w-full rounded-lg border px-3 py-2 text-sm outline-none",
            "border-slate-200 focus:ring-2 focus:ring-emerald-100",
            disabled ? "bg-slate-100" : "bg-white"
          )}
        />

        <div
          className={cn(
            "h-10 w-10 rounded-lg border border-slate-200 flex items-center justify-center",
            disabled ? "bg-slate-100" : "bg-white"
          )}
          title={value || ""}
        >
          {SelectedIcon ? (
            <SelectedIcon className="h-6 w-6" />
          ) : (
            <span className="text-xs text-slate-400">—</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 max-h-[260px] overflow-auto pr-1">
        {filtered.map((key) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const Icon = (SolidIcons as any)[key] as HeroIconComponent;
          const active = value === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              disabled={disabled}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg border text-[11px] transition",
                active
                  ? "bg-emerald-50 border-cameo-500 text-cameo-700"
                  : "border-slate-200 hover:bg-slate-50",
                disabled && "opacity-60 cursor-not-allowed"
              )}
              title={key}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="truncate w-full text-center">
                {key.replace("Icon", "")}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const CategoryForm: React.FC<Props> = ({
  mode,
  initialValues,
  isSubmitting = false,
  onSubmitForm,
  title,
  submitLabel,
}) => {
  const schema = React.useMemo(() => getCategorySchema(mode), [mode]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialValues?.name ?? "",
      description: initialValues?.description ?? "",
      icon: initialValues?.icon ?? "",
    },
  });

  const { t } = useTranslation("categories");

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedIcon = watch("icon");

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

        {/* Icon picker con búsqueda */}
        <div>
          <IconPicker
            value={selectedIcon}
            onChange={(k) => setValue("icon", k, { shouldValidate: true })}
            disabled={isSubmitting}
          />
          {errors.icon && (
            <p className="text-[11px] text-red-500 mt-1">
              {t(String(errors.icon.message))}
            </p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "px-4 py-2 rounded-lg",
              "bg-oxford-blue-600 text-white text-sm font-varien",
              "hover:bg-oxford-blue-700 disabled:opacity-60"
            )}
          >
            {isSubmitting
              ? mode === "create"
                ? t("actions.creating")
                : t("actions.saving")
              : submitLabel ??
                (mode === "create"
                  ? t("actions.createCategory")
                  : t("actions.saveChanges"))}
          </button>
        </div>
      </form>
    </div>
  );
};
