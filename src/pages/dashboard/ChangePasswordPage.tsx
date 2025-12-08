// src/pages/auth/ChangePasswordPage.tsx
import * as React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LockClosedIcon,
  LockOpenIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { FormInput } from "../../components/atoms/form/FormInput";
import { cn } from "../../lib/utils";
import { useChangePasswordMutation } from "../../store/features/api/authApi";

// 🧩 Esquema Zod
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/\d/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

// 🔐 Evaluador de fuerza de contraseña
function getPasswordStrength(pass: string) {
  if (!pass) {
    return { label: "", level: 0 as 0 | 1 | 2 | 3, color: "bg-slate-200" };
  }

  let score = 0;

  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[a-z]/.test(pass)) score++;
  if (/\d/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++; // símbolos opcional

  if (score <= 2)
    return { label: "Weak", level: 1 as const, color: "bg-red-500" };
  if (score === 3 || score === 4)
    return { label: "Medium", level: 2 as const, color: "bg-amber-500" };
  return { label: "Strong", level: 3 as const, color: "bg-emerald-600" };
}

export const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  // visibilidad por campo
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const newPasswordValue = watch("newPassword") || "";
  const confirmPasswordValue = watch("confirmPassword") || "";

  const newStrength = getPasswordStrength(newPasswordValue);
  const confirmStrength = getPasswordStrength(confirmPasswordValue);

  const onSubmit: SubmitHandler<ChangePasswordFormValues> = async (values) => {
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();

      toast.success("Password updated successfully", {
        position: "top-right",
      });

      reset();
      navigate(-1);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Internal server Errro", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 ">
      <div className=" mx-auto">
        {/* Header: back + título (NO centrado, fuera del form) */}
        <div className="mb-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={cn(
              "inline-flex w-fit items-center gap-1.5 text-xs font-medium",
              "text-slate-600 hover:text-slate-900",
              "px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
            )}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </button>

          <div className="text-left">
            <h1 className="text-sm font-semibold text-slate-900">
              Change password
            </h1>
            <p className="text-[11px] text-slate-500">
              Update your account password securely.
            </p>
          </div>
        </div>

        {/* Solo el formulario va centrado */}
        <div className="w-full flex justify-center ">
          <div className="w-full max-w-md">
            <div className="rounded-2xl bg-white shadow-lg border border-slate-200 px-6 py-6">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
              >
                {/* Current password */}
                <FormInput
                  label="Current password"
                  type={showCurrent ? "text" : "password"}
                  placeholder="••••••••"
                  error={errors.currentPassword}
                  autoComplete="current-password"
                  {...register("currentPassword")}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowCurrent((prev) => !prev)}
                      className="flex items-center justify-center text-slate-600 hover:text-slate-800 focus:outline-none"
                    >
                      {showCurrent ? (
                        <LockOpenIcon className="h-4 w-4" />
                      ) : (
                        <LockClosedIcon className="h-4 w-4" />
                      )}
                    </button>
                  }
                />

                {/* New password */}
                <div className="space-y-1">
                  <FormInput
                    label="New password"
                    type={showNew ? "text" : "password"}
                    placeholder="••••••••"
                    error={errors.newPassword}
                    autoComplete="new-password"
                    {...register("newPassword")}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowNew((prev) => !prev)}
                        className="flex items-center justify-center text-slate-600 hover:text-slate-800 focus:outline-none"
                      >
                        {showNew ? (
                          <LockOpenIcon className="h-4 w-4" />
                        ) : (
                          <LockClosedIcon className="h-4 w-4" />
                        )}
                      </button>
                    }
                  />

                  {/* Medidor de fuerza para new password */}
                  {newPasswordValue && (
                    <div className="space-y-1">
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3].map((lvl) => (
                          <div
                            key={lvl}
                            className={cn(
                              "h-1 flex-1 rounded-full transition-all",
                              lvl <= newStrength.level
                                ? newStrength.color
                                : "bg-slate-200"
                            )}
                          />
                        ))}
                      </div>
                      <p
                        className={cn(
                          "text-xs font-medium",
                          newStrength.level === 1 && "text-red-500",
                          newStrength.level === 2 && "text-amber-500",
                          newStrength.level === 3 && "text-emerald-600"
                        )}
                      >
                        {newStrength.label && `${newStrength.label} password`}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="space-y-1">
                  <FormInput
                    label="Confirm password"
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    error={errors.confirmPassword}
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowConfirm((prev) => !prev)}
                        className="flex items-center justify-center text-slate-600 hover:text-slate-800 focus:outline-none"
                      >
                        {showConfirm ? (
                          <LockOpenIcon className="h-4 w-4" />
                        ) : (
                          <LockClosedIcon className="h-4 w-4" />
                        )}
                      </button>
                    }
                  />

                  {/* Medidor de fuerza para confirm password */}
                  {confirmPasswordValue && (
                    <div className="space-y-1">
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3].map((lvl) => (
                          <div
                            key={lvl}
                            className={cn(
                              "h-1 flex-1 rounded-full transition-all",
                              lvl <= confirmStrength.level
                                ? confirmStrength.color
                                : "bg-slate-200"
                            )}
                          />
                        ))}
                      </div>
                      <p
                        className={cn(
                          "text-xs font-medium",
                          confirmStrength.level === 1 && "text-red-500",
                          confirmStrength.level === 2 && "text-amber-500",
                          confirmStrength.level === 3 && "text-emerald-600"
                        )}
                      >
                        {confirmStrength.label &&
                          `${confirmStrength.label} password`}
                      </p>
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "mt-2 w-full inline-flex items-center justify-center",
                    "rounded-lg bg-emerald-600 px-4 py-2.5",
                    "text-sm font-medium text-white shadow-sm",
                    "hover:bg-emerald-700",
                    "disabled:opacity-60 disabled:cursor-not-allowed",
                    "transition-colors"
                  )}
                >
                  {isLoading ? "Saving..." : "Update password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
