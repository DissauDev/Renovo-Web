import * as React from "react";
import { useTranslation } from "react-i18next";
import { StatusSelect } from "./StatusSelect";

type LocaleValue = "EN" | "ES";

interface LocaleSelectProps {
  value: LocaleValue;
  onChange: (value: LocaleValue) => void;

  label?: string;
  placeholder?: string;
}

export const LocaleSelect: React.FC<LocaleSelectProps> = ({
  value,
  onChange,
  label,
  placeholder,
}) => {
  const { t } = useTranslation("providers");

  const options = React.useMemo(
    () => [
      { value: "EN", label: t("locales.en", "English") },
      { value: "ES", label: t("locales.es", "Español") },
    ],
    [t],
  );

  return (
    <StatusSelect
      value={value}
      onChange={(v) => onChange(v as LocaleValue)}
      options={options}
      label={label ?? t("form.fields.locale.label", "Language")}
      placeholder={placeholder ?? t("form.fields.locale.placeholder", "Select")}
      /* 👇 estilos alineados con FormInput */
      wrapperClassName="flex flex-col gap-1.5 "
      labelClassName="text-xs font-medium text-slate-600 tracking-[0.12em] uppercase"
      className={`
        rounded-lg
        border border-slate-300
        bg-white
        px-3
        py-2
        text-sm
        shadow-xs
        w-full
        transition-all
        focus-visible:ring-2
        focus-visible:ring-oxford-blue-500/40
        focus-visible:border-oxford-blue-500
      `}
    />
  );
};
