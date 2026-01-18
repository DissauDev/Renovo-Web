import { useTranslation } from "react-i18next";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";

export const ButtonBack = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("tickets");

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-3 py-2",
        "text-sm font-medium text-oxford-blue-700",
        "border border-slate-200 bg-white",
        "shadow-xs transition-all",
        "hover:bg-oxford-blue-50 hover:border-oxford-blue-300",
        "hover:text-oxford-blue-800",
        "focus:outline-none focus:ring-2 focus:ring-oxford-blue-500/30",
      )}
    >
      <ArrowLeftIcon className="h-4 w-4" />
      {t("details.back")}
    </button>
  );
};
