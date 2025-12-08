// src/pages/auth/LoginPage.tsx
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { FormInput } from "../../components/atoms/form/FormInput";

import { useNavigate } from "react-router-dom";

import { useSignInMutation } from "../../store/features/api/authApi";
import { toastNotify } from "../../lib/toastNotify";
import { useState } from "react";
import RenovoLogo from "../../assets/images/VH-CIRC_3RENOVO.png";

const loginSchema = z.object({
  email: z.string().min(1, "El email es obligatorio").email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [signIn, { isLoading }] = useSignInMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (
    values: LoginFormValues
  ) => {
    try {
      await signIn(values).unwrap();

      toastNotify("Sign In Success", "success");

      navigate("/app/tickets");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toastNotify(error.message, "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md mx-4">
        <div className="rounded-2xl bg-white shadow-lg border border-slate-200 px-8 py-8">
          <img
            src={RenovoLogo}
            alt={`Renovo Logo`}
            className="w-full size-16 h-full object-cover"
          />
          <div className="my-8 text-center">
            <p className="text-sm font-medium text-slate-500 mt-1 ">
              Log in to manage tickets and work orders.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSubmit(onSubmit)(e);
            }}
            className="space-y-4"
          >
            <FormInput
              label="Email"
              type="email"
              placeholder="tu@correo.com"
              leftIcon={<EnvelopeIcon className="h-4 w-4" />}
              error={errors.email}
              {...register("email")}
            />

            <FormInput
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              leftIcon={<LockClosedIcon className="h-4 w-4" />}
              error={errors.password}
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
              {isLoading ? "Loading..." : "Sing in"}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-[11px] text-slate-400">
          © {new Date().getFullYear()} Renovo Home Solutions · Admin Panel
        </p>
      </div>
    </div>
  );
};
