// src/features/api/authApi.ts
import { apiSlice } from './apiSlice';
import { logout, setCredentials } from '../slices/authSlice';
import type { AuthUser } from '../slices/authSlice';

type SignInRequest = {
  email: string;
  password: string;
};

type SignUpRequest = {
  email: string;
  password: string;
  name?: string;
  // cualquier otro campo de registro que manejes
};
type ForgotPasswordRequest = { email: string };
type ForgotPasswordResponse = { ok: boolean; code?: string };

type ResetPasswordRequest = { token: string; newPassword: string };
type ResetPasswordResponse = { ok: boolean; code?: string };

type AuthResponse = {
  user: AuthUser;
  accessToken: string;
};
type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

type ChangePasswordResponse = {
  message: string;
};


export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation<AuthResponse, SignInRequest>({
      query: (body) => ({
        url: '/auth/signin', // ⬅️ tu ruta backend
        method: 'POST',
        data: body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              user: data.user,
              accessToken: data.accessToken,
            })
          );
        } catch {
          // error ya manejado por el hook isError, etc.
        }
      },
      invalidatesTags: ['Auth'],
    }),

signUp: builder.mutation<AuthResponse, SignUpRequest>({
  query: (body) => ({
    url: '/auth/signup',
    method: 'POST',
    data: body,
  }),
  async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
    try {
      const { data } = await queryFulfilled;
      // si tu signup también devuelve user + token
      dispatch(
        setCredentials({
          user: data.user,
          accessToken: data.accessToken,
        })
      );
    } catch {
      // manejar error en el componente
    }
  },
  invalidatesTags: ['Auth'],
}),
forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
  query: (body) => ({
    url: "/auth/forgot-password",
    method: "POST",
    data: body,
  }),
}),

resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
  query: (body) => ({
    url: "/auth/reset-password",
    method: "POST",
    data: body,
  }),
}),

  changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordRequest
    >({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        data: body, // 👈 usando axiosBaseQuery, igual que en signIn
      }),
      invalidatesTags: ["User", "Auth"],
    }),
  
logout: builder.mutation<{ message: string }, void>({
  query: () => ({
    url: '/auth/logout',
    method: 'POST',
  }),
  
  async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
    try {
      await queryFulfilled;
    } finally {
      // Limpia Redux + localStorage pase lo que pase
      dispatch(logout());
    }
  },
  invalidatesTags: ['Auth'],
}),
  }),
  overrideExisting: false,
});
export const {
  useSignInMutation,
  useSignUpMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation
} = authApi;

