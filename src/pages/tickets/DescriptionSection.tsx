interface DescriptionSectionProps {
  description?: string | null;
}

export const DescriptionSection = ({
  description,
}: DescriptionSectionProps) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <h2 className="text-sm font-varien text-oxford-blue-800">Description</h2>
    <p className="mt-2 text-sm text-slate-600 whitespace-pre-line">
      {description || "Sin descripción adicional."}
    </p>
  </section>
);
