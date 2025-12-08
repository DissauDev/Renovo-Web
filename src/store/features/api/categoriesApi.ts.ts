import { apiSlice } from "./apiSlice";


export interface Category {
  id: number;
  name: string;
  isActive?: boolean;
  createdAt: string;
  archivedAt?: string | null;
  _count?:{
    items?:number;
    products?:number
  }
}

// Opcional: filtros para listar categorías
export interface ListCategoriesArgs {
  search?: string;
  active?: "true" | "false"; // se mapea a req.query.active
}

// Crear categoría
export interface CreateCategoryPayload {
  name: string;
}

// Actualizar categoría (solo name por ahora)
export interface UpdateCategoryPayload {
  id: number;
  name?: string;
}

// PATCH isActive
export interface PatchCategoryActivePayload {
  id: number;
  isActive: boolean;
}

export const categoriesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
      getCategories: builder.query<Category[], ListCategoriesArgs | void>({
      query: (args) => {
        const params: Record<string, unknown> = {};

        if (args?.search) params.search = args.search;
        if (typeof args?.active === "boolean") {
       params.active = args.active
    }

        return {
          url: "/categories",
          method: "GET",
          params,
        };
      },
      providesTags: (result) =>
        result
          ? [
              { type: "Category" as const, id: "LIST" },
              ...result.map((c) => ({
                type: "Category" as const,
                id: c.id,
              })),
            ]
          : [{ type: "Category" as const, id: "LIST" }],
    }),

    // 🔹 GET BY ID
    getCategoryById: builder.query<Category, number>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _err, id) => [{ type: "Category", id }],
    }),

    // 🔹 CREATE
    createCategory: builder.mutation<Category, CreateCategoryPayload>({
      query: (body) => ({
        url: "/categories",
        method: "POST",
        // 👇 importante: usas `data` en tu baseQuery tipo axios
        data: body,
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),

    // 🔹 UPDATE (PUT /categories/:id)
    updateCategory: builder.mutation<Category, UpdateCategoryPayload>({
      query: ({ id, ...data }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
      ],
    }),

    // 🔹 PATCH isActive ( /categories/:id/active )
    patchCategoryActive: builder.mutation<Category, PatchCategoryActivePayload>(
      {
        query: ({ id, isActive }) => ({
          url: `/categories/${id}/active`,
          method: "PATCH",
          data: { isActive }, // 👈 aquí antes te pasaba que el body llegaba undefined si usabas `body`
        }),
        invalidatesTags: (_res, _err, { id }) => [
          { type: "Category", id },
          { type: "Category", id: "LIST" },
        ],
      }
    ),

    // 🔹 DELETE
    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const { 
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  useGetCategoryByIdQuery,
   usePatchCategoryActiveMutation } = categoriesApi;
