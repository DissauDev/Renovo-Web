import { HeaderTab } from "../../components/layout/HeaderTab";
import { InvoiceSettingsCard } from "../../components/settings/InvoiceSettingsCard";

export const SettingsPage = () => {
  return (
    <div className="space-y-5">
      <HeaderTab title={"settings"} hasCreated={false} />

      <div className="flex justify-center ">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 max-w-xl">
          <InvoiceSettingsCard className="mt-6" />
        </div>
      </div>
    </div>
  );
};
