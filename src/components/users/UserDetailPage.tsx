import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
  type User,
} from "../../store/features/api/userApi";

import {
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
import { useTranslation } from "react-i18next";
import { ButtonBack } from "../layout/ButtonBack";
import { showApiError } from "../../lib/showApiError";
import type { UserFormValues } from "./UserFormFields";
import { UserForm } from "./UserForm";
import { apiSlice } from "../../store/features/api/apiSlice";
import { useAppDispatch } from "../../store/hooks";

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
  const { t } = useTranslation("providers");

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
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await triggerLogout().unwrap();
      dispatch(apiSlice.util.resetApiState());
      navigate("/"); // o la ruta que uses para el login
    } catch (error) {
      console.error(error);
      toastNotify(t("detail.toasts.logoutError"), "error");
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

      toastNotify(t("detail.toasts.updated"), "success");
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showApiError(error, t, "detail.toasts.updateError");
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
        t("detail.toasts.toggled", {
          status: !typedUser.isActive
            ? t("detail.toasts.activated")
            : t("detail.toasts.deactivated"),
        }),
        "success",
      );
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      showApiError(err, t, "detail.toasts.toggleError");
    }
  };

  if (!userId) {
    return (
      <div className="p-4">
        <p className="text-sm text-red-500">{t("detail.invalidId")}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-slate-500">{t("detail.loading")}</div>
    );
  }

  if (isError || !user) {
    return (
      <div className="p-4 space-y-3">
        <p className="text-sm text-red-500">{t("detail.loadError")}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-xs px-3 py-1 rounded-md border border-slate-300 hover:bg-slate-50"
        >
          {t("detail.retry")}
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
          <ButtonBack />
          <h1 className="text-lg font-varien text-oxford-blue-800">
            {t("detail.title")}
          </h1>
          <p className="text-sm text-oxford-blue-600 font-semibold">
            {t("detail.subtitle")}
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
                t("detail.processing")
              ) : typedUser.isActive ? (
                <>
                  <ShieldExclamationIcon className="size-6 text-white" />{" "}
                  {t("detail.deactivate")}
                </>
              ) : (
                <>
                  <CheckBadgeIcon className="size-6 text-emerald-700" />{" "}
                  {t("detail.activate")}
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
            {t("detail.changePassword")}
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
            {isLoggingOut ? t("detail.loggingOut") : t("detail.logout")}
          </button>
        )}
      </div>

      {/* Read-only info */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-varien text-slate-500 mb-1">
            <FingerPrintIcon className="h-4 w-4" />
            <span>{t("detail.cards.userId")}</span>
          </div>
          <p className="text-sm font-semibold text-slate-700">
            #{typedUser.id}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-varien text-slate-500 mb-1">
            <ShieldCheckIcon className="h-4 w-4" />
            <span>{t("detail.cards.role")}</span>
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
            <span>{t("detail.cards.createdAt")}</span>
          </div>
          <p className="text-sm font-semibold text-slate-700">{createdAt}</p>
        </div>
      </div>

      {/* Email de solo lectura si quieres (opcional) */}
      <div
        className="rounded-xl border border-emerald-50 bg-emerald-50/40 px-4 py-3
       flex items-center gap-2 text-xs text-emerald-900"
      >
        <AtSymbolIcon className="h-4 w-4" />
        <div className="flex flex-col">
          <span className="font-semibold text-sm">
            {t("detail.cards.loginEmail")}
          </span>
          <span className="text-[11px]">{typedUser.email}</span>
        </div>
      </div>

      {/* Formulario de edición (reutilizando tu UserForm) */}
      <div className="rounded-2xl border border-slate-200  p-6 shadow-sm mx-auto max-w-lg">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md flex flex-col items-center">
            <h2 className="text-sm font-varien text-oxford-blue-800 mb-3 w-full text-left">
              {t("detail.editable")}
            </h2>

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
                locale: typedUser.locale,
              }}
              submitLabel={isUpdating ? t("detail.saving") : t("detail.save")}
              onSubmitForm={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
