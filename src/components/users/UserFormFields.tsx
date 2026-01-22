/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { Controller } from "react-hook-form";
import { FormInput } from "../atoms/form/FormInput";
import { FormInputPhone } from "../atoms/form/FormInputPhone";
import { LocaleSelect } from "../atoms/inputs/LocaleState";
import { PasswordField } from "../atoms/form/PasswordField";
import { cn } from "../../lib/utils";

type Role = "ADMIN" | "PROVIDER" | "EMPLOYEE";

export type UserFormValues = {
  name: string;
  userName?: string;
  phone?: string;
  email: string;
  password?: string;
  role: Role;
  locale: "EN" | "ES";
};

type Props = {
  t: (key: string, fallback?: string) => string;

  // RHF props
  register: any;
  control: any;
  setValue: any;
  errors: any;

  // UI/behavior
  isEditMode: boolean;
  hidePasswordField: boolean;
  hideRoleSelect: boolean;
  renderError: (msg?: string) => string | undefined;
};

export const UserFormFields: React.FC<Props> = ({
  t,
  register,
  control,
  setValue,
  errors,
  isEditMode,
  hidePasswordField,
  hideRoleSelect,
  renderError,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Name */}
      <FormInput
        label={t("form.fields.name.label", "Name")}
        placeholder={t("form.fields.name.placeholder", "John Doe")}
        error={
          errors.name
            ? { ...errors.name, message: renderError(errors.name.message) }
            : undefined
        }
        {...register("name")}
      />

      {/* Username */}
      <FormInput
        label={t("form.fields.userName.label", "Username")}
        placeholder={t("form.fields.userName.placeholder", "john.doe")}
        error={
          errors.userName
            ? {
                ...errors.userName,
                message: renderError(errors.userName.message),
              }
            : undefined
        }
        {...register("userName")}
      />

      {/* Email */}
      <FormInput
        label={t("form.fields.email.label", "Email")}
        type="email"
        placeholder={t("form.fields.email.placeholder", "user@example.com")}
        error={
          errors.email
            ? { ...errors.email, message: renderError(errors.email.message) }
            : undefined
        }
        {...register("email")}
      />

      {/* Phone */}
      <FormInputPhone
        label={t("form.fields.phone.label", "Phone")}
        placeholder={t("form.fields.phone.placeholder", "+1 (555) 123-4567")}
        error={
          errors.phone
            ? { ...errors.phone, message: renderError(errors.phone.message) }
            : undefined
        }
        {...register("phone")}
      />

      {/* Locale */}
      <Controller
        control={control}
        name="locale"
        render={({ field }) => (
          <LocaleSelect value={field.value} onChange={field.onChange} />
        )}
      />
      {errors.locale && (
        <p className="text-[11px] text-red-500 mt-0.5">
          {renderError(errors.locale.message)}
        </p>
      )}

      {/* Password */}
      {!hidePasswordField && (
        <PasswordField
          t={t}
          hide={hidePasswordField}
          isEditMode={isEditMode}
          register={register}
          setValue={setValue}
          error={errors.password}
          renderError={renderError}
          FormInput={FormInput}
        />
      )}

      {/* Role */}
      {!hideRoleSelect && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600 tracking-[0.12em] uppercase">
            {t("form.fields.role.label", "Role")}
          </label>

          <select
            className={cn(
              "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-700",
              "focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500",
            )}
            {...register("role")}
          >
            <option value="ADMIN">{t("roles.admin", "Admin")}</option>
            <option value="PROVIDER">{t("roles.provider", "Provider")}</option>
            <option value="EMPLOYEE">{t("roles.employee", "Employee")}</option>
          </select>

          {errors.role && (
            <p className="text-[11px] text-red-500 mt-0.5">
              {renderError(errors.role.message)}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
