// src/pages/products/CreateProductPage.tsx
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  ProductForm,
  type ProductFormValues,
} from "../../../components/products/ProductForm";
import { useCreateProductMutation } from "../../../store/features/api/productsApi";
import { toastNotify } from "../../../lib/toastNotify";

export const CreateProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const handleCreate = async (values: ProductFormValues) => {
    const priceCents = Math.round(values.price * 100);
    try {
      await createProduct({
        name: values.name,
        description: values.description || undefined,
        priceCents,
        imageUrl: values.imageUrl || undefined,
        categoryId: values.categoryId,
      }).unwrap();

      toastNotify("Product created successfully", "success");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      toastNotify(error?.message || "Error updating product", "error");
    }
  };
  return (
    <div className="min-h-screen px-4 py-8 ">
      {/* Botón volver alineado a la izquierda, fuera del max-w-3xl */}
      <button
        type="button"
        onClick={() => navigate("/app/products")}
        className="inline-flex items-center gap-2 font-semibold rounded-lg border
         border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Go back
      </button>

      {/* Contenedor centrado para el formulario */}
      <div className="mt-6 flex justify-center">
        <div className="w-full max-w-3xl space-y-4">
          <h1 className="text-xl text-center font-varien text-oxford-blue-800">
            Create new product
          </h1>

          <ProductForm
            mode={"create"}
            onSubmitForm={handleCreate}
            isSubmitting={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
