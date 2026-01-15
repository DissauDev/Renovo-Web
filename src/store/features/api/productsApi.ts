// src/store/features/api/productsApi.ts
import { apiSlice } from "./apiSlice";

export interface Product {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sku: any;
  costCents: number;
  sellCents: number;
  stockQty: number;
  id: number;
  name: string;
  slug: string | null;
  description: string | null;
  priceCents: number;
  imageUrl: string | null;
  categoryId: number | null;
  createdAt: string;
  updatedAt?: string;
  isActive:boolean;
  archivedAt?: string;
  // Si tu servicio incluye relaciones (category, etc.), agrégalas aquí:
  category?: {
    id: number;
    name: string;
  } | null;
}

export interface ListProductsArgs {
  search?: string;
  categoryId?: number;
  page?: number;
  pageSize?: number;
  active?:boolean;
}
export interface ProductsListResponse {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CreateProductPayload {
  name: string;
  slug?: string;
  description?: string;
  priceCents: number;
  imageUrl?: string;
  categoryId?: number;
  stockQty: number;
  costCents: number;
  sellCents:number;
}

export interface UpdateProductPayload {
  id: number;
  name?: string;
  slug?: string;
  description?: string;
  priceCents?: number;
  imageUrl?: string;
  categoryId?: number;
    stockQty: number;
  costCents: number;
  sellCents:number;
}

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

   
 getProducts: builder.query<ProductsListResponse, ListProductsArgs | void>({
  query: (args) => {
    const params: Record<string, unknown> = {};

    if (args?.search) params.search = args.search;
    if (typeof args?.categoryId === "number") {
      params.categoryId = args.categoryId;
    }
    if (typeof args?.page === "number") {
      params.page = args.page;
    }
    if (typeof args?.pageSize === "number") {
      params.pageSize = args.pageSize;
    }
    if (typeof args?.active === "boolean") {
       params.active = args.active
    }

    return {
      url: "/products",
      method: "GET",
      params,
    };
  },
  providesTags: (result) =>
    result && Array.isArray(result.items)
      ? [
          { type: "Product" as const, id: "LIST" },
          ...result.items.map((p) => ({ type: "Product" as const, id: p.id })),
        ]
      : [{ type: "Product" as const, id: "LIST" }],
}),

    getProductById: builder.query<Product, number>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: "Product" as const, id },
      ],
    }),
    createProduct: builder.mutation<Product, CreateProductPayload>({
      query: (body) => ({
        url: "/products",
        method: "POST",
        data:body,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    updateProduct: builder.mutation<Product, UpdateProductPayload>({
      query: ({ id, ...data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Product" as const, id: "LIST" },
        { type: "Product" as const, id: arg.id },
      ],
    }),
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Product" as const, id: "LIST" },
        { type: "Product" as const, id },
      ],
    }),
    patchProductActive: builder.mutation<
  Product,
  { id: number; isActive: boolean }
>({
  query: ({ id, isActive }) => ({
    url: `/products/${id}/active`,
    method: "PATCH",
    data: { isActive },
  }),
  invalidatesTags: (_result, _error, { id }) => [
    { type: "Product", id },
    { type: "Product", id: "LIST" },
  ],
}),

  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  usePatchProductActiveMutation
} = productsApi;


 