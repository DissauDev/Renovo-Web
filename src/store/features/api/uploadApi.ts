import { apiSlice } from "./apiSlice";

export interface UploadedFile {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;        // ej: "/uploads/xxx-123.jpg"
  blurhash: string | null;
  width: number | null;
  height: number | null;
}

export interface UploadImagesResponse {
  message: string;
  files: UploadedFile[];
}

/**
 * Mutación para subir una o varias imágenes.
 * Envía un FormData con el campo "files" (mismo nombre que en multer).
 */
export const uploadApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadImages: builder.mutation<UploadImagesResponse, File[]>({
      query: (files) => {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("files", file); // 👈 debe coincidir con upload.array("files")
        });

        return {
          url: "/uploads",
          method: "POST",
          data: formData,
          // NO ponemos Content-Type: axios lo pone con el boundary correcto
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const { useUploadImagesMutation } = uploadApi;
