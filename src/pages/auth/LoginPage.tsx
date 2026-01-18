// src/pages/auth/LoginPage.tsx
import * as React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { FormInput } from "../../components/atoms/form/FormInput";
import { useSignInMutation } from "../../store/features/api/authApi";
import { toastNotify } from "../../lib/toastNotify";
import RenovoLogo from "../../assets/images/VH-CIRC_3RENOVO.png";
import RenovoLogo2 from "../../assets/images/LOGOTIPO_3RENOVO.png";
import type { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { AppShell } from "../../components/layout/AppShell";
import { showApiError } from "../../lib/showApiError";

const loginSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(6),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const [signIn, { isLoading }] = useSignInMutation();
  const [showPassword, setShowPassword] = React.useState(false);

  const currentUser = useSelector((state: RootState) => state.auth.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  React.useEffect(() => {
    if (currentUser) navigate("/app/tickets", { replace: true });
  }, [currentUser, navigate]);

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    try {
      await signIn(values).unwrap();
      toastNotify(t("login.toast.success"), "success");
      navigate("/app/tickets");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showApiError(error, t, "login.toast.error");
    }
  };

  return (
    <AppShell
      logoSrc={RenovoLogo2}
      logoAlt={t("login.logoAlt")}
      user={null}
      showUserPill={false}
      contentVariant="centered"
    >
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md mx-4">
          <div className="rounded-2xl bg-white shadow-lg border border-slate-200 px-8 py-8">
            <img
              src={RenovoLogo}
              alt={t("login.logoAlt")}
              className="w-full size-16 h-full object-cover"
            />

            <div className="my-8 text-center">
              <p className="text-sm font-medium text-slate-500 mt-1">
                {t("login.subtitle")}
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void handleSubmit(onSubmit)(e);
              }}
              className="space-y-4"
              noValidate
            >
              <FormInput
                label={t("login.fields.email.label")}
                type="email"
                placeholder={t("login.fields.email.placeholder")}
                leftIcon={<EnvelopeIcon className="h-4 w-4" />}
                error={
                  errors.email
                    ? ({
                        message:
                          errors.email.type === "invalid_string"
                            ? t("login.errors.emailInvalid")
                            : t("login.errors.emailRequired"),
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      } as any)
                    : undefined
                }
                {...register("email")}
              />

              <FormInput
                label={t("login.fields.password.label")}
                type={showPassword ? "text" : "password"}
                placeholder={t("login.fields.password.placeholder")}
                leftIcon={<LockClosedIcon className="h-4 w-4" />}
                error={
                  errors.password
                    ? ({
                        message:
                          errors.password.type === "too_small"
                            ? t("login.errors.passwordMin")
                            : t("login.errors.passwordRequired"),
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      } as any)
                    : undefined
                }
                {...register("password")}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword
                        ? t("login.actions.hidePassword")
                        : t("login.actions.showPassword")
                    }
                    className="flex items-center justify-center text-slate-600 hover:text-slate-800 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                }
              />
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="
      text-xs font-semibold
      text-oxford-blue-700 hover:text-persian-red-700
      underline-offset-4 hover:underline
      transition
    "
                >
                  {t("login.actions.forgotPassword")}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="
                mt-4 w-full inline-flex items-center justify-center
                rounded-lg bg-persian-red-600 px-4 py-2.5
                text-sm font-medium text-white
                font-varien-italic
                shadow-sm hover:bg-persian-red-700
                disabled:opacity-60 disabled:cursor-not-allowed
                transition
              "
              >
                {isLoading
                  ? t("login.actions.loading")
                  : t("login.actions.signIn")}
              </button>
            </form>
          </div>

          <p className="mt-4 text-center text-[11px] text-slate-400">
            © {new Date().getFullYear()} {t("login.footer")}
          </p>
        </div>
      </div>
    </AppShell>
  );
};
