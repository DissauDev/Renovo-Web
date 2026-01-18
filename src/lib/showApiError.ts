// src/lib/showApiError.ts
import { getApiErrorPayload } from "./apiError";
import { toastNotify } from "./toastNotify";
import type { TFunction } from "i18next";


export function showApiError(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  t: TFunction,
  fallbackKey: string
) {
  const { code, params } = getApiErrorPayload(err);


  const message = code
    ? t(`common:errors.${code}`, {
        ...params,
        defaultValue: t(fallbackKey),
      })
    : t(fallbackKey);

  toastNotify(String(message), "error");
}
