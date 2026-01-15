import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

interface DetailsSectionProps {
  address?: string | null;
  createdAt: string;
  scheduletAt?: string | null;
}

export const DetailsSection = ({
  address,
  createdAt,
  scheduletAt,
}: DetailsSectionProps) => {
  const { t } = useTranslation("tickets");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
      <h2 className="text-sm font-varien text-oxford-blue-800">
        {t("detailsPanel.title")}
      </h2>

      <div className="flex  gap-2 text-sm items-center text-slate-600">
        <MapPinIcon className="mt-0.5 h-5 w-5 text-oxford-blue-800" />
        <div>
          <div className="font-semibold  text-slate-800 ">
            {t("detailsPanel.addressLabel")}
          </div>
          <div className="text-slate-600">
            {address || t("detailsPanel.noAddress")}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <ClockIcon className="h-5 w-5 text-oxford-blue-800" />
          <div>
            <div className="text-sm font-semibold  text-slate-700">
              {t("detailsPanel.created")}
            </div>
            <div className="text-slate-700">{createdAt}</div>
          </div>
        </div>

        {/* Si luego tienes campo updatedAt, lo usas aquí */}
        {scheduletAt && (
          <div className="flex items-center gap-1.5">
            <ClockIcon className="h-5 w-5 text-oxford-blue-800" />
            <div>
              <div className="text-sm font-semibold text-slate-700">
                {t("detailsPanel.scheduledAt")}
              </div>
              <div className="text-slate-700">{scheduletAt}</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
