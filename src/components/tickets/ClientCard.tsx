import { useTranslation } from "react-i18next";

interface ClientCardProps {
  clientName?: string | null;
  providername?: string;
}

export const ClientCard: React.FC<ClientCardProps> = ({
  clientName,
  providername,
}) => {
  const clientInitials =
    clientName
      ?.split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .join("")
      .toUpperCase() ?? "?";
  const providerInitials =
    providername
      ?.split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .join("")
      .toUpperCase() ?? "?";

  const { t } = useTranslation("tickets");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
      <h2 className="text-sm font-varien text-oxford-blue-800">
        {t("client.client")}
      </h2>
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center 
        justify-center rounded-full font-varien bg-woodsmoke-200 text-sm font-semibold text-slate-700"
        >
          {clientInitials}
        </div>
        <div className="text-sm  text-slate-600">
          <div className="font-semibold text-slate-800">
            {clientName ?? t("client.noName")}
          </div>
          <div className="text-slate-500">{t("client.tenant")}</div>
        </div>
      </div>
      <h2 className="text-sm font-varien text-oxford-blue-800">
        {t("client.provider")}
      </h2>
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full bg-woodsmoke-200 
        text-sm font-varien text-slate-700"
        >
          {providerInitials}
        </div>
        <div className="text-sm text-slate-600">
          <div className="font-semibold text-slate-800">
            {providername ?? t("client.noName")}
          </div>
          <div className="text-slate-500">{t("client.propertyManager")}</div>
        </div>
      </div>
    </section>
  );
};
