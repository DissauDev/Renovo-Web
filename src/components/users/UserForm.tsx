import * as React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { FormInput } from "../atoms/form/FormInput";
import { cn } from "../../lib/utils";
import { toast } from "react-toastify";
import { useCreateUserMutation } from "../../store/features/api/userApi";
import { FormInputPhone } from "../atoms/form/FormInputPhone";
import { useTranslation } from "react-i18next";

type Role = "ADMIN" | "PROVIDER" | "EMPLOYEE";

const US_PHONE_REGEX = /^\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

//
// 🔹 Zod schemas (create vs edit)
//
const baseUserSchema = z.object({
  name: z.string().min(1, "validation.nameRequired"),
  userName: z.string().optional(),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || US_PHONE_REGEX.test(val), {
      message: "validation.phoneInvalid",
    }),
  email: z
    .string()
    .min(1, "validation.emailRequired")
    .email("validation.emailInvalid"),
  role: z.enum(["ADMIN", "PROVIDER", "EMPLOYEE"]),
});

// create: strong password required
const createUserSchema = baseUserSchema.extend({
  password: z
    .string()
    .min(8, "validation.passwordMin")
    .regex(/[A-Z]/, "validation.passwordUpper")
    .regex(/[a-z]/, "validation.passwordLower")
    .regex(/\d/, "validation.passwordNumber"),
});

// edit: password optional
const updateUserSchema = baseUserSchema.extend({
  password: z.string().optional(),
});

export type UserFormValues = {
  name: string;
  userName?: string;
  phone?: string;
  email: string;
  password?: string;
  role: Role;
};

type UserFormMode = "create" | "edit";

interface UserFormProps {
  title?: string;
  defaultRole?: Role;
  hideRoleSelect?: boolean;
  onSuccess?: () => void;
  submitLabel?: string;
  className?: string;

  mode?: UserFormMode; // default "create"
  initialValues?: Partial<UserFormValues>;
  onSubmitForm?: (values: UserFormValues) => Promise<void> | void;
  hidePasswordField?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  title,
  defaultRole = "EMPLOYEE",
  hideRoleSelect = false,
  onSuccess,
  submitLabel,
  className,
  mode = "create",
  initialValues,
  onSubmitForm,
  hidePasswordField = false,
}) => {
  const { t } = useTranslation("providers");

  const isEditMode = mode === "edit";

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [showPassword, setShowPassword] = React.useState(false);

  const effectiveDefaults: UserFormValues = {
    name: "",
    userName: "",
    phone: "",
    email: "",
    password: "",
    role: defaultRole,
    ...initialValues,
  };

  const schema = isEditMode ? updateUserSchema : createUserSchema;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: effectiveDefaults,
  });

  const onSubmit: SubmitHandler<UserFormValues> = async (values) => {
    const payload: UserFormValues = {
      ...values,
      role: hideRoleSelect ? defaultRole : values.role,
    };

    if (onSubmitForm) {
      await onSubmitForm(payload);
      return;
    }

    if (isEditMode) {
      console.warn(
        "UserForm in 'edit' mode without onSubmitForm; nothing will be sent."
      );
      return;
    }

    try {
      await createUser({
        ...payload,
        sendEmail: true,
        password: payload.password ?? "",
      }).unwrap();

      toast.success(t("toasts.created", "User created successfully"), {
        position: "top-right",
      });

      reset({
        name: "",
        userName: "",
        phone: "",
        email: "",
        password: "",
        role: defaultRole,
      });

      onSuccess?.();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error?.message || t("toasts.createError", "Error creating user"),
        { position: "top-right" }
      );
    }
  };

  const heading =
    title ??
    (isEditMode
      ? t("form.titleEdit", "Edit user")
      : t("form.titleCreate", "Create user"));

  const description = isEditMode
    ? t("form.subtitleEdit", "Update the information for this user.")
    : t("form.subtitleCreate", "Fill the information to create a new user.");

  const submitText =
    submitLabel ??
    (isEditMode
      ? t("form.submitSave", "Save changes")
      : t("form.submitCreate", "Create user"));

  // If you want edit mode loading, pass isSubmitting from parent via onSubmitForm.
  const isSubmitting = !isEditMode && isCreating;

  // helper to render zod error keys -> translated messages
  const renderError = (msg?: string) => (msg ? t(msg, msg) : undefined);

  return (
    <div
      className={cn(
        "w-full rounded-2xl border max-w-2xl border-slate-200 bg-white shadow-sm p-4 md:p-6",
        className
      )}
    >
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-sm font-varien text-oxford-blue-800">{heading}</h2>
        <p className="text-sm font-semibold text-slate-500 mt-1">
          {description}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
                ? {
                    ...errors.email,
                    message: renderError(errors.email.message),
                  }
                : undefined
            }
            {...register("email")}
          />

          {/* Phone */}
          <FormInputPhone
            label={t("form.fields.phone.label", "Phone")}
            placeholder={t(
              "form.fields.phone.placeholder",
              "+1 (555) 123-4567"
            )}
            error={
              errors.phone
                ? {
                    ...errors.phone,
                    message: renderError(errors.phone.message),
                  }
                : undefined
            }
            {...register("phone")}
          />

          {/* Password */}
          {!hidePasswordField && (
            <FormInput
              label={t("form.fields.password.label", "Password")}
              type={showPassword ? "text" : "password"}
              placeholder={t("form.fields.password.placeholder", "••••••••")}
              error={
                errors.password
                  ? {
                      ...errors.password,
                      message: renderError(errors.password.message),
                    }
                  : undefined
              }
              autoComplete={isEditMode ? "off" : "new-password"}
              {...register("password")}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="flex items-center justify-center text-slate-600 hover:text-slate-800 focus:outline-none"
                  aria-label={t(
                    "form.fields.password.toggle",
                    "Toggle password visibility"
                  )}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              }
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
                  "focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                )}
                {...register("role")}
              >
                <option value="ADMIN">{t("roles.admin", "Admin")}</option>
                <option value="PROVIDER">
                  {t("roles.provider", "Provider")}
                </option>
                <option value="EMPLOYEE">
                  {t("roles.employee", "Employee")}
                </option>
              </select>

              {errors.role && (
                <p className="text-[11px] text-red-500 mt-0.5">
                  {renderError(errors.role.message)}
                </p>
              )}
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "inline-flex items-center justify-center w-full rounded-lg",
                "bg-oxford-blue-600 px-4 py-2.5 text-sm font-varien text-white",
                "shadow-sm hover:bg-oxford-blue-700",
                "disabled:opacity-60 disabled:cursor-not-allowed",
                "transition-colors"
              )}
            >
              {isSubmitting ? t("form.submitting", "Saving...") : submitText}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
