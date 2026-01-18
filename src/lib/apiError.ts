// src/lib/apiError.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getApiErrorPayload(err: any): { code?: string; params?: any; message?: string } {
  // RTK Query suele traer: err?.data
  const data = err?.data ?? err?.response?.data ?? err;

  return {
    code: data?.code,
    params: data?.params,
    message: data?.message, // por si hay fallback viejo
  };
}
