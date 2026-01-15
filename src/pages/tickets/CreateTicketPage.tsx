import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

import { toastNotify } from "../../lib/toastNotify";
import type { RootState } from "../../store/store";
import { useCreateTicketMutation } from "../../store/features/api/ticketsApi";

import {
  TicketForm,
  type TicketFormValues,
} from "../../components/tickets/TicketForm";
import { useTranslation } from "react-i18next";

export const CreateTicketPage: React.FC = () => {
  const navigate = useNavigate();
  const [createTicket, { isLoading }] = useCreateTicketMutation();

  const { t } = useTranslation("tickets");

  const providerId = useSelector(
    (state: RootState) => (state as RootState).auth.user?.id
  ) as number | undefined;

  const handleSubmitForm = async (values: TicketFormValues) => {
    if (!providerId) {
      toastNotify(t("toasts.providerNotFound"), "error");
      return;
    }

    try {
      const payload = {
        title: values.title,
        description: values.description,
        clientName: values.clientName || undefined,
        clientPhone: values.clientPhone || undefined,
        clientEmail: values.clientEmail || undefined,
        address: values.address || undefined,
        categoryId: values.categoryId,
        urgency: values.urgency,
        providerId,
        imageIds: (values.photos || []).map((p) => p.imageId),
      };

      await createTicket(payload).unwrap();
      toastNotify(t("toasts.created"), "success");
      navigate("/app/tickets");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toastNotify(error?.message || t("toasts.createError"), "error");
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-4">
        <button
          type="button"
          onClick={() => navigate("/app/tickets")}
          className="px-4 py-2 text-sm inline-flex items-center justify-center rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-300"
        >
          <ArrowLeftIcon className="size-5 mr-2" />
          {t("details.back")}
        </button>

        <TicketForm
          mode="create"
          isSubmitting={isLoading}
          submitLabel="Create Ticket"
          onCancel={() => navigate("/app/tickets")}
          onSubmitForm={handleSubmitForm}
        />
      </div>
    </div>
  );
};
