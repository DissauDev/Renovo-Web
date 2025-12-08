// src/components/users/UserForm.tsx
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

type Role = "ADMIN" | "PROVIDER" | "EMPLOYEE";

//
// 1) Esquemas Zod separados para crear vs editar
//
const baseUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  userName: z.string().optional(),
  phone: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || /^\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(val),
      {
        message: "Phone must be a valid US number",
      }
    ),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  role: z.enum(["ADMIN", "PROVIDER", "EMPLOYEE"]),
});

// Para crear: password obligatoria y fuerte
const createUserSchema = baseUserSchema.extend({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/\d/, "Must contain at least one number"),
});

// Para editar: password opcional (y en nuestro caso la ocultaremos)
const updateUserSchema = baseUserSchema.extend({
  password: z.string().optional(),
});

// Tipo del formulario (password opcional)
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

  // 🔹 NUEVO: modo de uso
  mode?: UserFormMode; // "create" por defecto

  // 🔹 NUEVO: valores iniciales para editar
  initialValues?: Partial<UserFormValues>;

  // 🔹 NUEVO: submit externo (para update, etc.)
  onSubmitForm?: (values: UserFormValues) => Promise<void> | void;

  // 🔹 NUEVO: ocultar el campo password (para edición)
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
  const isEditMode = mode === "edit";

  // Mutación solo para crear
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [showPassword, setShowPassword] = React.useState(false);

  // Valores por defecto combinando create + initialValues de edición
  const effectiveDefaults: UserFormValues = {
    name: "",
    userName: "",
    phone: "",
    email: "",
    password: "",
    role: defaultRole,
    ...initialValues,
  };

  // Escogemos el schema según modo
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
    // Role efectivo (por si ocultamos el select)
    const payload: UserFormValues = {
      ...values,
      role: hideRoleSelect ? defaultRole : values.role,
    };

    // Si nos pasas un onSubmit externo (modo edición), se usa eso
    if (onSubmitForm) {
      await onSubmitForm(payload);
      return;
    }

    // Sin onSubmitForm, asumimos modo CREATE con RTK-Query interno
    if (isEditMode) {
      console.warn(
        "UserForm in 'edit' mode without onSubmitForm; nothing will be sent."
      );
      return;
    }

    try {
      // Ensure password is always a string to satisfy the CreateUserPayload type
      await createUser({
        ...payload,
        sendEmail: true,
        password: payload.password ?? "",
      }).unwrap();

      toast.success("User created successfully", {
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
      console.error("Create user error:", error);
      toast.error(error?.message || "Error creating user", {
        position: "top-right",
      });
    }
  };

  const heading = title ?? (isEditMode ? "Edit user" : "Create user");
  const description = isEditMode
    ? "Update the information for this user."
    : "Fill the information to create a new user.";

  const submittingLabel =
    submitLabel ?? (isEditMode ? "Save changes" : "Create user");

  const isSubmitting = isEditMode ? false : isCreating;

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
            label="Name"
            placeholder="John Doe"
            error={errors.name}
            {...register("name")}
          />

          {/* Username */}
          <FormInput
            label="Username"
            placeholder="john.doe"
            error={errors.userName}
            {...register("userName")}
          />

          {/* Email */}
          <FormInput
            label="Email"
            type="email"
            placeholder="user@example.com"
            error={errors.email}
            {...register("email")}
          />

          {/* Phone */}
          <FormInputPhone
            label="Phone"
            placeholder="+1 (555) 123-4567"
            error={errors.phone}
            {...register("phone")}
          />

          {/* Password (solo si NO está oculto) */}
          {!hidePasswordField && (
            <div>
              <FormInput
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                error={errors.password}
                autoComplete={isEditMode ? "off" : "new-password"}
                {...register("password")}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
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
            </div>
          )}

          {/* Role */}
          {!hideRoleSelect && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-600 tracking-[0.12em] uppercase">
                Role
              </label>
              <select
                className={cn(
                  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-700",
                  "focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                )}
                {...register("role")}
              >
                <option value="ADMIN">Admin</option>
                <option value="PROVIDER">Provider</option>
                <option value="EMPLOYEE">Employee</option>
              </select>
              {errors.role && (
                <p className="text-[11px] text-red-500 mt-0.5">
                  {errors.role.message}
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
              {isSubmitting ? "Saving..." : submittingLabel}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
