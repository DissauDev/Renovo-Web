import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { toastNotify } from "../../lib/toastNotify";
import {
  useGetTicketByIdQuery,
  useUpdateTicketMutation,
} from "../../store/features/api/ticketsApi";

import {
  TicketForm,
  type TicketFormValues,
} from "../../components/tickets/TicketForm";
import { useTranslation } from "react-i18next";
import { ButtonBack } from "../../components/layout/ButtonBack";
import { resolveImageUrl } from "../../lib/resolveImageUrl";
import { showApiError } from "../../lib/showApiError";

export const EditTicketPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const ticketId = Number(id);

  const {
    data: ticket,
    isLoading,
    isError,
    refetch,
  } = useGetTicketByIdQuery(ticketId, {
    skip: !ticketId,
  });
  const { t } = useTranslation("tickets");
  const [updateTicket, { isLoading: isUpdating }] = useUpdateTicketMutation();

  if (!ticketId) {
    return (
      <div className="p-4 text-sm text-slate-500">{t("edit.invalidId")}</div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-slate-500">{t("edit.loading")}</div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className="p-4 space-y-3">
        <div className="text-sm text-slate-600">{t("edit.notFound")}</div>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-xs px-3 py-1 rounded-md border border-slate-300 hover:bg-slate-50"
        >
          {t("edit.retry")}
        </button>
      </div>
    );
  }

  const initialValues: Partial<TicketFormValues> = {
    title: ticket.title ?? "",
    description: ticket.description ?? "",
    clientName: ticket.clientName ?? "",
    clientPhone: ticket.clientPhone ?? "",
    clientEmail: ticket.clientEmail ?? "",
    address: ticket.address ?? "",
    categoryId: ticket.categoryId ?? 0,
    urgency: ticket.urgency ?? "MEDIUM",
    photos: (ticket.images ?? [])
      .filter((ti: { kind: string }) => ti.kind === "TICKET")
      .map((ti: { image: { id: string; url: string } }) => ({
        imageId: Number(ti.image.id),
        url: resolveImageUrl(ti.image.url),
      })),
  };

  const handleSubmitForm = async (values: TicketFormValues) => {
    if (ticket.status !== "PENDING") {
      return toastNotify(t("toasts.onlyPendingEditable"), "warning");
    }
    try {
      const data = {
        title: values.title,
        description: values.description,
        clientName: values.clientName || undefined,
        clientPhone: values.clientPhone || undefined,
        clientEmail: values.clientEmail || undefined,
        address: values.address || undefined,
        categoryId: values.categoryId,
        urgency: values.urgency,
        imageIds: (values.photos || []).map((p) => p.imageId),
      };

      await updateTicket({ id: ticketId, data }).unwrap();

      toastNotify(t("toasts.updated"), "success");
      navigate(`/app/tickets/${ticketId}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showApiError(error, t, "toasts.updateError");
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-4">
        <ButtonBack />

        <TicketForm
          mode="edit"
          initialValues={initialValues}
          isSubmitting={isUpdating}
          onCancel={() => navigate(-1)}
          onSubmitForm={handleSubmitForm}
        />
      </div>
    </div>
  );
};
