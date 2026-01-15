import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  useGetUsersQuery,
  type User,
} from "../../../store/features/api/userApi";

import {
  DataTable,
  type TableColumn,
} from "../../../components/ui/dashboad/DataTable";

import {
  ActiveStatusSelect,
  type ActiveFilterValue,
} from "../../../components/atoms/inputs/ActiveStatusSelect";

import { HeaderTab } from "../../../components/layout/HeaderTab";

export const ProvidersPage: React.FC = () => {
  const { t } = useTranslation("providers");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState<ActiveFilterValue>("ALL");

  const { data, isLoading } = useGetUsersQuery({
    role: "PROVIDER",
    search,
    page,
    pageSize,
    active: activeFilter === "ALL" ? undefined : activeFilter === "true",
  });

  // backend: { items, meta }
  const items: User[] = data?.items ?? [];
  const totalItems: number = data?.meta?.total ?? items.length;

  const columns: TableColumn<User>[] = [
    {
      key: "name",
      header: t("table.columns.name"),
      render: (u) => (
        <span className="font-medium text-slate-800">{u.name}</span>
      ),
    },
    {
      key: "email",
      header: t("table.columns.email"),
      render: (u) => <span className="text-slate-600">{u.email}</span>,
    },
    {
      key: "phone",
      header: t("table.columns.phone"),
      render: (u) => <span className="text-slate-600">{u.phone ?? "—"}</span>,
    },
    {
      key: "role",
      header: t("table.columns.role"),
      render: (u) => (
        <span
          className="
            inline-flex items-center rounded-full
            bg-indigo-50 px-2 py-0.5
            text-[11px] font-medium text-indigo-700
          "
        >
          {u.role}
        </span>
      ),
    },
    {
      key: "isActive",
      header: t("table.columns.status"),
      render: (u) => (
        <span
          className={`
            inline-flex items-center rounded-full px-2 py-0.5
            text-[11px] font-medium
            ${
              u.isActive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }
          `}
        >
          {u.isActive ? t("status.active") : t("status.inactive")}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: t("table.columns.createdAt"),
      render: (u) => (
        <span className="text-slate-500">
          {new Date(u.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <HeaderTab
        hadle={() => navigate("/app/providers/new")}
        title={"Providers"}
      />

      <DataTable<User>
        title={t("title")}
        i18nNs="providers"
        data={items}
        columns={columns}
        isLoading={isLoading}
        searchTerm={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        searchPlaceholder={t("table.searchPlaceholder")}
        emptyMessage={t("table.empty")}
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
        onRowClick={(row) => {
          navigate(`/app/providers/${row.id}`);
        }}
        rightSlot={
          <div className="flex flex-wrap gap-2">
            <ActiveStatusSelect
              mode="filter"
              value={activeFilter}
              onChange={(v) => {
                setActiveFilter(v);
                setPage(1);
              }}
            />
          </div>
        }
      />
    </div>
  );
};
