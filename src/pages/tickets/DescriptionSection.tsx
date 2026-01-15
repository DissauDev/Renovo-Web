import { useTranslation } from "react-i18next";

interface DescriptionSectionProps {
  description?: string | null;
}

export const DescriptionSection = ({
  description,
}: DescriptionSectionProps) => {
  const { t } = useTranslation("tickets");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-varien text-oxford-blue-800">
        {t("form.fields.description.label")}
      </h2>

      <p className="mt-2 text-sm text-slate-600 whitespace-pre-line">
        {description?.trim()
          ? description
          : t("details.noAdditionalDescription")}
      </p>
    </section>
  );
};
