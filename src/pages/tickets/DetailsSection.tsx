import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";

interface DetailsSectionProps {
  address?: string | null;
  createdAt: string;
}

export const DetailsSection = ({ address, createdAt }: DetailsSectionProps) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
    <h2 className="text-sm font-varien text-oxford-blue-800">Order Details</h2>

    <div className="flex  gap-2 text-sm items-center text-slate-600">
      <MapPinIcon className="mt-0.5 h-5 w-5 text-oxford-blue-800" />
      <div>
        <div className="font-semibold  text-slate-800 ">Service address</div>
        <div className="text-slate-600">
          {address || "Sin dirección especificada."}
        </div>
      </div>
    </div>

    <div className="flex flex-wrap gap-4 text-xs text-slate-600">
      <div className="flex items-center gap-1.5">
        <ClockIcon className="h-5 w-5 text-oxford-blue-800" />
        <div>
          <div className="text-sm font-semibold  text-slate-700">Created</div>
          <div className="text-slate-700">{createdAt}</div>
        </div>
      </div>

      {/* Si luego tienes campo updatedAt, lo usas aquí */}
      <div className="flex items-center gap-1.5">
        <ClockIcon className="h-5 w-5 text-oxford-blue-800" />
        <div>
          <div className="text-sm font-semibold text-slate-700">
            Last Update
          </div>
          <div className="text-slate-700">{createdAt}</div>
        </div>
      </div>
    </div>
  </section>
);
