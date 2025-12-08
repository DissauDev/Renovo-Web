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
    clientName
      ?.split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .join("")
      .toUpperCase() ?? "?";
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
      <h2 className="text-sm font-varien text-oxford-blue-800">Cliente</h2>
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center 
        justify-center rounded-full font-varien bg-woodsmoke-200 text-sm font-semibold text-slate-700"
        >
          {clientInitials}
        </div>
        <div className="text-sm  text-slate-600">
          <div className="font-semibold text-slate-800">
            {clientName ?? "Cliente sin nombre"}
          </div>
          <div className="text-slate-500">Tenant</div>
        </div>
      </div>
      <h2 className="text-sm font-varien text-oxford-blue-800">Provider</h2>
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full bg-woodsmoke-200 
        text-sm font-varien text-slate-700"
        >
          {providerInitials}
        </div>
        <div className="text-sm text-slate-600">
          <div className="font-semibold text-slate-800">
            {providername ?? "Cliente sin nombre"}
          </div>
          <div className="text-slate-500">Property manager</div>
        </div>
      </div>
    </section>
  );
};
