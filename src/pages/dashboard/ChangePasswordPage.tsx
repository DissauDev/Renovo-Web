import * as React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { FormInput } from "../../components/atoms/form/FormInput";
import { cn } from "../../lib/utils";
import { useChangePasswordMutation } from "../../store/features/api/authApi";
import { useTranslation } from "react-i18next";
import { ButtonBack } from "../../components/layout/ButtonBack";

// 🧩 Esquema Zod (mismos campos, solo traducimos mensajes usando t en runtime)
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "currentPasswordRequired"),
    newPassword: z
      .string()
      .min(8, "passwordMin8")
      .regex(/[A-Z]/, "passwordUpper")
      .regex(/[a-z]/, "passwordLower")
      .regex(/\d/, "passwordNumber"),
    confirmPassword: z.string().min(1, "confirmPasswordRequired"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "passwordsDoNotMatch",
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

// 🔐 Evaluador de fuerza de contraseña
function getPasswordStrength(pass: string) {
  if (!pass) {
    return { labelKey: "", level: 0 as 0 | 1 | 2 | 3, color: "bg-slate-200" };
    // color neutro
  }

  let score = 0;

  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[a-z]/.test(pass)) score++;
  if (/\d/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++; // símbolos opcional

  if (score <= 2)
    return {
      labelKey: "strength.weak",
      level: 1 as const,
      color: "bg-red-500",
    };
  if (score === 3 || score === 4)
    return {
      labelKey: "strength.medium",
      level: 2 as const,
      color: "bg-amber-500",
    };
  return {
    labelKey: "strength.strong",
    level: 3 as const,
    color: "bg-emerald-600",
  };
}

export const ChangePasswordPage: React.FC = () => {
  const { t } = useTranslation("auth");
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

      toast.success(t("changePassword.toastSuccess"), {
        position: "top-right",
      });

      reset();
      navigate(-1);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || t("changePassword.toastError"), {
        position: "top-right",
      });
    }
  };

  // Helper para traducir mensajes de zod (usando keys)
  const zodMsg = (msg?: string) => {
    if (!msg) return "";
    return t(`changePassword.validation.${msg}`);
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mb-6 flex flex-col gap-2">
        <div>
          <ButtonBack />
          <div className="w-1 h-1" />
        </div>
        <div className="text-left">
          <h1 className="text-lg font-varien text-oxford-blue-800">
            {t("changePassword.title")}
          </h1>
          <p className="text-sm font-semibold text-slate-500">
            {t("changePassword.subtitle")}
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-3xl">
        {/* Header: back + título (igual estilo que tus detail pages) */}

        {/* Form wrapper (mismo estilo de card que los anteriores) */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-md">
            <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
              >
                {/* Current password */}
                <FormInput
                  label={t("changePassword.fields.currentPassword")}
                  type={showCurrent ? "text" : "password"}
                  placeholder="••••••••"
                  error={
                    errors.currentPassword
                      ? ({
                          ...errors.currentPassword,
                          message: zodMsg(errors.currentPassword.message),
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        } as any)
                      : undefined
                  }
                  autoComplete="current-password"
                  {...register("currentPassword")}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowCurrent((prev) => !prev)}
                      className="flex items-center justify-center text-slate-600 hover:text-slate-800 focus:outline-none"
                      aria-label={t("changePassword.a11y.toggleVisibility")}
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
                    label={t("changePassword.fields.newPassword")}
                    type={showNew ? "text" : "password"}
                    placeholder="••••••••"
                    error={
                      errors.newPassword
                        ? ({
                            ...errors.newPassword,
                            message: zodMsg(errors.newPassword.message),
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          } as any)
                        : undefined
                    }
                    autoComplete="new-password"
                    {...register("newPassword")}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowNew((prev) => !prev)}
                        className="flex items-center justify-center text-slate-600 hover:text-slate-800 focus:outline-none"
                        aria-label={t("changePassword.a11y.toggleVisibility")}
                      >
                        {showNew ? (
                          <LockOpenIcon className="h-4 w-4" />
                        ) : (
                          <LockClosedIcon className="h-4 w-4" />
                        )}
                      </button>
                    }
                  />

                  {/* Medidor de fuerza para new password (mismo layout, colores ok) */}
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
                          "text-xs font-semibold",
                          newStrength.level === 1 && "text-red-500",
                          newStrength.level === 2 && "text-amber-500",
                          newStrength.level === 3 && "text-emerald-600"
                        )}
                      >
                        {newStrength.labelKey
                          ? t("changePassword.strengthLabel", {
                              level: t(
                                `changePassword.${newStrength.labelKey}`
                              ),
                            })
                          : ""}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="space-y-1">
                  <FormInput
                    label={t("changePassword.fields.confirmPassword")}
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    error={
                      errors.confirmPassword
                        ? ({
                            ...errors.confirmPassword,
                            message: zodMsg(errors.confirmPassword.message),
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          } as any)
                        : undefined
                    }
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowConfirm((prev) => !prev)}
                        className="flex items-center justify-center text-slate-600 hover:text-slate-800 focus:outline-none"
                        aria-label={t("changePassword.a11y.toggleVisibility")}
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
                          "text-xs font-semibold",
                          confirmStrength.level === 1 && "text-red-500",
                          confirmStrength.level === 2 && "text-amber-500",
                          confirmStrength.level === 3 && "text-emerald-600"
                        )}
                      >
                        {confirmStrength.labelKey
                          ? t("changePassword.strengthLabel", {
                              level: t(
                                `changePassword.${confirmStrength.labelKey}`
                              ),
                            })
                          : ""}
                      </p>
                    </div>
                  )}
                </div>

                {/* Submit (colores como tus botones came/oxford) */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "mt-2 w-full inline-flex items-center justify-center",
                    "rounded-lg bg-oxford-blue-600 px-4 py-2.5",
                    "text-sm font-varien text-white shadow-sm",
                    "hover:bg-oxford-blue-700",
                    "disabled:opacity-60 disabled:cursor-not-allowed",
                    "transition-colors"
                  )}
                >
                  {isLoading ? t("common.saving") : t("changePassword.submit")}
                </button>
              </form>
            </div>

            {/* hint opcional estilo mini texto */}
            <p className="mt-3 text-[11px] text-slate-500 text-center">
              {t("changePassword.hint")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
