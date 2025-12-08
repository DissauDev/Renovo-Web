// src/pages/categories/CategoryDetailPage.tsx
import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  TagIcon,
  ShieldExclamationIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
  usePatchCategoryActiveMutation,
  type Category,
} from "../../../store/features/api/categoriesApi.ts";
import { toastNotify } from "../../../lib/toastNotify";
import { FormInput } from "../../../components/atoms/form/FormInput";
import { cn } from "../../../lib/utils";

import {
  WrenchScrewdriverIcon,
  BoltIcon,
  PaintBrushIcon,
  Cog6ToothIcon,
  FireIcon,
  HomeModernIcon,
} from "@heroicons/react/24/solid";

// --------- SCHEMA FORM ---------
const categoryFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  icon: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

// Opciones de icono (mismas que en CreateCategoryPage)
const ICON_OPTIONS = [
  { value: "plumbing", label: "Plumbing", icon: WrenchScrewdriverIcon },
  { value: "electric", label: "Electricity", icon: BoltIcon },
  { value: "painting", label: "Painting", icon: PaintBrushIcon },
  { value: "mechanic", label: "Mechanic", icon: Cog6ToothIcon },
  { value: "fire", label: "Heating/Fire", icon: FireIcon },
  { value: "home", label: "General Construction", icon: HomeModernIcon },
];

export const CategoryDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const categoryId = React.useMemo(() => (id ? Number(id) : undefined), [id]);

  const {
    data: category,
    isLoading,
    isError,
    refetch,
  } = useGetCategoryByIdQuery(categoryId!, {
    skip: !categoryId,
  });

  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [patchActive, { isLoading: isToggling }] =
    usePatchCategoryActiveMutation();

  // RHF para edición
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "",
    },
  });

  // Cuando llega la categoría, rellenamos el formulario
  React.useEffect(() => {
    if (category) {
      const typedCategory = category as Category;
      reset({
        name: typedCategory.name ?? "",
      });
    }
  }, [category, reset]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedIcon = watch("icon");

  const handleToggleActive = async () => {
    if (!categoryId || !category) return;
    const typedCategory = category as Category;

    try {
      await patchActive({
        id: categoryId,
        isActive: !typedCategory.isActive,
      }).unwrap();

      toastNotify(
        `Category ${!typedCategory.isActive ? "activated" : "deactivated"}`,
        "success"
      );
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toastNotify(err?.message || "Error toggling category status", "error");
    }
  };

  const onSubmit = async (values: CategoryFormValues) => {
    if (!categoryId) return;

    try {
      await updateCategory({
        id: categoryId,

        name: values.name,
      }).unwrap();

      toastNotify("Category updated successfully", "success");
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      toastNotify(error?.message || "Error updating category", "error");
    }
  };

  if (!categoryId) {
    return (
      <div className="p-4">
        <p className="text-sm text-red-500">Invalid category id.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-slate-500">
        Loading category details...
      </div>
    );
  }

  if (isError || !category) {
    return (
      <div className="p-4 space-y-3">
        <p className="text-sm text-red-500">Error loading category.</p>
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

  const typedCategory = category as Category;
  const createdAt = typedCategory.createdAt
    ? new Date(typedCategory.createdAt).toLocaleString()
    : "—";

  return (
    <div className="space-y-5">
      {/* Header + back button + toggle active */}
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
              Category details
            </h1>
            <p className="text-sm font-semibold text-slate-500">
              View and edit category information. Some fields are read-only.
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleActive}
          disabled={isToggling}
          className={cn(
            "px-3 py-1.5 h-10 text-sm rounded-lg font-varien shadow border transition",
            typedCategory.isActive
              ? "bg-cameo-600 text-white hover:bg-cameo-700 border-cameo-700"
              : "bg-slate-200 text-slate-700 hover:bg-slate-300 border-slate-300"
          )}
        >
          <span className="flex flex-row items-center gap-2">
            {isToggling ? (
              "Processing..."
            ) : typedCategory.isActive ? (
              <>
                <ShieldExclamationIcon className="size-5 text-white" />
                Desactivate
              </>
            ) : (
              <>
                <CheckBadgeIcon className="size-5 text-emerald-700" />
                Activate
              </>
            )}
          </span>
        </button>
      </div>

      {/* Info solo lectura */}
      <div className="grid gap-3 sm:grid-cols-3">
        {/* ID */}
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-varien text-slate-500 mb-1">
            <TagIcon className="h-4 w-4" />
            <span>Category ID</span>
          </div>
          <p className="text-sm font-semibold  text-slate-700">
            #{typedCategory.id}
          </p>
        </div>

        {/* Status */}
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-varien  text-slate-500 mb-1">
            <TagIcon className="h-4 w-4" />
            <span>Status</span>
          </div>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-sm   font-semibold",
              typedCategory.isActive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            )}
          >
            {typedCategory.isActive ? "Active" : "Inactive"}
          </span>
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

      {/* Formulario de edición */}
      <div className="rounded-2xl border border-slate-200 p-3 shadow-sm mx-auto max-w-xl">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-xl flex flex-col items-center bg-white p-4 rounded-2xl">
            <h2 className="text-sm font-varien text-oxford-blue-800 mb-3 w-full text-left">
              Editable information
            </h2>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full space-y-4"
              noValidate
            >
              <FormInput
                label="Category name"
                placeholder="Plumbing, Electric, Painting..."
                error={errors.name}
                {...register("name")}
              />

              {/* ICON SELECT GRID */}
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-medium text-slate-600 tracking-[0.12em] uppercase">
                  Icon
                </label>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {ICON_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const active = selectedIcon === opt.value;

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setValue("icon", opt.value)}
                        className={cn(
                          "flex flex-col items-center justify-center p-2 rounded-lg border text-xs transition",
                          active
                            ? "bg-emerald-50 border-cameo-500 text-cameo-700"
                            : "border-slate-200 hover:bg-slate-50"
                        )}
                      >
                        <Icon className="w-6 h-6 mb-1" />
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {errors.icon && (
                  <p className="text-[11px] text-red-500 mt-0.5">
                    {errors.icon.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className={cn(
                    "px-4 py-2 text-sm rounded-lg",
                    "bg-oxford-blue-600 text-white font-medium font-varien text-sm",
                    "hover:bg-oxford-blue-700",
                    "disabled:opacity-60 disabled:cursor-not-allowed",
                    "shadow-sm"
                  )}
                >
                  {isUpdating ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
