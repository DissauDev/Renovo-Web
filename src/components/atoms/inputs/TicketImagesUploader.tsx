import * as React from "react";
import { useUploadImagesMutation } from "../../../store/features/api/uploadApi";
import { toastNotify } from "../../../lib/toastNotify";
import { cn } from "../../../lib/utils";

interface TicketImageItem {
  id: string;
  url: string;
}

interface TicketImagesUploaderProps {
  images: TicketImageItem[];
  onAddImage: (url: string) => void;
  onRemoveImage: (index: number) => void;
  maxImages?: number;
  label?: string;
  helperText?: string;
}

export const TicketImagesUploader: React.FC<TicketImagesUploaderProps> = ({
  images,
  onAddImage,
  onRemoveImage,
  maxImages = 5,
  label = "Images",
  helperText = "You can upload up to 5 images.",
}) => {
  const [uploadImages, { isLoading: isUploading }] = useUploadImagesMutation();

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    // Evitar superar el máximo
    const availableSlots = maxImages - images.length;
    const files = Array.from(fileList).slice(0, availableSlots);

    if (files.length === 0) {
      toastNotify(
        "You have already reached the maximum number of images.",
        "warning"
      );
      e.target.value = "";
      return;
    }

    try {
      const res = await uploadImages(files).unwrap();

      res.files.forEach((file) => {
        // URL pública final (backend está en localhost:3000)
        const fullUrl = `http://localhost:3000${file.url}`;
        onAddImage(fullUrl);
      });

      toastNotify("Upload success", "success");
      e.target.value = "";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toastNotify(error.message, "error");
    }
  };

  return (
    <div className="space-y-2">
      {/* Label + hint */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
        <span className="text-xs text-slate-400">{helperText}</span>
      </div>

      {/* Input file */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFilesChange}
        disabled={isUploading || images.length >= maxImages}
        className={cn(
          "block w-full text-sm text-slate-600",
          "file:mr-4 file:py-2 file:px-4",
          "file:rounded-lg file:border-0",
          "file:text-sm file:font-semibold",
          "file:bg-oxford-blue-50 file:text-oxford-blue-700",
          "hover:file:bg-oxford-blue-100",
          (isUploading || images.length >= maxImages) &&
            "opacity-60 cursor-not-allowed"
        )}
      />

      {isUploading && (
        <p className="mt-1 text-xs text--oxford-blue-600">Uploading...</p>
      )}

      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
          {images.map((img, index) => (
            <div
              key={img.id}
              className="relative border border-slate-200 rounded-lg overflow-hidden bg-slate-50"
            >
              <img
                src={img.url}
                alt={`Foto ${index + 1}`}
                className="w-full h-24 object-cover"
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
                X
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
