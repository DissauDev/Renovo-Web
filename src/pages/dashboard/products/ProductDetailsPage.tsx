// src/pages/products/ProductDetailPage.tsx
import * as React from "react";
import { useParams } from "react-router-dom";

import {
  CalendarDaysIcon,
  TagIcon,
  CurrencyDollarIcon,
  PhotoIcon,
  ShieldExclamationIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import {
  useGetProductByIdQuery,
  usePatchProductActiveMutation,
  useUpdateProductMutation,
  type Product,
} from "../../../store/features/api/productsApi";
import {
  ProductForm,
  type ProductFormValues,
} from "../../../components/products/ProductForm";
import { toastNotify } from "../../../lib/toastNotify";
import { useTranslation } from "react-i18next";
import { ButtonBack } from "../../../components/layout/ButtonBack";
import { showApiError } from "../../../lib/showApiError";

export const ProductDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation("products");

  const productId = React.useMemo(() => (id ? Number(id) : undefined), [id]);

  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useGetProductByIdQuery(productId!, {
    skip: !productId,
  });
  const [patchActive, { isLoading: isToggling }] =
    usePatchProductActiveMutation();

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const handleToggleActive = async () => {
    if (!productId || !product) return;
    const typedProduct = product as Product;

    try {
      await patchActive({
        id: productId,
        isActive: !typedProduct.isActive,
      }).unwrap();
      toastNotify(
        t("toasts.toggled", {
          state: !typedProduct.isActive
            ? t("status.active")
            : t("status.inactive"),
        }),
        "success",
      );
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      showApiError(err, t, "errors.toggleActive");
    }
  };

  const handleSubmit = async (values: ProductFormValues) => {
    if (!productId) return;

    try {
      const priceNumber = Number(values.sell);
      const priceCents = Math.round(priceNumber * 100);

      await updateProduct({
        id: productId,
        name: values.name,
        description: values.description || undefined,
        priceCents,
        stockQty: values.stockQty,
        costCents: Math.round(values.cost * 100),
        sellCents: priceCents,
        imageUrl: values.imageUrl || undefined,
        categoryId: values.categoryId,
      }).unwrap();

      toastNotify(t("toasts.updated"), "success");
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showApiError(error, t, "errors.update");
    }
  };

  if (!productId) {
    return (
      <div className="p-4">
        <p className="text-sm text-red-500">{t("errors.invalidId")}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-slate-500">{t("loading.detail")}</div>
    );
  }

  if (isError || !product) {
    return (
      <div className="p-4 space-y-3">
        <p className="text-sm text-red-500">{t("errors.load")}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-xs px-3 py-1 rounded-md border border-slate-300 hover:bg-slate-50"
        >
          {t("actions.retry")}
        </button>
      </div>
    );
  }

  const typedProduct = product as Product;
  const createdAt = new Date(typedProduct.createdAt).toLocaleString();

  return (
    <div className="space-y-5">
      {/* Header + back button */}
      <div className="flex flex-wrap justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <ButtonBack />
            <h1 className="text-lg font-varien text-oxford-blue-800">
              {t("detail.title")}
            </h1>
            <p className="text-sm font-semibold text-slate-500">
              {t("detail.subtitle")}
            </p>
          </div>
        </div>{" "}
        <button
          onClick={handleToggleActive}
          disabled={isToggling}
          className={`px-3 py-1.5 h-10  text-sm rounded-lg font-medium shadow border transition
    ${
      typedProduct.isActive
        ? "bg-cameo-600 text-white hover:bg-cameo-700 border-cameo-700"
        : "bg-slate-200 text-slate-700 hover:bg-slate-300 border-slate-300"
    }`}
        >
          <h4 className="flex flex-row items-center font-varien gap-2">
            {isToggling ? (
              t("actions.processing")
            ) : typedProduct.isActive ? (
              <>
                <ShieldExclamationIcon className="size-6 text-white" />{" "}
                {t("actions.deactivate")}
              </>
            ) : (
              <>
                <CheckBadgeIcon className="size-6 text-emerald-700" />{" "}
                {t("actions.activate")}
              </>
            )}
          </h4>
        </button>
      </div>

      {/* Info solo lectura */}
      <div className="grid gap-3 sm:grid-cols-4">
        {/* ID */}
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-varien text-slate-500 mb-1">
            <TagIcon className="h-4 w-4" />
            <span>{t("detail.cards.productId")}</span>
          </div>
          <p className="text-sm font-semibold text-slate-700">
            #{typedProduct.id}
          </p>
        </div>

        {/* Category (nombre solo lectura, aunque se puede editar desde el form) */}
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-varien text-slate-500 mb-1">
            <TagIcon className="h-4 w-4" />
            <span>{t("detail.cards.category")}</span>
          </div>
          <p
            className="inline-flex items-center rounded-full
           bg-cameo-100 px-2 py-0.5 text-sm font-semibold text-cameo-700"
          >
            {typedProduct.category?.name ?? t("detail.noCategory")}
          </p>
        </div>

        {/* Precio en cents (info técnica) */}
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xs">
          <div className="flex justify-between">
            <div className="flex items-center gap-2 text-sm font-varien text-slate-500 mb-1">
              <CurrencyDollarIcon className="h-4 w-4" />
              <span>{t("detail.cards.sellPrice")} :</span>
            </div>
            <p className="text-sm font-semibold text-slate-700">
              $ {Number((typedProduct.sellCents / 100).toFixed(2))}
              <span className="text-sm text-slate-500"></span>
            </p>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2 text-sm font-varien text-slate-500 mb-1">
              <CurrencyDollarIcon className="h-4 w-4" />
              <span>{t("detail.cards.cost")} :</span>
            </div>
            <p className="text-xs font-semibold text-slate-700">
              $ {Number((typedProduct.costCents / 100).toFixed(2))}
              <span className="text-sm text-slate-500"></span>
            </p>
          </div>
        </div>

        {/* Fecha creación */}
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-varien text-slate-500 mb-1">
            <CalendarDaysIcon className="h-4 w-4" />
            <span>{t("detail.cards.createdAt")}</span>
          </div>
          <p className="text-sm font-semibold text-slate-700">{createdAt}</p>
        </div>
      </div>

      {/* Banner de imagen si existe */}
      {typedProduct.imageUrl && (
        <div
          className="rounded-xl border border-emerald-50 bg-emerald-50/40 px-4 py-3 
        flex items-center gap-3 text-xs text-emerald-900"
        >
          <PhotoIcon className="h-5 w-5" />
          <div className="flex flex-col">
            <span className="font-medium">{t("detail.currentImage")}</span>
            <span className="text-[11px] break-all">
              {typedProduct.imageUrl}
            </span>
          </div>
          <div className="ml-auto hidden sm:block">
            <img
              src={typedProduct.imageUrl}
              alt={typedProduct.name}
              className="h-12 w-12 rounded-lg object-cover border border-emerald-100"
            />
          </div>
        </div>
      )}

      {/* Formulario de edición (reutilizando ProductForm) */}
      <div className="rounded-2xl border border-slate-200 p-6 shadow-sm mx-auto max-w-xl ">
        <div className="flex flex-col items-center">
          {/* Wrapper que controla título + form */}
          <div className="w-full max-w-xl flex flex-col items-center">
            <h2 className="text-sm font-varien text-oxford-blue-800 mb-3 w-full text-left">
              {t("detail.editable")}
            </h2>

            <ProductForm
              mode="edit"
              isSubmitting={isUpdating}
              submitLabel={
                isUpdating ? t("actions.saving") : t("actions.saveChanges")
              }
              initialValues={{
                name: typedProduct.name,
                description: typedProduct.description ?? "",
                stockQty: typedProduct.stockQty,
                sell: Number((typedProduct.sellCents / 100).toFixed(2)),
                cost: Number((typedProduct.costCents / 100).toFixed(2)),
                categoryId: typedProduct.categoryId ?? undefined,
                imageUrl: typedProduct.imageUrl ?? "",
              }}
              onSubmitForm={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
