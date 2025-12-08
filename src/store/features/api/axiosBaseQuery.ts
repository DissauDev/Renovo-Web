/* eslint-disable @typescript-eslint/ban-ts-comment */
import { type BaseQueryFn } from '@reduxjs/toolkit/query';
import axios, { type AxiosRequestConfig, AxiosError } from 'axios';

export type AxiosBaseQueryArgs = {
  url: string;
  method: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
  headers?: AxiosRequestConfig['headers']; // 🔹 importante
};

export type AxiosBaseQueryError = {
  status: number;
  message: string;
};

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' }
  ): BaseQueryFn<AxiosBaseQueryArgs, unknown, AxiosBaseQueryError> =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await axios.request({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
        withCredentials: false, // ponlo en true si usas cookies
      });

      return { data: result.data };
    } catch (err) {
      const error = err as AxiosError;

      return {
        error: {
          status: error.response?.status ?? 500,
          // @ts-ignore
          message:
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error.response?.data as any)?.message ??
            error.message ??
            'Unknown error',
        },
      };
    }
  };
