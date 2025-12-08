import type { ApiErrorShape } from "../types/api";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getApiErrorMessage(error: any): string {
  const apiErr = error as { data?: ApiErrorShape };

  return (
    apiErr?.data?.message ??
    error?.error?.message ??
    "Ocurrió un error inesperado"
  );
}
