import { useTranslation } from "react-i18next";
import { resolveImageUrl } from "../../lib/resolveImageUrl";

interface PhotosSectionProps {
  photos: string[];
}

export const PhotosSection = ({ photos }: PhotosSectionProps) => {
  const { t } = useTranslation("tickets");
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-varien text-oxford-blue-800">
        {t("photos.title")}
      </h2>

      {photos && photos.length > 0 ? (
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
          {photos.map((src, i) => (
            <div
              key={i}
              className="aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
            >
              <img
                src={resolveImageUrl(src)}
                alt={t("photos.photoAlt", { index: i + 1 })}
                className="h-full w-full object-cover transition-transform duration-150 hover:scale-105"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 py-6 text-xs text-slate-400">
          {t("photos.empty")}
        </div>
      )}
    </section>
  );
};
