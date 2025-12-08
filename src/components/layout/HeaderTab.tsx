import { PlusIcon } from "@heroicons/react/24/outline";

interface Props {
  hadle: () => void;
  title: string;
}
export const HeaderTab = ({ hadle, title }: Props) => {
  return (
    <div className="flex flex-row justify-between items-center">
      <h1 className="text-lg font-varien-italic font-semibold text-oxford-blue-800">
        {title}
      </h1>
      <button
        onClick={hadle}
        className="px-4 flex py-2 gap-2 font-bold rounded-lg items-center
               bg-oxford-blue-600 hover:bg-oxford-blue-500 font-varien text-white text-sm"
      >
        <PlusIcon className="h-4 w-4 text-white" /> Create
      </button>
    </div>
  );
};
