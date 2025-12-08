import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
  type User,
} from "../../store/features/api/userApi";
import { UserForm, type UserFormValues } from "./UserForm";

import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  AtSymbolIcon,
  FingerPrintIcon,
  ArrowLeftStartOnRectangleIcon,
  ShieldExclamationIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import { toastNotify } from "../../lib/toastNotify";
import { useLogoutMutation } from "../../store/features/api/authApi";
import { usePatchProductActiveMutation } from "../../store/features/api/productsApi";

interface Props {
  defaultRoleProp?: "ADMIN" | "PROVIDER" | "EMPLOYEE";
  showLogoutButton?: boolean;
  desactiveUser?: boolean;
}

export const UserDetailPage = ({
  defaultRoleProp,
  showLogoutButton,
  desactiveUser,
}: Props) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const userId = React.useMemo(() => (id ? Number(id) : undefined), [id]);

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useGetUserByIdQuery(userId!, {
    skip: !userId,
  });

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [triggerLogout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await triggerLogout().unwrap(); // backend + limpiar Redux/localStorage
      navigate("/"); // o la ruta que uses para el login
    } catch (error) {
      console.error(error);
      toastNotify("Error logging out", "error");
    }
  };
  const [patchActive, { isLoading: isToggling }] =
    usePatchProductActiveMutation();

  const handleSubmit = async (values: UserFormValues) => {
    if (!userId) return;

    try {
      // No enviamos password ni role desde aquí
      const { ...rest } = values;

      await updateUser({
        id: userId,
        data: rest,
      }).unwrap();

      toastNotify("success", "success");
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      toastNotify(error.message || "Error to update", "error");
    }
  };
  const handleToggleActive = async () => {
    if (!userId) return;
    try {
      await patchActive({
        id: userId,
        isActive: !typedUser.isActive,
      }).unwrap();

      toastNotify(
        `Product ${!typedUser.isActive ? "activated" : "deactivated"}`,
        "success"
      );
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toastNotify(err?.message || "Error toggling product status", "error");
    }
  };
  if (!userId) {
    return (
      <div className="p-4">
        <p className="text-sm text-red-500">Invalid user id.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-slate-500">Loading user details...</div>
    );
  }

  if (isError || !user) {
    return (
      <div className="p-4 space-y-3">
        <p className="text-sm text-red-500">Error loading user.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-xs px-3 py-1 rounded-md border border-slate-300 hover:bg-slate-50"
        >
          Retry
        </button>
      </div>
    );
  }

  const typedUser = user as User;
  const createdAt = new Date(typedUser.createdAt).toLocaleString();

  return (
    <div className="space-y-5">
      {/* Header + back button */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Go Back
          </button>
          <h1 className="text-lg font-varien text-oxford-blue-800">
            User details
          </h1>
          <p className="text-sm text-oxford-blue-600 font-semibold">
            View and edit user information. Some fields are read-only.
          </p>
        </div>

        {desactiveUser ? (
          <button
            onClick={handleToggleActive}
            disabled={isToggling}
            className={`px-3 py-1.5 h-10  text-sm rounded-lg font-medium shadow border transition
           ${
             typedUser.isActive
               ? "bg-cameo-500 text-white hover:bg-cameo-700 border-cameo-700"
               : "bg-slate-200 text-slate-700 hover:bg-slate-300 border-slate-300"
           }`}
          >
            <h4 className="flex flex-row items-center gap-2 font-varien">
              {isToggling ? (
                "Processing..."
              ) : typedUser.isActive ? (
                <>
                  <ShieldExclamationIcon className="size-6 text-white" />{" "}
                  {"Desactivate"}{" "}
                </>
              ) : (
                <>
                  <CheckBadgeIcon className="size-6 text-emerald-700" />{" "}
                  {"Activate"}{" "}
                </>
              )}
            </h4>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate(`/app/user/${userId}/change-password`)}
            className="mt-2 inline-flex items-center gap-1 rounded-lg border
             border-slate-200 px-3 py-1.5 text-sm font-varien text-oxford-blue-700 hover:bg-slate-50"
          >
            <ShieldCheckIcon className="h-5 w-5" />
            Change password
          </button>
        )}

        {showLogoutButton && (
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="mt-2 inline-flex items-center 
            gap-1 rounded-lg border border-persian-red-200 bg-red-50 px-3 py-1.5 text-sm
             font-varien text-persian-red-600 hover:bg-red-100"
          >
            <ArrowLeftStartOnRectangleIcon className="size-5" />{" "}
            {isLoggingOut ? "Logging out..." : "Log out"}
          </button>
        )}
      </div>

      {/* Read-only info */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-varien text-slate-500 mb-1">
            <FingerPrintIcon className="h-4 w-4" />
            <span>User ID</span>
          </div>
          <p className="text-sm font-semibold text-slate-700">
            #{typedUser.id}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-varien text-slate-500 mb-1">
            <ShieldCheckIcon className="h-4 w-4" />
            <span>Role</span>
          </div>
          <p
            className="inline-flex items-center rounded-full bg-cameo-100 px-2 py-0.5 
           font-semibold text-xs text-cameo-600"
          >
            {typedUser.role}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-varien text-slate-500 mb-1">
            <CalendarDaysIcon className="h-4 w-4" />
            <span>Created at</span>
          </div>
          <p
            className="text-sm font-semibold
           text-slate-700"
          >
            {createdAt}
          </p>
        </div>
      </div>

      {/* Email de solo lectura si quieres (opcional) */}
      <div
        className="rounded-xl border border-emerald-50 bg-emerald-50/40 px-4 py-3
       flex items-center gap-2 text-xs text-emerald-900"
      >
        <AtSymbolIcon className="h-4 w-4" />
        <div className="flex flex-col">
          <span className="font-semibold text-sm">Login email</span>
          <span className="text-[11px]">{typedUser.email}</span>
        </div>
      </div>

      {/* Formulario de edición (reutilizando tu UserForm) */}
      <div className="rounded-2xl border border-slate-200  p-6 shadow-sm mx-auto max-w-lg">
        <div className="flex flex-col items-center">
          {/* WRAPPER que controla la alineación del título y el form */}
          <div className="w-full max-w-md flex flex-col items-center">
            {/* TÍTULO centrado respecto al card, pero alineado a la izquierda donde empieza el form */}
            <h2 className="text-sm font-varien text-oxford-blue-800 mb-3 w-full text-left">
              Editable information
            </h2>

            {/* FORM centrado */}
            <UserForm
              mode="edit"
              hidePasswordField
              hideRoleSelect
              defaultRole={defaultRoleProp || "EMPLOYEE"}
              initialValues={{
                name: typedUser.name,
                userName: typedUser.userName ?? "",
                phone: typedUser.phone ?? "",
                email: typedUser.email,
                role: typedUser.role,
              }}
              submitLabel={isUpdating ? "Saving..." : "Save changes"}
              onSubmitForm={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
