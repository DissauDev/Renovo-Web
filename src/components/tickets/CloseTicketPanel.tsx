/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { ChevronRightIcon, ChevronDownIcon } from "lucide-react";

import { cn } from "../../lib/utils";
import { CloseTicketForm } from "./CloseTicketForm";
import { useTranslation } from "react-i18next";

export function CloseTicketPanel({
  ticketId,
  defaultWorkSummary,
  defaultInternalNotes,
  defaultImages,
  disabled,
  onClosed,
}: {
  ticketId: number;
  defaultWorkSummary?: string | null;
  defaultInternalNotes?: string | null;
  disabled?: boolean;

  defaultImages: any;
  onClosed?: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  const { t } = useTranslation("tickets");
  const baseUrl = String(import.meta.env.VITE_SERVER_URL || "").replace(
    /\/$/,
    ""
  );

  const defaultPhotos = React.useMemo(() => {
    return (defaultImages ?? [])
      .filter((ti: any) => ti?.kind === "CLOSEOUT")
      .map((ti: any) => {
        const imageId = Number(ti?.imageId ?? ti?.image?.id);
        const rawUrl = String(ti?.image?.url ?? ti?.url ?? "");
        const url = rawUrl.startsWith("http")
          ? rawUrl
          : `${baseUrl}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;
        return { imageId, url };
      })
      .filter((p: any) => Number.isFinite(p.imageId) && !!p.url);
  }, [defaultImages, baseUrl]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header (click to expand) */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full flex items-center justify-between gap-3 px-5 py-4",
          "hover:bg-[var(--color-seashell-50)] transition-colors"
        )}
      >
        <div className="text-left">
          <div className="text-sm font-varien text-oxford-blue-800">
            {t("closePanel.title")}
          </div>
          <div className="text-[11px] text-slate-500">
            {t("closePanel.subtitle")}
          </div>
        </div>

        <span
          className={cn(
            "inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full border",
            open
              ? "bg-[var(--color-cameo-50)] border-[var(--color-cameo-200)] text-[var(--color-oxford-blue-900)]"
              : "bg-white border-slate-200 text-slate-600"
          )}
        >
          {/* Icon with animation */}

          {open ? t("common.hide") : t("common.open")}
          <span className="relative inline-flex h-4 w-4 items-center justify-center">
            <ChevronRightIcon
              className={cn(
                "absolute h-4 w-4 transition-all duration-200 ease-out",
                open
                  ? "opacity-0 -rotate-90 scale-90"
                  : "opacity-100 rotate-0 scale-100"
              )}
            />
            <ChevronDownIcon
              className={cn(
                "absolute h-4 w-4 transition-all duration-200 ease-out",
                open
                  ? "opacity-100 rotate-0 scale-100"
                  : "opacity-0 rotate-90 scale-90"
              )}
            />
          </span>
        </span>
      </button>

      {/* Collapsible body with smooth animation */}
      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <CloseTicketForm
            defaultInternalNotes={defaultInternalNotes}
            defaultWorkSummary={defaultWorkSummary}
            onClosed={onClosed}
            setOpen={setOpen}
            ticketId={ticketId}
            disabled={disabled}
            defaultPhotos={defaultPhotos}
          />
        </div>
      </div>
    </section>
  );
}
