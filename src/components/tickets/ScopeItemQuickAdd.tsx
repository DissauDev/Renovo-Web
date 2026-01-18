import * as React from "react";
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { cn } from "../../lib/utils";
import { toastNotify } from "../../lib/toastNotify";
import {
  useCreateScopeItemMutation,
  useUpdateScopeItemMutation,
  useDeleteScopeItemMutation,
} from "../../store/features/api/ticketsApi";
import { useTranslation } from "react-i18next";
import { showApiError } from "../../lib/showApiError";

type ScopeItem = {
  id: number;
  title: string;
  description?: string | null;
  createdAt?: string;
};

const schema = z.object({
  title: z.string().min(3, "tickets:scope.validation.titleMin"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ScopeItemQuickAdd({
  ticketId,
  scopeItems,
  onChanged,
  disabled,
}: {
  ticketId: number;
  scopeItems: ScopeItem[];
  onChanged?: () => void; // refetch()
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(false); // form plegable
  const [editingId, setEditingId] = React.useState<number | null>(null);

  const [createScopeItem, { isLoading: isCreating }] =
    useCreateScopeItemMutation();
  const [updateScopeItem, { isLoading: isUpdating }] =
    useUpdateScopeItemMutation();
  const [deleteScopeItem, { isLoading: isDeleting }] =
    useDeleteScopeItemMutation();

  const isBusy = isCreating || isUpdating || isDeleting;
  const isDisabled = disabled || isBusy;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", description: "" },
  });

  const startCreate = () => {
    setEditingId(null);
    reset({ title: "", description: "" });
    setIsOpen(true);
  };
  const { t } = useTranslation("tickets");

  const startEdit = (item: ScopeItem) => {
    setEditingId(item.id);
    setValue("title", item.title);
    setValue("description", item.description ?? "");
    setIsOpen(true);
  };

  const closeForm = () => {
    setIsOpen(false);
    setEditingId(null);
    reset({ title: "", description: "" });
  };

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      const payload = {
        title: values.title.trim(),
        description: values.description?.trim() || undefined,
      };

      if (!payload.title) return;

      if (editingId) {
        await updateScopeItem({
          ticketId,
          scopeItemId: editingId,
          ...payload,
        }).unwrap();
        toastNotify(t("scope.toast.updated"), "success");
      } else {
        await createScopeItem({
          id: ticketId,
          ...payload,
          kind: "ADD_ON",
        }).unwrap();
        toastNotify(t("scope.toast.added"), "success");
      }

      closeForm();
      onChanged?.();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toastNotify(error?.message || t("scope.toast.saveError"), "error");
    }
  };

  const handleDelete = async (scopeItemId: number) => {
    // UX rápido: confirm simple
    const ok = window.confirm(t("scope.confirmDelete"));
    if (!ok) return;

    try {
      await deleteScopeItem({ ticketId, scopeItemId }).unwrap();
      toastNotify(t("scope.toast.deleted"), "success");
      onChanged?.();
      // si estabas editando ese item, cierra el form
      if (editingId === scopeItemId) closeForm();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showApiError(error, t, "scope.toast.deleteError");
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
      {/* header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-varien text-oxford-blue-800">
            {t("scope.title")}
          </h3>
          <p className="text-[11px] text-slate-500">{t("scope.subtitle")}</p>
        </div>

        <button
          type="button"
          onClick={() => (isOpen ? closeForm() : startCreate())}
          disabled={isDisabled}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium",
            isDisabled
              ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
              : "bg-white text-oxford-blue-800 border-slate-200 hover:bg-[var(--color-cameo-50)]",
          )}
        >
          {isOpen ? (
            <XMarkIcon className="h-4 w-4" />
          ) : (
            <PlusIcon className="h-4 w-4" />
          )}
          {isOpen ? t("common.close") : t("common.new")}
        </button>
      </div>

      {/* list */}
      <div className="space-y-2">
        {scopeItems?.length ? (
          scopeItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                "rounded-xl border border-slate-200 p-3",
                editingId === item.id
                  ? "ring-2 ring-[color:var(--color-persian-red-200)]"
                  : "",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-800 truncate">
                    {item.title}
                  </div>
                  {!!item.description && (
                    <div className="mt-1 text-xs text-slate-600 whitespace-pre-line">
                      {item.description}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    disabled={isDisabled}
                    className={cn(
                      "rounded-lg border px-2 py-1 text-xs",
                      isDisabled
                        ? "bg-slate-100 text-slate-400 border-slate-200"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
                    )}
                    title={t("common.edit")}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    disabled={isDisabled}
                    className={cn(
                      "rounded-lg border px-2 py-1 text-xs",
                      isDisabled
                        ? "bg-slate-100 text-slate-400 border-slate-200"
                        : "bg-white text-red-600 border-slate-200 hover:bg-red-50",
                    )}
                    title={t("common.delete")}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 px-4 py-4 text-xs text-slate-500">
            {t("scope.empty")}
          </div>
        )}
      </div>

      {/* collapsible form */}
      {isOpen && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit(onSubmit)(e);
          }}
          className="rounded-xl border border-slate-200 p-3 space-y-2 bg-[var(--color-seashell-50)]"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-700">
              {editingId
                ? t("scope.form.editTitle")
                : t("scope.form.createTitle")}
            </p>
            {editingId && (
              <button
                type="button"
                onClick={startCreate}
                disabled={isDisabled}
                className="text-[11px] text-slate-600 hover:text-slate-900"
              >
                {t("scope.form.switchToNew")}
              </button>
            )}
          </div>

          <div>
            <input
              {...register("title")}
              placeholder={t("scope.form.titlePlaceholder")}
              disabled={isDisabled}
              className={cn(
                "w-full rounded-lg border px-3 py-2 text-sm outline-none",
                errors.title
                  ? "border-red-300 focus:ring-2 focus:ring-red-200"
                  : "border-slate-200 focus:ring-2 focus:ring-emerald-100",
                isDisabled ? "bg-slate-100" : "bg-white",
              )}
            />
            {errors.title && (
              <p className="mt-1 text-[11px] text-red-500">
                {errors.title.message?.startsWith("tickets:")
                  ? t(errors.title.message.replace("tickets:", ""))
                  : errors.title.message}
              </p>
            )}
          </div>

          <div>
            <textarea
              {...register("description")}
              placeholder={t("scope.form.notesPlaceholder")}
              rows={2}
              disabled={isDisabled}
              className={cn(
                "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-100",
                isDisabled ? "bg-slate-100" : "bg-white",
              )}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isDisabled}
              className={cn(
                "inline-flex flex-1 items-center justify-center rounded-lg px-3 py-2 text-xs font-medium shadow-sm border",
                isDisabled
                  ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                  : "bg-oxford-blue-600 text-white border-oxford-blue-700 hover:bg-oxford-blue-700",
              )}
            >
              {isBusy
                ? t("common.saving")
                : editingId
                  ? t("common.saveChanges")
                  : t("scope.form.add")}
            </button>

            <button
              type="button"
              onClick={closeForm}
              disabled={isDisabled}
              className={cn(
                "inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-medium border",
                isDisabled
                  ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
              )}
            >
              {t("common.cancel")}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
