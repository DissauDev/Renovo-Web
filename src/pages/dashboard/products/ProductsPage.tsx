import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetProductsQuery,
  type Product,
} from "../../../store/features/api/productsApi";
import {
  DataTable,
  type TableColumn,
} from "../../../components/ui/dashboad/DataTable";
import { AsyncSelect } from "../../../components/atoms/inputs/AsyncSelect";
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

export const ProductsPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [activeFilter, setActiveFilter] = useState<ActiveFilterValue>("ALL");

  const { data, isLoading } = useGetProductsQuery({
    page,
    search,
    categoryId: categoryFilter === "ALL" ? undefined : Number(categoryFilter),
    pageSize,
    active: activeFilter === "ALL" ? undefined : activeFilter === "true",
  });

  const { t } = useTranslation("products");

  const products: Product[] = data?.items ?? [];
  const total = data?.total ?? 0;

  const columns: TableColumn<Product>[] = [
    {
      key: "name",
      header: t("table.columns.name"),
      render: (p) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-800">{p.name}</span>
          {p.sku && (
            <span className="text-[11px] text-slate-500">
              {t("table.sku")}: {p.sku}
            </span>
          )}
        </div>
      ),
    },

    {
      key: "price",
      header: t("table.columns.price"),
      render: (p) => (
        <div className="flex flex-col text-sm">
          <span className="font-medium text-slate-700">
            ${((p.sellCents ?? 0) / 100).toFixed(2)}
          </span>
          <span className="text-[11px] text-slate-500">
            {t("table.cost")} ${((p.costCents ?? 0) / 100).toFixed(2)}
          </span>
        </div>
      ),
    },

    {
      key: "stock",
      header: t("table.columns.stock"),
      render: (p) => {
        const qty = p.stockQty ?? 0;

        const stockStyles =
          qty === 0
            ? "bg-red-50 text-red-700"
            : qty <= 5
            ? "bg-amber-50 text-amber-700"
            : "bg-emerald-50 text-emerald-700";

        return (
          <span
            className={`
            inline-flex items-center justify-center min-w-[48px]
            rounded-full px-2 py-0.5 text-[11px] font-medium
            ${stockStyles}
          `}
          >
            {qty}
          </span>
        );
      },
    },

    {
      key: "description",
      header: t("table.columns.description"),
      render: (p) => (
        <span className="text-slate-600 line-clamp-2">
          {p.description ?? "—"}
        </span>
      ),
    },

    {
      key: "category",
      header: t("table.columns.category"),
      render: (p) => (
        <span
          className="
          inline-flex items-center rounded-full
          bg-indigo-50 px-2 py-0.5
          text-[11px] font-medium text-indigo-700
        "
        >
          {p.category?.name ?? "—"}
        </span>
      ),
    },

    {
      key: "isActive",
      header: t("table.columns.status"),
      render: (p) => (
        <span
          className={`
          inline-flex items-center rounded-full px-2 py-0.5
          text-[11px] font-medium
          ${
            p.isActive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }
        `}
        >
          {p.isActive ? t("status.active") : t("status.inactive")}
        </span>
      ),
    },

    {
      key: "createdAt",
      header: t("table.columns.createdAt"),
      render: (p) => (
        <span className="text-slate-500 text-sm">
          {new Date(p.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <HeaderTab hadle={() => navigate("/app/products/new")} title="Products" />
      <DataTable<Product>
        title={t("title")}
        i18nNs="products"
        data={products}
        columns={columns}
        isLoading={isLoading}
        searchTerm={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1); // resetea a la primera página al buscar
        }}
        emptyMessage={t("table.empty")}
        searchPlaceholder={t("table.searchPlaceholder")}
        page={page}
        pageSize={pageSize}
        totalItems={total}
        onPageChange={setPage}
        onRowClick={(row) => {
          navigate(`/app/products/${row.id}`);
        }}
        rightSlot={
          <div className="flex flex-wrap gap-2">
            <AsyncSelect<Category>
              mode="filter"
              includeAllOption
              useLabel={false}
              name="productCategoryFilter"
              value={categoryFilter}
              onChange={(value) => {
                setCategoryFilter(value);
                setPage(1);
              }}
              useOptionsHook={useGetCategoriesQuery}
              getOptionLabel={(c) => c.name}
              getOptionValue={(c) => String(c.id)}
              enableSearch
              wrapperClassName="min-w-40"
              labelClassName="text-[10px]"
            />
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
