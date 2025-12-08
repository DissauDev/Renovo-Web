import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  DataTable,
  type TableColumn,
} from "../../../components/ui/dashboad/DataTable";

import {
  useGetCategoriesQuery,
  type Category,
} from "../../../store/features/api/categoriesApi.ts";
import {
  ActiveStatusSelect,
  type ActiveFilterValue,
} from "../../../components/atoms/inputs/ActiveStatusSelect.tsx";

import { HeaderTab } from "../../../components/layout/HeaderTab.tsx";

export const CategoriesPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState<ActiveFilterValue>("ALL");

  const { data, isLoading } = useGetCategoriesQuery({
    search,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    active: activeFilter === "ALL" ? undefined : activeFilter === "true",
  });

  const columns: TableColumn<Category>[] = [
    {
      key: "name",
      header: "Name",
      render: (u) => (
        <span className="font-medium text-slate-800">{u.name}</span>
      ),
    },

    {
      key: "tickets",
      header: "Tickets",
      render: (u) => (
        <span
          className="inline-flex items-center rounded-full bg-blue-50 px-2
         py-0.5 text-[11px] font-medium text-blue-700"
        >
          {u._count?.items ?? "—"}
        </span>
      ),
    },
    {
      key: "products",
      header: "Products",
      render: (u) => (
        <span
          className="inline-flex items-center rounded-full bg-indigo-50 px-2
         py-0.5 text-[11px] font-medium text-indigo-700"
        >
          {u._count?.products}
        </span>
      ),
    },
    {
      key: "is Active?",
      header: "is Active?",
      render: (u) => (
        <span
          className={`
    inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium
    ${u.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}
  `}
        >
          {u.isActive ? "Active" : "Desactive"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created at",
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
        hadle={() => navigate("/app/categories/new")}
        title="Categories"
      />
      <DataTable<Category>
        title="Categories"
        data={data ?? []}
        columns={columns}
        isLoading={isLoading}
        searchTerm={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1); // resetea a la primera página al buscar
        }}
        searchPlaceholder="Search by name, email..."
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onRowClick={(row) => {
          navigate(`/app/categories/${row.id}`);
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
        totalItems={0}
      />
    </div>
  );
};
