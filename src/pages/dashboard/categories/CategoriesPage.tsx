import { useState, type ComponentType, type SVGProps } from "react";
import { useNavigate } from "react-router-dom";
import * as SolidIcons from "@heroicons/react/24/solid";
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
import { useTranslation } from "react-i18next";

export const CategoriesPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();

  const { t } = useTranslation("categories");

  const [activeFilter, setActiveFilter] = useState<ActiveFilterValue>("ALL");

  const { data, isLoading } = useGetCategoriesQuery({
    search,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    active: activeFilter === "ALL" ? undefined : activeFilter === "true",
  });
  type HeroIcon = ComponentType<SVGProps<SVGSVGElement>>;

  function getHeroIcon(name?: string): HeroIcon | null {
    if (!name) return null;
    return (SolidIcons as Record<string, HeroIcon>)[name] ?? null;
  }

  const columns: TableColumn<Category>[] = [
    {
      key: "name",
      header: t("table.columns.name"),
      render: (u) => {
        const Icon = getHeroIcon(u.icon);

        return (
          <div className="flex items-center gap-2 min-w-0">
            {Icon && <Icon className="h-4 w-4 text-slate-500 shrink-0" />}
            <span className="font-medium text-slate-800 truncate">
              {u.name}
            </span>
          </div>
        );
      },
    },

    {
      key: "tickets",
      header: t("table.columns.tickets"),
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
      header: t("table.columns.products"),
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
      header: t("table.columns.active"),
      render: (u) => (
        <span
          className={`
    inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium
    ${u.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}
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
        hadle={() => navigate("/app/categories/new")}
        title="Categories"
      />
      <DataTable<Category>
        i18nNs="categories"
        title={t("title")}
        data={data ?? []}
        columns={columns}
        isLoading={isLoading}
        searchTerm={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1); // resetea a la primera página al buscar
        }}
        searchPlaceholder={t("table.searchPlaceholder")}
        page={page}
        emptyMessage={t("table.empty")}
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
        totalItems={data?.length ?? 0}
      />
    </div>
  );
};
