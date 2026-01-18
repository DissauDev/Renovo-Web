// src/pages/categories/CategoryDetailPage.tsx
import * as React from "react";
import { useParams } from "react-router-dom";
import {
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
import { cn } from "../../../lib/utils";

import { CategoryForm } from "./CategoryForm.tsx";
import { useTranslation } from "react-i18next";
import { ButtonBack } from "../../../components/layout/ButtonBack.tsx";
import { showApiError } from "../../../lib/showApiError.ts";

// --------- SCHEMA FORM ---------
const categoryFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  icon: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const CategoryDetailPage: React.FC = () => {
  const { id } = useParams();

  const { t } = useTranslation("categories");

  const categoryId = React.useMemo(() => (id ? Number(id) : undefined), [id]);

  const {
    data: category,
    isLoading,
    isError,
    refetch,
  } = useGetCategoryByIdQuery(categoryId!, {
    skip: !categoryId,
  });
  const typedCategory = category as Category;

  const initialValues: Partial<CategoryFormValues> = {
    name: typedCategory?.name ?? "",
    icon: typedCategory?.icon ?? "",
  };

  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [patchActive, { isLoading: isToggling }] =
    usePatchCategoryActiveMutation();

  // RHF para edición
  const { reset } = useForm<CategoryFormValues>({
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
      reset({
        name: typedCategory.name ?? "",
        icon: typedCategory.icon ?? "",
      });
    }
  }, [category, reset, typedCategory?.icon, typedCategory?.name]);

  const handleToggleActive = async () => {
    if (!categoryId || !category) return;

    try {
      await patchActive({
        id: categoryId,
        isActive: !typedCategory.isActive,
      }).unwrap();

      toastNotify(
        !typedCategory.isActive ? t("toast.activated") : t("toast.deactivated"),
        "success",
      );

      refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      showApiError(err, t, "toast.toggleError");
    }
  };

  const onSubmit = async (values: CategoryFormValues) => {
    if (!categoryId) return;

    try {
      await updateCategory({
        id: categoryId,

        name: values.name,
        icon: values.icon,
      }).unwrap();

      toastNotify(t("toast.updated"), "success");
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showApiError(error, t, "toast.updateError");
    }
  };

  if (!categoryId) {
    return (
      <div className="p-4">
        <p className="text-sm text-red-500">{t("detail.invalidId")}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-slate-500">{t("detail.loading")}</div>
    );
  }

  if (isError || !category) {
    return (
      <div className="p-4 space-y-3">
        <p className="text-sm text-red-500">{t("detail.error")}</p>
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

  const createdAt = typedCategory.createdAt
    ? new Date(typedCategory.createdAt).toLocaleString()
    : "—";

  return (
    <div className="space-y-5">
      {/* Header + back button + toggle active */}
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
        </div>

        <button
          onClick={handleToggleActive}
          disabled={isToggling}
          className={cn(
            "px-3 py-1.5 h-10 text-sm rounded-lg font-varien shadow border transition",
            typedCategory.isActive
              ? "bg-cameo-600 text-white hover:bg-cameo-700 border-cameo-700"
              : "bg-slate-200 text-slate-700 hover:bg-slate-300 border-slate-300",
          )}
        >
          <span className="flex flex-row items-center gap-2">
            {isToggling ? (
              t("actions.processing")
            ) : typedCategory.isActive ? (
              <>
                <ShieldExclamationIcon className="size-5 text-white" />
                {t("actions.deactivate")}
              </>
            ) : (
              <>
                <CheckBadgeIcon className="size-5 text-emerald-700" />
                {t("actions.activate")}
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
            <span>{t("detail.info.categoryId")}</span>
          </div>
          <p className="text-sm font-semibold  text-slate-700">
            #{typedCategory.id}
          </p>
        </div>

        {/* Status */}
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-varien  text-slate-500 mb-1">
            <TagIcon className="h-4 w-4" />
            <span>{t("detail.info.status")}</span>
          </div>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-sm   font-semibold",
              typedCategory.isActive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700",
            )}
          >
            {typedCategory.isActive ? t("status.active") : t("status.inactive")}
          </span>
        </div>

        {/* Fecha creación */}
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-varien text-slate-500 mb-1">
            <CalendarDaysIcon className="h-4 w-4" />
            <span>{t("detail.info.createdAt")}</span>
          </div>
          <p className="text-sm font-semibold text-slate-700">{createdAt}</p>
        </div>
      </div>

      {/* Formulario de edición */}
      <div className="rounded-2xl border border-slate-200 p-3 shadow-sm mx-auto max-w-xl">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-xl flex flex-col items-center bg-white p-4 rounded-2xl">
            <h2 className="text-sm font-varien text-oxford-blue-800 mb-3 w-full text-left">
              {t("detail.editableTitle")}
            </h2>

            <div className="rounded-2xl border border-slate-200 p-3 shadow-sm mx-auto max-w-xl">
              <CategoryForm
                mode="edit"
                initialValues={initialValues}
                isSubmitting={isUpdating}
                onSubmitForm={onSubmit}
                title={t("detail.editableTitle")}
                submitLabel={t("actions.saveChanges")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
