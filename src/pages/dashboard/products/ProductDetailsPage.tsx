// src/pages/products/ProductDetailPage.tsx
import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  ArrowLeftIcon,
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

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
    if (!productId) return;
    try {
      await patchActive({
        id: productId,
        isActive: !typedProduct.isActive,
      }).unwrap();

      toastNotify(
        `Product ${!typedProduct.isActive ? "activated" : "deactivated"}`,
        "success"
      );
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toastNotify(err?.message || "Error toggling product status", "error");
    }
  };

  const handleSubmit = async (values: ProductFormValues) => {
    if (!productId) return;

    try {
      const priceNumber = Number(values.price);
      const priceCents = Math.round(priceNumber * 100);

      await updateProduct({
        id: productId,
        name: values.name,
        description: values.description || undefined,
        priceCents,
        imageUrl: values.imageUrl || undefined,
        categoryId: values.categoryId,
      }).unwrap();

      toastNotify("Product updated successfully", "success");
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      toastNotify(error?.message || "Error updating product", "error");
    }
  };

  if (!productId) {
    return (
      <div className="p-4">
        <p className="text-sm text-red-500">Invalid product id.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-slate-500">
        Loading product details...
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="p-4 space-y-3">
        <p className="text-sm text-red-500">Error loading product.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-xs px-3 py-1 rounded-md border border-slate-300 hover:bg-slate-50"
        >
          Retry
        </button>
      </div>
    );
  }

  const typedProduct = product as Product;
  const createdAt = new Date(typedProduct.createdAt).toLocaleString();
  const priceInDollars = (typedProduct.priceCents ?? 0) / 100;

  return (
    <div className="space-y-5">
      {/* Header + back button */}
      <div className="flex flex-wrap justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-700"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Go Back
            </button>
            <h1 className="text-lg font-varien text-oxford-blue-800">
              Product details
            </h1>
            <p className="text-sm font-semibold text-slate-500">
              View and edit product information. Some fields are read-only.
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
              "Processing..."
            ) : typedProduct.isActive ? (
              <>
                <ShieldExclamationIcon className="size-6 text-white" />{" "}
                {"Desactivate"}{" "}
              </>
            ) : (
              <>
                <CheckBadgeIcon className="size-6 text-emerald-700" />{" "}
                {"Activate"}{" "}
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
            <span>Product ID</span>
          </div>
          <p className="text-sm font-semibold text-slate-700">
            #{typedProduct.id}
          </p>
        </div>

        {/* Category (nombre solo lectura, aunque se puede editar desde el form) */}
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-varien text-slate-500 mb-1">
            <TagIcon className="h-4 w-4" />
            <span>Category</span>
          </div>
          <p
            className="inline-flex items-center rounded-full
           bg-cameo-100 px-2 py-0.5 text-sm font-semibold text-cameo-700"
          >
            {typedProduct.category?.name ?? "No category"}
          </p>
        </div>

        {/* Precio en cents (info técnica) */}
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-varien text-slate-500 mb-1">
            <CurrencyDollarIcon className="h-4 w-4" />
            <span>Price </span>
          </div>
          <p className="text-sm font-semibold text-slate-700">
            $ {typedProduct.priceCents}
            <span className="text-sm text-slate-500"></span>
          </p>
        </div>

        {/* Fecha creación */}
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-varien text-slate-500 mb-1">
            <CalendarDaysIcon className="h-4 w-4" />
            <span>Created at</span>
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
            <span className="font-medium">Current product image</span>
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
              Editable information
            </h2>

            <ProductForm
              mode="edit"
              isSubmitting={isUpdating}
              submitLabel={isUpdating ? "Saving..." : "Save changes"}
              initialValues={{
                name: typedProduct.name,
                description: typedProduct.description ?? "",
                price: Number(priceInDollars.toFixed(2)),
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
