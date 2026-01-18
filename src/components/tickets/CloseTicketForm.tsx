/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toastNotify } from "../../lib/toastNotify";
import { useCloseTicketMutation } from "../../store/features/api/ticketsApi";
import { Button } from "../ui/button";
import { FormTextArea } from "../atoms/form/FormTextArea";
import { TicketImagesUploader } from "../atoms/inputs/TicketImagesUploader";

import {
  closeTicketSchema,
  type CloseTicketFormValues,
} from "./CloseTicketSchema";
import { CloseLineItemRow } from "./CloseLineItemRow";
import { useTranslation } from "react-i18next";
import { showApiError } from "../../lib/showApiError";

type Props = {
  ticketId: number;
  defaultWorkSummary?: string | null;
  defaultInternalNotes?: string | null;

  // ✅ para mostrar defaults de fotos (CLOSEOUT) si ya existen
  defaultPhotos?: { imageId: number; url: string }[] | null;

  disabled?: boolean;
  onClosed?: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function CloseTicketForm({
  ticketId,
  defaultInternalNotes,
  defaultWorkSummary,
  defaultPhotos,
  disabled,
  onClosed,
  setOpen,
}: Props) {
  const [closeTicket, { isLoading }] = useCloseTicketMutation();
  const { t } = useTranslation("tickets");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CloseTicketFormValues>({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    resolver: zodResolver(closeTicketSchema),
    defaultValues: {
      workSummary: defaultWorkSummary ?? "",
      notesInternal: defaultInternalNotes ?? "",
      lineItems: [],
      photos: defaultPhotos ?? [],
    },
  });

  // ✅ Line items
  const {
    fields: lineItemFields,
    append: appendLineItem,
    remove: removeLineItem,
  } = useFieldArray({
    control,
    name: "lineItems",
  });

  // ✅ Closeout photos (checkout)
  const {
    fields: photoFields,
    append: appendPhoto,
    remove: removePhoto,
    replace: replacePhotos,
  } = useFieldArray({
    control,
    name: "photos",
  });

  React.useEffect(() => {
    // si llega null/undefined -> deja vacío
    replacePhotos(defaultPhotos ?? []);
  }, [defaultPhotos, replacePhotos]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const items = watch("lineItems");
  const isDisabled = disabled || isLoading;

  const onSubmit: SubmitHandler<CloseTicketFormValues> = async (values) => {
    try {
      const normalizedLineItems = (values.lineItems || [])
        .filter((it) => it && it.quantity && Number(it.quantity) > 0)
        .map((it) => {
          if (it.kind === "INVENTORY") {
            return {
              kind: "INVENTORY" as const,
              productId: Number(it.productId),
              quantity: Number(it.quantity),
              notes: it.note?.trim() || undefined,
            };
          }
          return {
            kind: "NON_INVENTORY" as const,
            nameSnapshot: (it.name || "").trim(),
            quantity: Number(it.quantity),
            notes: it.note?.trim() || undefined,
          };
        });

      await closeTicket({
        id: ticketId,
        workSummary: values.workSummary?.trim() || undefined,
        notesInternal: values.notesInternal?.trim() || undefined,

        // ✅ NUEVO: ids de fotos de cierre (checkout)
        closeoutImageIds: (values.photos || []).map((p) => p.imageId),

        ...(normalizedLineItems.length
          ? { lineItems: normalizedLineItems }
          : {}),
      } as any).unwrap();

      toastNotify(t("closeForm.toast.closed"), "success");
      setOpen(false);
      onClosed?.();
    } catch (error: any) {
      console.log(error.code);
      showApiError(error, t, "closeForm.toast.error");
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        void handleSubmit(onSubmit)(e);
      }}
      className="px-5 pb-5 space-y-5"
    >
      {/* Summary + internal note */}
      <div className="grid gap-4 lg:grid-cols-2">
        <FormTextArea
          label={t("closeForm.fields.workSummary.label")}
          rows={3}
          {...register("workSummary")}
          placeholder={t("closeForm.fields.workSummary.placeholder")}
          className="rounded-xl"
        />

        <FormTextArea
          label={t("closeForm.fields.internalNote.label")}
          rows={3}
          {...register("notesInternal")}
          placeholder={t("closeForm.fields.internalNote.placeholder")}
          className="rounded-xl"
        />
      </div>

      {/* ✅ Closeout / checkout photos */}
      <TicketImagesUploader
        images={photoFields.map((f: any) => ({
          id: String(f.imageId),
          url: f.url,
        }))}
        onAddImage={(img) => appendPhoto(img)} // img = { imageId, url }
        onRemoveImage={removePhoto}
      />

      {/* Line items header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-varien text-oxford-blue-800">
            {t("closeForm.materials.title")}
          </div>
          <div className="text-[11px] text-slate-500">
            {t("closeForm.materials.subtitle")}
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          onClick={() =>
            appendLineItem({
              kind: "INVENTORY",
              productId: undefined,
              name: "",
              quantity: 1,
              note: "",
            })
          }
          disabled={isDisabled}
        >
          {t("closeForm.materials.addItem")}
        </Button>
      </div>

      {lineItemFields.length > 0 && (
        <div className="space-y-3">
          {lineItemFields.map((f, idx) => (
            <CloseLineItemRow
              key={f.id}
              idx={idx}
              kind={items?.[idx]?.kind}
              control={control}
              register={register}
              setValue={setValue}
              remove={removeLineItem}
              canRemove={true}
              isDisabled={isDisabled}
              errors={errors}
            />
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2 sm:justify-end pt-2">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          onClick={() => setOpen(false)}
          disabled={isDisabled}
        >
          {t("common.cancel")}
        </Button>
        <Button
          type="submit"
          className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
          disabled={isDisabled}
        >
          {isLoading
            ? t("closeForm.actions.closing")
            : t("closeForm.actions.close")}
        </Button>
      </div>

      <p className="text-[11px] text-slate-500">{t("closeForm.laborNote")}</p>
    </form>
  );
}
