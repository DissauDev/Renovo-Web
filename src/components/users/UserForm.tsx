import * as React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "../../lib/utils";
import { toast } from "react-toastify";
import { useCreateUserMutation } from "../../store/features/api/userApi";
import { useTranslation } from "react-i18next";
import { showApiError } from "../../lib/showApiError";

import { UserFormFields, type UserFormValues } from "./UserFormFields"; // ✅ nuevo

type Role = "ADMIN" | "PROVIDER" | "EMPLOYEE";

const US_PHONE_REGEX = /^\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

const baseUserSchema = z.object({
  name: z.string().min(1, "validation.nameRequired"),
  userName: z.string().optional(),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || US_PHONE_REGEX.test(val), {
      message: "validation.phoneInvalid",
    }),
  locale: z.enum(["EN", "ES"]),
  email: z
    .string()
    .min(1, "validation.emailRequired")
    .email("validation.emailInvalid"),
  role: z.enum(["ADMIN", "PROVIDER", "EMPLOYEE"]),
});

const createUserSchema = baseUserSchema.extend({
  password: z
    .string()
    .min(8, "validation.passwordMin")
    .regex(/[A-Z]/, "validation.passwordUpper")
    .regex(/[a-z]/, "validation.passwordLower")
    .regex(/\d/, "validation.passwordNumber"),
});

const updateUserSchema = baseUserSchema.extend({
  password: z.string().optional(),
});

type UserFormMode = "create" | "edit";

interface UserFormProps {
  title?: string;
  defaultRole?: Role;
  hideRoleSelect?: boolean;
  onSuccess?: () => void;
  submitLabel?: string;
  className?: string;

  mode?: UserFormMode;
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

  const effectiveDefaults: UserFormValues = {
    name: "",
    userName: "",
    phone: "",
    email: "",
    password: "",
    locale: "EN",
    role: defaultRole,
    ...initialValues,
  };

  const schema = isEditMode ? updateUserSchema : createUserSchema;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
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
        "UserForm in 'edit' mode without onSubmitForm; nothing will be sent.",
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
        locale: "EN",
        email: "",
        password: "",
        role: defaultRole,
      });

      onSuccess?.();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showApiError(error, t, "toasts.createError");
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

  const isSubmitting = !isEditMode && isCreating;

  const renderError = (msg?: string) => (msg ? t(msg, msg) : undefined);

  return (
    <div
      className={cn(
        "w-full rounded-2xl border max-w-2xl border-slate-200 bg-white shadow-sm p-4 md:p-6",
        className,
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
        {/* ✅ Inputs extraídos */}
        <UserFormFields
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          t={t}
          register={register}
          control={control}
          setValue={setValue}
          errors={errors}
          isEditMode={isEditMode}
          hidePasswordField={hidePasswordField}
          hideRoleSelect={hideRoleSelect}
          renderError={renderError}
        />

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
              "transition-colors",
            )}
          >
            {isSubmitting ? t("form.submitting", "Saving...") : submitText}
          </button>
        </div>
      </form>
    </div>
  );
};
