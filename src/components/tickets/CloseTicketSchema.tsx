import { z } from "zod";

export const closeTicketSchema = z.object({
  workSummary: z
    .string()
    .max(2000, "tickets:closeForm.validation.workSummaryMax")
    .optional(),
  photos: z
    .array(
      z.object({
        imageId: z.coerce.number().int().positive(),
        url: z.string().url(),
      })
    )
    .optional(),
  notesInternal: z
    .string()
    .max(2000, "tickets:closeForm.validation.internalNoteMax")
    .optional(),

  lineItems: z
    .array(
      z
        .object({
          kind: z.enum(["INVENTORY", "NON_INVENTORY"]).default("INVENTORY"),

          // En tu UI tú tratas productId como "string | ''", perfecto.
          productId: z.string().optional(),

          name: z.string().optional(),

          quantity: z.coerce
            .number()
            .int("tickets:closeForm.validation.qtyInteger")
            .min(1, "tickets:closeForm.validation.qtyMin")
            .default(1),

          note: z
            .string()
            .max(500, "tickets:closeForm.validation.noteMax")
            .optional(),
        })
        .superRefine((val, ctx) => {
          if (val.kind === "INVENTORY") {
            const pid = (val.productId ?? "").trim();
            if (!pid) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "tickets:closeForm.validation.productRequired",
                path: ["productId"],
              });
            }
          }

          if (val.kind === "NON_INVENTORY") {
            const name = (val.name ?? "").trim();
            if (name.length < 2) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "tickets:closeForm.validation.nameRequired",
                path: ["name"],
              });
            }
          }
        })
    )
    .optional(),
});

export type CloseTicketFormValues = z.infer<typeof closeTicketSchema>;
