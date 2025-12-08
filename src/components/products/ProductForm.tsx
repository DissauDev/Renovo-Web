// src/components/products/ProductForm.tsx
import * as React from "react";
import {
  useForm,
  type SubmitHandler,
  type Resolver,
  Controller,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { FormInput } from "../atoms/form/FormInput.tsx";
import { FormTextArea } from "../atoms/form/FormTextArea.tsx";
import { AsyncSelect } from "../atoms/inputs/AsyncSelect.tsx";
import { TicketImagesUploader } from "../atoms/inputs/TicketImagesUploader.tsx";
import { cn } from "../../lib/utils.ts";

import { FormInputNumber } from "../atoms/form/FormInputNumber.tsx";
import type { FieldError } from "react-hook-form";
import {
  useGetCategoriesQuery,
  type Category,
} from "../../store/features/api/categoriesApi.ts.ts";

// 🔍 Esquema Zod (misma lógica que antes)
const productFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  // precio en USD (number), luego lo conviertes a cents en la página
  price: z
    .number({
      message: "Price is required",
    })
    .min(0.01, "Price is required")
    .refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
      message: "Price must be a positive number",
    }),
  categoryId: z.coerce.number().min(1, "Select a category"),
  imageUrl: z
    .string()
    .url("Image must be a valid URL")
    .optional()
    .or(z.literal("")),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

type ProductFormMode = "create" | "edit";

interface ProductFormProps {
  mode: ProductFormMode;
  /** Valores iniciales (para edit). En create se usarán defaults vacíos. */
  initialValues?: Partial<ProductFormValues>;
  /** Texto del botón submit */
  submitLabel?: string;
  /** Loading externo (create/update) */
  isSubmitting?: boolean;
  /** Callback cuando se envía el formulario con datos válidos */
  onSubmitForm: (values: ProductFormValues) => Promise<void> | void;
  /** Callback al cerrar / cancelar (botón X) */
  onCancel?: () => void;
  /** Clase extra para el wrapper del formulario */
  className?: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  mode,
  initialValues,
  submitLabel,
  isSubmitting = false,
  onSubmitForm,
  onCancel,
  className,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(
      productFormSchema
    ) as unknown as Resolver<ProductFormValues>,
    defaultValues: {
      name: initialValues?.name ?? "",
      description: initialValues?.description ?? "",
      // En edit: esperas que initialValues.price venga en USD (ej: 19.99)
      price: initialValues?.price ?? 0,
      categoryId: initialValues?.categoryId ?? 0,
      imageUrl: initialValues?.imageUrl ?? "",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const imageUrl = watch("imageUrl");

  const onSubmit: SubmitHandler<ProductFormValues> = async (values) => {
    await onSubmitForm(values);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit(onSubmit)(e);
      }}
      className={cn(
        "bg-white rounded-2xl shadow border border-slate-200 p-6 space-y-4",
        className
      )}
      noValidate
    >
      {/* Cabecera con botón cerrar */}
      <div className="flex justify-between">
        <div />
        <button
          type="button"
          onClick={onCancel}
          className="px-2 flex flex-row py-1 text-sm items-center justify-center 
          rounded-lg border border-slate-300 text-slate-700 hover:bg-red-500 hover:text-white"
        >
          <XMarkIcon className="size-5" />
        </button>
      </div>

      {/* Nombre */}
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <FormInput
            label="Name"
            type="text"
            name={field.name}
            placeholder="Product name"
            error={fieldState.error as FieldError | undefined}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      {/* Descripción */}
      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <FormTextArea
            label="Description"
            name={field.name}
            placeholder="Describe the product..."
            error={fieldState.error as FieldError | undefined}
            rows={4}
            value={field.value ?? ""}
            onChange={field.onChange}
          />
        )}
      />

      {/* Precio + Categoría */}
      <div className="grid md:grid-cols-2 gap-4 ">
        {/* Price */}
        <Controller
          name="price"
          control={control}
          render={({ field, fieldState }) => (
            <FormInputNumber
              label="Price (USD)"
              name={field.name}
              value={field.value ?? 0}
              onChange={field.onChange}
              variant="price"
              min={0}
              placeholder="99.99"
              error={fieldState.error as FieldError | undefined}
            />
          )}
        />

        {/* Category */}
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <AsyncSelect<Category>
              mode="input"
              useLabel
              label="Category"
              name={field.name}
              value={field.value ? String(field.value) : ""}
              onChange={(val) => field.onChange(Number(val))}
              error={errors.categoryId}
              placeholder="Select category"
              useOptionsHook={useGetCategoriesQuery}
              getOptionLabel={(cat) => cat.name}
              getOptionValue={(cat) => String(cat.id)}
              enableSearch
            />
          )}
        />
      </div>

      {/* Imagen: reutilizamos TicketImagesUploader para una sola imagen */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-600 tracking-[0.12em] uppercase">
          Product image
        </label>
        <TicketImagesUploader
          images={
            imageUrl
              ? [
                  {
                    id: "product-image",
                    url: imageUrl,
                  },
                ]
              : []
          }
          onAddImage={(url) =>
            setValue("imageUrl", url, { shouldValidate: true })
          }
          onRemoveImage={() =>
            setValue("imageUrl", "", { shouldValidate: true })
          }
        />
        {errors.imageUrl && (
          <p className="text-[11px] text-red-500 mt-0.5">
            {errors.imageUrl.message}
          </p>
        )}
      </div>

      {/* Acciones */}
      <div className="flex justify-end gap-2 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "px-4 py-2 text-sm rounded-lg",
            "bg-oxford-blue-600 text-white font-varien",
            "hover:bg-oxford-blue-700",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            "shadow-sm"
          )}
        >
          {isSubmitting
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : submitLabel ??
              (mode === "create" ? "Create product" : "Save changes")}
        </button>
      </div>
    </form>
  );
};
