import * as React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { FormInput } from "../../components/atoms/form/FormInput";
import { cn } from "../../lib/utils";
import { useForgotPasswordMutation } from "../../store/features/api/authApi";
import { showApiError } from "../../lib/showApiError";

const schema = z.object({
  email: z
    .string()
    .min(1, "forgot.validation.emailRequired")
    .email("forgot.validation.emailInvalid"),
});

type Values = z.infer<typeof schema>;

export const ForgotPasswordPage: React.FC = () => {
  const { t } = useTranslation(["auth", "common"]);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const [sent, setSent] = React.useState(false);

  const onSubmit: SubmitHandler<Values> = async (values) => {
    try {
      await forgotPassword({ email: values.email }).unwrap();
      setSent(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showApiError(error, t, "auth.forgot.toasts.error");
    }
  };

  const renderError = (msg?: string) => (msg ? t(msg, msg) : undefined);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-seashell-50">
      <div
        className={cn(
          "w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-sm p-5 md:p-6",
        )}
      >
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-sm font-varien text-oxford-blue-800">
            {t("forgot.title", "Forgot password")}
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            {t(
              "forgot.subtitle",
              "Enter your email and we’ll send you a reset link.",
            )}
          </p>
        </div>

        {/* Success state */}
        {sent ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <p className="text-sm font-semibold text-oxford-blue-800">
              {t("auth:forgot.sent.title", "Check your inbox")}
            </p>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              {t(
                "auth:forgot.sent.body",
                "If the email exists, you’ll receive a password reset link shortly.",
              )}
            </p>

            <div className="mt-4 flex items-center gap-3">
              <Link
                to="/signin"
                className={cn(
                  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-varien",
                  "bg-oxford-blue-600 text-white hover:bg-oxford-blue-700",
                )}
              >
                {t("auth:forgot.actions.backToSignIn", "Back to sign in")}
              </Link>

              <button
                type="button"
                onClick={() => setSent(false)}
                className={cn(
                  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-varien",
                  "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                )}
              >
                {t("auth:forgot.actions.sendAgain", "Send again")}
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <FormInput
              label={t("forgot.fields.email.label", "Email")}
              placeholder={t(
                "forgot.fields.email.placeholder",
                "user@example.com",
              )}
              type="email"
              error={
                errors.email
                  ? {
                      ...errors.email,
                      message: renderError(errors.email.message),
                    }
                  : undefined
              }
              leftIcon={<EnvelopeIcon className="h-4 w-4" />}
              {...register("email")}
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
                ? t("forgot.actions.sending", "Sending...")
                : t("forgot.actions.send", "Send reset link")}
            </button>

            <div className="pt-1">
              <Link
                to="/signin"
                className="text-xs flex flex-row items-center justify-start
                 font-semibold text-oxford-blue-700 hover:text-oxford-blue-900"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2  text-oxford-blue-700 hover:text-oxford-blue-900" />{" "}
                {t("forgot.actions.backToSignIn", "Back to sign in")}
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
