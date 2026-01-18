// src/store/features/api/usersApi.ts
import { apiSlice } from "./apiSlice";

// Ajusta si ya tienes estos tipos en `/types`
export type Role = "ADMIN" | "PROVIDER" | "EMPLOYEE" 

export interface User {
  locale: "EN" | "ES" | undefined;
  isActive?: boolean;

  id: number;
  name: string;
  userName?: string | null;
  phone?: string | null;
  email: string;
  role: Role;
  createdAt: string;
  archivedAt?: string;
}

export interface PaginatedUsersResponse {
  items: User[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ListUsersArgs {
  role?: Role;        // 👈 aquí filtras por técnico, proveedor, etc.
  search?: string;
  page?: number;
  pageSize?: number;
  active?: boolean;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
  userName?: string;
  phone?: string;
  sendEmail?:boolean
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
  userName?: string;
  phone?: string;
}

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 Listar usuarios (con filtros por role, search, paginación…)
    getUsers: builder.query<PaginatedUsersResponse, ListUsersArgs | void>({
  query: (args) => {
    const params: Record<string, unknown> = {};

    if (args?.role) params.role = args.role;
    if (args?.search) params.search = args.search;
    if (args?.page) params.page = args.page;
    if (args?.pageSize) params.pageSize = args.pageSize;
    
    if (typeof args?.active === "boolean") {
       params.active = args.active
    }

    return {
      url: "/users",
      method: "GET",
      params,
    };
  },
  providesTags: (result) =>
    result?.items
      ? [
          { type: "User" as const, id: "LIST" },
          ...result.items.map((user) => ({
            type: "User" as const,
            id: user.id,
          })),
        ]
      : [{ type: "User" as const, id: "LIST" }],
}),


    // 🔹 Get by id
    getUserById: builder.query<User, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "User" as const, id: result.id },
              ...(result.role === "EMPLOYEE"
                ? [{ type: "Technician" as const, id: result.id }]
                : []),
            ]
          : [],
    }),

    // 🔹 Crear usuario (técnico, proveedor, etc.)
    createUser: builder.mutation<User, CreateUserPayload>({
      query: (body) => ({
        url: "/users/new",
        method: "POST",
        data: body,
      }),
      invalidatesTags: (result) =>
        result
          ? [
              { type: "User" as const },
              { type: "User" as const, id: result.id },
              ...(result.role === "EMPLOYEE"
                ? [
                    { type: "Technician" as const },
                    { type: "Technician" as const, id: result.id },
                  ]
                : []),
            ]
          : [{ type: "User" as const }],
    }),

    // 🔹 Actualizar usuario
    updateUser: builder.mutation<
      User,
      { id: number; data: UpdateUserPayload }
    >({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, _err, args) => {
        const id = result?.id ?? args.id;
        return [
          { type: "User" as const },
          { type: "User" as const, id },
          { type: "Technician" as const },
          { type: "Technician" as const, id },
        ];
      },
    }),

    // (Opcional) 🔹 Eliminar usuario
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: "User" as const },
        { type: "User" as const, id },
        { type: "Technician" as const },
        { type: "Technician" as const, id },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;

// 👇 Helper específico para TÉCNICOS (empleados)
//   Reutiliza el mismo endpoint pero fija role = "EMPLOYEE"
export const useGetTechniciansQuery = (
  args?: Omit<ListUsersArgs, "role">
) => {
  return useGetUsersQuery({ ...args, role: "EMPLOYEE" });
};
