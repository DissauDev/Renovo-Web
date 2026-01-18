
import { type BaseQueryFn } from "@reduxjs/toolkit/query";
import axios, { type AxiosRequestConfig, AxiosError } from "axios";

export type AxiosBaseQueryArgs = {
  url: string;
  method: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"]; // 🔹 importante
};

export type AxiosBaseQueryError = {
  status: number;
  /** i18n error code coming from backend (preferred) */
  code?: string;
  /** params for interpolation in i18n */
  params?: Record<string, unknown>;
  /** backward-compatible / debugging */
  message?: string;
};

export const axiosBaseQuery =
  ({ baseUrl }: { baseUrl: string } = { baseUrl: "" }): BaseQueryFn<
    AxiosBaseQueryArgs,
    unknown,
    AxiosBaseQueryError
  > =>
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

      // RTK Query expects { error: { ... } }
      // Your backend currently returns: { message: "SOME_CODE" }
      // Future shape supported too: { code: "SOME_CODE", params: {...} }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dataAny = (error.response?.data ?? {}) as any;

      const code =
        dataAny?.code ??
        dataAny?.message ?? // 👈 por ahora tu backend manda el code en "message"
        undefined;

      const errorParams = dataAny?.params ?? undefined;

      return {
        error: {
          status: error.response?.status ?? 500,
          code,
          params: errorParams,
          // keep a message for debugging/back-compat (optional)
          message: dataAny?.message ?? error.message ?? "Unknown error",
        },
      };
    }
  };
