import * as React from "react";
import { useUploadImagesMutation } from "../../../store/features/api/uploadApi";
import { toastNotify } from "../../../lib/toastNotify";
import { cn } from "../../../lib/utils";
import { useTranslation } from "react-i18next";

interface TicketImageItem {
  id: string;
  url: string;
}

interface UploadAddedImage {
  imageId: number;
  url: string;
}

interface TicketImagesUploaderProps {
  images: TicketImageItem[];
  onAddImage: (img: UploadAddedImage) => void;
  onRemoveImage: (index: number) => void;
  maxImages?: number;
  label?: string;
  helperText?: string;
}

function trimTrailingSlash(s: string) {
  return s.replace(/\/$/, "");
}

/**
 * Convierte SIEMPRE a URL absoluta:
 * - si viene http/https -> deja igual
 * - si viene /uploads/... o uploads/... -> antepone baseUrl
 * - si viene vacío -> devuelve ""
 */
function toAbsoluteUrl(url: string, baseUrl: string) {
  const raw = String(url || "").trim();
  if (!raw) return "";

  // ya es absoluta
  if (/^https?:\/\//i.test(raw)) return raw;

  const base = trimTrailingSlash(String(baseUrl || "").trim());

  // si no hay base, devolvemos raw (mejor que romper, pero se intentará cargar relativo)
  if (!base) return raw;

  // normaliza slash entre base y path
  return `${base}${raw.startsWith("/") ? "" : "/"}${raw}`;
}

export const TicketImagesUploader: React.FC<TicketImagesUploaderProps> = ({
  images,
  onAddImage,
  onRemoveImage,
  maxImages = 5,
  label,
  helperText,
}) => {
  const { t } = useTranslation("tickets");
  const [uploadImages, { isLoading: isUploading }] = useUploadImagesMutation();

  // ✅ usa el mismo criterio en TODA la app (API_URL primero, fallback SERVER_URL)
  const baseUrl = React.useMemo(() => {
    return String(
      import.meta.env.VITE_API_URL || import.meta.env.VITE_SERVER_URL || ""
    );
  }, []);

  // ✅ defaults traducidos (pero permitiendo override por props)
  const resolvedLabel = label ?? t("uploader.label");
  const resolvedHelperText =
    helperText ?? t("uploader.helperText", { max: maxImages });

  // ✅ blindaje: aunque te pasen "/uploads/..." lo convertimos a absoluto
  const safeImages = React.useMemo(() => {
    return (images || [])
      .map((img) => ({
        ...img,
        url: toAbsoluteUrl(img?.url, baseUrl),
      }))
      .filter((img) => !!img.url);
  }, [images, baseUrl]);

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const availableSlots = Math.max(0, maxImages - safeImages.length);
    const files = Array.from(fileList).slice(0, availableSlots);

    if (files.length === 0) {
      toastNotify(t("uploader.maxReached"), "warning");
      e.target.value = "";
      return;
    }

    try {
      const res = await uploadImages(files).unwrap();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      (res.files || []).forEach((file: { id: number; url: string }) => {
        const fullUrl = toAbsoluteUrl(file?.url, baseUrl);
        onAddImage({ imageId: Number(file.id), url: fullUrl });
      });

      toastNotify(t("uploader.success"), "success");
      e.target.value = "";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toastNotify(error?.message || "Upload error", "error");
    }
  };

  return (
    <div className="space-y-2">
      {/* Label + hint */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-700">
          {resolvedLabel}
        </label>
        <span className="text-xs text-slate-400">{resolvedHelperText}</span>
      </div>

      {/* Input file */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFilesChange}
        disabled={isUploading || safeImages.length >= maxImages}
        className={cn(
          "block w-full text-sm text-slate-600",
          "file:mr-4 file:py-2 file:px-4",
          "file:rounded-lg file:border-0",
          "file:text-sm file:font-semibold",
          "file:bg-oxford-blue-50 file:text-oxford-blue-700",
          "hover:file:bg-oxford-blue-100",
          (isUploading || safeImages.length >= maxImages) &&
            "opacity-60 cursor-not-allowed"
        )}
      />

      {isUploading && (
        <p className="mt-1 text-xs text-oxford-blue-600">
          {t("uploader.uploading")}
        </p>
      )}

      {/* Thumbnails */}
      {safeImages.length > 0 && (
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
          {safeImages.map((img, index) => (
            <div
              key={img.id}
              className="relative border border-slate-200 rounded-lg overflow-hidden bg-slate-50"
            >
              <img
                src={img.url}
                alt={t("uploader.photoAlt", { index: index + 1 })}
                className="w-full h-24 object-cover"
                // ✅ si algo raro pasa, al menos no rompe el layout
                onError={(ev) => {
                  // opcional: puedes poner un placeholder local si tienes uno
                  (ev.currentTarget as HTMLImageElement).style.opacity = "0.3";
                }}
              />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="
                  absolute top-1 right-1 text-[10px]
                  bg-black/60 text-white px-1.5 py-0.5 rounded
                  hover:bg-black/80 transition
                "
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
