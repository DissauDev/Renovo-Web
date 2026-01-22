/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/forms/PasswordField.tsx
import * as React from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { generateRandomPassword } from "../../../utils/password";

type RHFError = { message?: string | undefined };

type Props = {
  t: (key: string, fallback?: string) => string;
  hide?: boolean;

  // RHF
  register: any; // si tienes tipos de RHF en tu proyecto, lo tipamos mejor
  name?: string; // default "password"
  error?: RHFError;

  // helpers
  renderError?: (msg: string | undefined) => string | undefined;

  // modo
  isEditMode?: boolean;

  // para setear el valor en RHF al generar
  setValue: (
    name: string,
    value: any,
    options?: {
      shouldValidate?: boolean;
      shouldDirty?: boolean;
      shouldTouch?: boolean;
    },
  ) => void;

  // si quieres reaccionar al generar (toast, copiar, etc.)
  onGenerated?: (password: string) => void;

  // tu componente existente
  FormInput: React.ComponentType<any>;
};

export const PasswordField: React.FC<Props> = ({
  t,
  hide,
  register,
  name = "password",
  error,
  renderError,
  isEditMode,
  setValue,
  onGenerated,
  FormInput,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  if (hide) return null;

  const finalError = error
    ? {
        ...error,
        message: renderError
          ? renderError((error as any).message)
          : (error as any).message,
      }
    : undefined;

  const handleGenerate = () => {
    const pwd = generateRandomPassword(12);
    setValue(name, pwd, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setShowPassword(true); // opcional: mostrarla al generarla
    onGenerated?.(pwd);
  };

  return (
    <FormInput
      label={t("form.fields.password.label", "Password")}
      type={showPassword ? "text" : "password"}
      placeholder={t("form.fields.password.placeholder", "••••••••")}
      error={finalError}
      autoComplete={isEditMode ? "off" : "new-password"}
      {...register(name)}
      rightIcon={
        <div className="flex items-center gap-1">
          {/* Generar */}
          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 focus:outline-none"
            aria-label={t("form.fields.password.generate", "Generate password")}
            title={t("form.fields.password.generate", "Generate password")}
          >
            {t("form.fields.password.generateShort", "Gen")}
          </button>

          {/* Mostrar/Ocultar */}
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="flex items-center justify-center text-slate-600 hover:text-slate-800 focus:outline-none"
            aria-label={t(
              "form.fields.password.toggle",
              "Toggle password visibility",
            )}
            title={t(
              "form.fields.password.toggle",
              "Toggle password visibility",
            )}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      }
    />
  );
};
