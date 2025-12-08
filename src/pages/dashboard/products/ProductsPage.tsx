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

  const products: Product[] = data?.items ?? [];
  const total = data?.total ?? 0;

  const columns: TableColumn<Product>[] = [
    {
      key: "name",
      header: "Name",
      render: (u) => (
        <span className="font-medium text-slate-800">{u.name}</span>
      ),
    },
    {
      key: "price",
      header: "price",
      render: (u) => <span className="text-slate-600">${u.priceCents}</span>,
    },
    {
      key: "descriptio",
      header: "description",
      render: (u) => (
        <span className="text-slate-600">{u.description ?? "—"}</span>
      ),
    },
    {
      key: "Category",
      header: "Category",
      render: (u) => (
        <span
          className="inline-flex items-center rounded-full bg-indigo-50 px-2
         py-0.5 text-[11px] font-medium text-indigo-700"
        >
          {u.category?.name}
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
      <HeaderTab hadle={() => navigate("/app/products/new")} title="Products" />
      <DataTable<Product>
        title="Products"
        data={products}
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
