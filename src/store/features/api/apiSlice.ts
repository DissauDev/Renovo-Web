import { createApi, type BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery, type AxiosBaseQueryArgs, type AxiosBaseQueryError } from './axiosBaseQuery';
import type { RootState } from '../../store';
import { logout } from '../slices/authSlice';

const baseUrl = import.meta.env.VITE_API_URL as string;
//const baseUrl = 'http://localhost:3000/api'

// baseQuery "puro" con axios
const rawBaseQuery = axiosBaseQuery({ baseUrl });

const baseQueryWithAuth: BaseQueryFn<
  AxiosBaseQueryArgs,
  unknown,
  AxiosBaseQueryError
> = async (args, api, extraOptions) => {
  const state = api.getState() as RootState;
  const token = state.auth.accessToken;

  // añadimos Authorization a los headers
  const enhancedArgs: AxiosBaseQueryArgs = {
    ...args,
    headers: {
      ...(args.headers || {}),
       "Renovo-X-Token": "renovo-web",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  const result = await rawBaseQuery(enhancedArgs, api, extraOptions);

  // Manejo centralizado de 401 → logout + redirect
 if (result.error && result.error.status === 401) {
  api.dispatch(logout());

  const currentPath = window.location.pathname;

  // solo redirigir si NO estamos ya en login
  const isLogin =
    currentPath === "/" ||
    currentPath === "/signin" ;

  if (!isLogin) {
    window.location.href = "/"; 
  }
}


  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    'Auth',
    'User',
    'Ticket',
    'Property',
    'Category',
    'Technician',
    'Settings',
    'Product'
  ],
  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  refetchOnReconnect: false,
  keepUnusedDataFor: 300,
  endpoints: () => ({}),
});
