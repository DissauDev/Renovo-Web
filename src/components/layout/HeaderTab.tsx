import { PlusIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

interface Props {
  hadle?: () => void;
  title: string;
  hasCreated?: boolean;
}
export const HeaderTab = ({ hadle, title, hasCreated = true }: Props) => {
  const { t } = useTranslation();
  const titleHeader = title.toLowerCase();
  return (
    <div className="flex flex-row justify-between items-center">
      <h1 className="text-lg font-varien-italic font-semibold text-oxford-blue-800">
        {t(`nav.${titleHeader}`)}
      </h1>
      {hasCreated ? (
        <button
          onClick={hadle}
          className="px-4 flex py-2 gap-2 font-bold rounded-lg items-center
               bg-oxford-blue-600 hover:bg-oxford-blue-500 font-varien text-white text-sm"
        >
          <PlusIcon className="h-4 w-4 text-white" /> {t("actions.create")}
        </button>
      ) : (
        <div className="w-1 h-1" />
      )}
    </div>
  );
};
