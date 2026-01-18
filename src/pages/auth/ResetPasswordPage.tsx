import * as React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeSlashIcon, KeyIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { FormInput } from "../../components/atoms/form/FormInput";
import { cn } from "../../lib/utils";
import { useResetPasswordMutation } from "../../store/features/api/authApi";
import { showApiError } from "../../lib/showApiError";

const schema = z
  .object({
    newPassword: z
      .string()
      .min(8, "reset.validation.passwordMin")
      .regex(/[A-Z]/, "reset.validation.passwordUpper")
      .regex(/[a-z]/, "reset.validation.passwordLower")
      .regex(/\d/, "reset.validation.passwordNumber"),
    confirmPassword: z.string().min(1, "auth.reset.validation.confirmRequired"),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "reset.validation.passwordsDontMatch",
    path: ["confirmPassword"],
  });

type Values = z.infer<typeof schema>;

export const ResetPasswordPage: React.FC = () => {
  const { t } = useTranslation(["auth", "common"]);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") || "";

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const [show1, setShow1] = React.useState(false);
  const [show2, setShow2] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const renderError = (msg?: string) => (msg ? t(msg, msg) : undefined);

  const onSubmit: SubmitHandler<Values> = async (values) => {
    if (!token) return;

    try {
      await resetPassword({ token, newPassword: values.newPassword }).unwrap();
      setDone(true);

      // opcional: redirigir después de un click
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showApiError(error, t, "reset.toasts.error");
    }
  };

  // token missing UI
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-seashell-50">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-sm p-5 md:p-6">
          <h1 className="text-sm font-varien text-oxford-blue-800">
            {t("reset.missingToken.title", "Invalid link")}
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1 leading-relaxed">
            {t(
              "reset.missingToken.body",
              "This reset link is missing or invalid. Please request a new one.",
            )}
          </p>

          <div className="mt-4 flex items-center gap-3">
            <Link
              to="/forgot-password"
              className={cn(
                "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-varien",
                "bg-persian-red-600 text-white hover:bg-persian-red-700",
              )}
            >
              {t("reset.missingToken.actions.requestNew", "Request a new link")}
            </Link>

            <Link
              to="/signin"
              className={cn(
                "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-varien",
                "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
              )}
            >
              {t("reset.missingToken.actions.backToSignIn", "Back to sign in")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // success UI
  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-seashell-50">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-sm p-5 md:p-6">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <p className="text-sm font-semibold text-oxford-blue-800">
              {t("reset.done.title", "Password updated")}
            </p>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              {t(
                "reset.done.body",
                "Your password was updated successfully. You can now sign in with your new password.",
              )}
            </p>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/signin")}
                className={cn(
                  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-varien",
                  "bg-oxford-blue-600 text-white hover:bg-oxford-blue-700",
                )}
              >
                {t("reset.done.actions.signIn", "Sign in")}
              </button>

              <Link
                to="/"
                className="text-xs font-semibold text-oxford-blue-700 hover:text-oxford-blue-800"
              >
                {t("reset.done.actions.goHome", "Go to home")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // form UI
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-seashell-50">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-sm p-5 md:p-6">
        <div className="mb-4">
          <h1 className="text-sm font-varien text-oxford-blue-800">
            {t("reset.title", "Reset password")}
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            {t("reset.subtitle", "Create a new password for your account.")}
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <FormInput
            label={t("reset.fields.newPassword.label", "New password")}
            placeholder={t("reset.fields.newPassword.placeholder", "••••••••")}
            type={show1 ? "text" : "password"}
            autoComplete="new-password"
            leftIcon={<KeyIcon className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShow1((p) => !p)}
                className="flex items-center justify-center text-slate-600 hover:text-slate-800 focus:outline-none"
                aria-label={t(
                  "reset.actions.toggle",
                  "Toggle password visibility",
                )}
              >
                {show1 ? (
                  <EyeSlashIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            }
            error={
              errors.newPassword
                ? {
                    ...errors.newPassword,
                    message: renderError(errors.newPassword.message),
                  }
                : undefined
            }
            {...register("newPassword")}
          />

          <FormInput
            label={t("reset.fields.confirmPassword.label", "Confirm password")}
            placeholder={t(
              "reset.fields.confirmPassword.placeholder",
              "••••••••",
            )}
            type={show2 ? "text" : "password"}
            autoComplete="new-password"
            leftIcon={<KeyIcon className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShow2((p) => !p)}
                className="flex items-center justify-center text-slate-600 hover:text-slate-800 focus:outline-none"
                aria-label={t(
                  "reset.actions.toggle",
                  "Toggle password visibility",
                )}
              >
                {show2 ? (
                  <EyeSlashIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            }
            error={
              errors.confirmPassword
                ? {
                    ...errors.confirmPassword,
                    message: renderError(errors.confirmPassword.message),
                  }
                : undefined
            }
            {...register("confirmPassword")}
          />

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "inline-flex items-center justify-center w-full rounded-lg",
              "bg-persian-red-600 px-4 py-2.5 text-sm font-varien text-white",
              "shadow-sm hover:bg-persian-red-700",
              "disabled:opacity-60 disabled:cursor-not-allowed",
              "transition-colors",
            )}
          >
            {isLoading
              ? t("reset.actions.saving", "Saving...")
              : t("reset.actions.save", "Update password")}
          </button>

          <div className="pt-1">
            <Link
              to="/signin"
              className="text-xs font-semibold text-oxford-blue-700 hover:text-oxford-blue-800"
            >
              {t("reset.actions.backToSignIn", "Back to sign in")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
