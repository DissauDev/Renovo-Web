import { useTranslation } from "react-i18next";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export const ButtonBack = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("tickets");
  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="px-4 py-2 text-sm mr-2 inline-flex items-center justify-center rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-300"
    >
      <ArrowLeftIcon className="size-5 mr-2" />
      {t("details.back")}
    </button>
  );
};
