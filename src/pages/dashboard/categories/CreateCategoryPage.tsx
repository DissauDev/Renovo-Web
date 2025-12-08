import * as React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

import { toastNotify } from "../../../lib/toastNotify";
import { FormInput } from "../../../components/atoms/form/FormInput";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  WrenchScrewdriverIcon,
  BoltIcon,
  PaintBrushIcon,
  Cog6ToothIcon,
  FireIcon,
  HomeModernIcon,
} from "@heroicons/react/24/solid";
import { useCreateCategoryMutation } from "../../../store/features/api/categoriesApi.ts";

// ----------------- SCHEMA -----------------
const createCategorySchema = z.object({
  name: z.string().min(2, "Name is required"),

  icon: z.string().min(1, "Select an icon"),
});

type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;

// Icons set
const ICON_OPTIONS = [
  { value: "plumbing", label: "Plumbing", icon: WrenchScrewdriverIcon },
  { value: "electric", label: "Electricity", icon: BoltIcon },
  { value: "painting", label: "Painting", icon: PaintBrushIcon },
  { value: "mechanic", label: "Mechanic", icon: Cog6ToothIcon },
  { value: "fire", label: "Heating/Fire", icon: FireIcon },
  { value: "home", label: "General Construction", icon: HomeModernIcon },
];

// ----------------------------------------------------

export const CreateCategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      icon: "",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedIcon = watch("icon");

  const onSubmit = async (values: CreateCategoryFormValues) => {
    try {
      await createCategory(values).unwrap();

      toastNotify("Category created successfully", "success");
      reset();
      navigate("/app/categories");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      toastNotify(error?.message || "Error creating category", "error");
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate("/app/categories")}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Go back
      </button>

      {/* Form wrapper */}
      <div className="mt-8 flex justify-center">
        <div className="w-full max-w-xl space-y-6">
          <h1 className="text-xl font-varien text-center text-oxford-blue-800">
            Create new category
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white shadow border border-slate-200 rounded-2xl p-6 space-y-6"
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
                      className={`
                        flex flex-col items-center justify-center p-2 rounded-lg border text-xs transition 
                        ${
                          active
                            ? "bg-emerald-50 border-cameo-500 text-cameo-700"
                            : "border-slate-200 hover:bg-slate-50"
                        }
                      `}
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
                disabled={isLoading}
                className="px-4 py-2 rounded-lg bg-oxford-blue-600
                 text-white text-sm font-varien
                 hover:bg-oxford-blue-700 disabled:opacity-60"
              >
                {isLoading ? "Creating..." : "Create Category"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
