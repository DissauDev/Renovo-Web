import * as React from "react";
import { useNavigate } from "react-router-dom";
import { toastNotify } from "../../../lib/toastNotify";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCreateCategoryMutation } from "../../../store/features/api/categoriesApi.ts";
import { CategoryForm } from "./CategoryForm.tsx";
import { ButtonBack } from "../../../components/layout/ButtonBack.tsx";
import { useTranslation } from "react-i18next";
import { showApiError } from "../../../lib/showApiError.ts";

// ----------------- SCHEMA -----------------
const createCategorySchema = z.object({
  name: z.string().min(2, "Name is required"),

  icon: z.string().min(1, "Select an icon"),
});

type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;

export const CreateCategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [createCategory, { isLoading }] = useCreateCategoryMutation();
  const { t } = useTranslation("categories");

  const { reset } = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      icon: "",
    },
  });

  const onSubmit = async (values: CreateCategoryFormValues) => {
    try {
      console.log("values", values);
      await createCategory(values).unwrap();

      toastNotify(t("toast.created"), "success");

      reset();
      navigate("/app/categories");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showApiError(error, t, "toast.createError");
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      {/* Back button */}
      <ButtonBack />
      {/* Form wrapper */}
      <div className="mt-8 flex justify-center">
        <div className="w-full max-w-xl space-y-6">
          <h1 className="text-xl font-varien text-center text-oxford-blue-800">
            {t("create.title")}
          </h1>

          <CategoryForm
            mode="create"
            isSubmitting={isLoading}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            onSubmitForm={onSubmit}
          />
        </div>
      </div>
    </div>
  );
};
