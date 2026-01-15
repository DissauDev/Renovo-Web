// src/pages/products/CreateProductPage.tsx
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  ProductForm,
  type ProductFormValues,
} from "../../../components/products/ProductForm";
import { useCreateProductMutation } from "../../../store/features/api/productsApi";
import { toastNotify } from "../../../lib/toastNotify";
import { ButtonBack } from "../../../components/layout/ButtonBack";

export const CreateProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("products");
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const handleCreate = async (values: ProductFormValues) => {
    const sellCents = Math.round(Number(values.sell || 0) * 100);
    const costCents = Math.round(Number(values.cost || 0) * 100);

    try {
      await createProduct({
        name: values.name.trim(),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        sku: values.sku?.trim() || undefined,
        description: values.description?.trim() || undefined,
        priceCents: sellCents, // si tu backend aún lo usa
        sellCents,
        costCents,
        stockQty: Number(values.stockQty ?? 0),
        imageUrl: values.imageUrl?.trim() || undefined,
        categoryId: Number(values.categoryId),
      }).unwrap();

      toastNotify(
        t("toast.createdSuccess", "Product created successfully"),
        "success"
      );
      navigate("/app/products");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toastNotify(
        error?.message || t("toast.createError", "Error creating product"),
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      {/* Back */}
      <ButtonBack />

      {/* Centered form */}
      <div className="mt-6 flex justify-center">
        <div className="w-full max-w-3xl space-y-4">
          <h1 className="text-xl text-center font-varien text-oxford-blue-800">
            {t("create.title", "Create new product")}
          </h1>

          <ProductForm
            mode="create"
            onSubmitForm={handleCreate}
            isSubmitting={isLoading}
            onCancel={() => navigate("/app/products")}
          />
        </div>
      </div>
    </div>
  );
};
