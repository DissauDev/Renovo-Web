import {
  useForm,
  type SubmitHandler,
  useFieldArray,
  type Resolver,
  Controller,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { FormInput } from "../../components/atoms/form/FormInput";
import { useCreateTicketMutation } from "../../store/features/api/ticketsApi";
import type { RootState } from "../../store/store";
import { toastNotify } from "./../../lib/toastNotify";
import { FormTextArea } from "../../components/atoms/form/FormTextArea";
import { AsyncSelect } from "../../components/atoms/inputs/AsyncSelect";
import {
  useGetCategoriesQuery,
  type Category,
} from "../../store/features/api/categoriesApi.ts";
import { TicketImagesUploader } from "../../components/atoms/inputs/TicketImagesUploader.tsx";

import { ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { UrgencySelect } from "../../components/atoms/inputs/UrgencySelect.tsx";

const createTicketSchema = z.object({
  title: z.string().min(2, "El título es obligatorio"),
  description: z.string().min(5, "La descripción es obligatoria"),
  clientName: z.string().optional(),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  clientPhone: z.string().optional(),
  clientEmail: z.string().email("Email inválido").optional().or(z.literal("")),
  address: z.string().optional(),
  categoryId: z.coerce.number().min(1, "Selecciona una categoría"),
  photos: z
    .array(z.object({ url: z.string().url("Debe ser una URL válida") }))
    .optional(),
});

type CreateTicketFormValues = z.infer<typeof createTicketSchema>;

export const CreateTicketPage: React.FC = () => {
  const navigate = useNavigate();
  const [createTicket, { isLoading }] = useCreateTicketMutation();

  const providerId = useSelector((state: RootState) => state.auth.user?.id) as
    | number
    | undefined;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateTicketFormValues>({
    resolver: zodResolver(
      createTicketSchema
    ) as unknown as Resolver<CreateTicketFormValues>,
    defaultValues: {
      title: "",
      description: "",
      clientName: "",
      clientPhone: "",
      clientEmail: "",
      address: "",
      categoryId: 0,
      urgency: "MEDIUM",
      photos: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "photos",
  });

  const onSubmit: SubmitHandler<CreateTicketFormValues> = async (values) => {
    if (!providerId) {
      toastNotify(
        "No se encontró el usuario proveedor. Inicia sesión de nuevo.",
        "error"
      );
      return;
    }

    try {
      const payload = {
        description: values.description,
        clientName: values.clientName || undefined,
        clientPhone: values.clientPhone || undefined,
        clientEmail: values.clientEmail || undefined,
        address: values.address || undefined,
        categoryId: values.categoryId,
        providerId,
        photos: (values.photos || []).map((p) => p.url),
      };

      await createTicket(payload).unwrap();

      toastNotify("Ticket creado correctamente", "success");
      navigate("/app/tickets");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Create ticket error:", error);
      toastNotify(error.message, "error");
    }
  };

  return (
    <div className="min-h-screen  px-4 py-8">
      <div className="flex flex-wrap items-center justify-between">
        <button
          type="button"
          onClick={() => navigate("/app/tickets")}
          className="px-4 flex flex-row py-2 text-sm items-center justify-center rounded-lg border border-slate-300
         text-slate-700 hover:bg-slate-300"
        >
          <ArrowLeftIcon className="size-6 mr-2" /> Go Back
        </button>
        <h1 className="text-xl text-center font-varien mb-4 text-oxford-blue-800 ">
          Create new Ticket
        </h1>
        <div className="w-2" />
        <div className="w-2" />
      </div>
      <div className="items-center flex flex-col justify-center">
        <div className="w-full items-center max-w-3xl min-h-screen  flex  justify-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSubmit(onSubmit)(e);
            }}
            className="bg-white rounded-2xl shadow border border-slate-200 p-6 space-y-4"
          >
            <div className="flex justify-between">
              <div />
              <button
                type="button"
                onClick={() => navigate("/app/tickets")}
                className="px-2 flex flex-row py-1 text-sm items-center justify-center rounded-lg border border-slate-300
         text-slate-700 hover:bg-red-500 hover:text-white "
              >
                <XMarkIcon className="size-5" />
              </button>
            </div>
            <FormInput
              label="Title"
              type="text"
              placeholder="Title of ticket"
              error={errors.clientName}
              {...register("title")}
            />
            <FormTextArea
              label="Description"
              placeholder="Describe the problem..."
              error={errors.description}
              rows={4}
              {...register("description")}
            />

            {/* Datos del cliente */}
            <div className="grid md:grid-cols-2 gap-4">
              <FormInput
                label="Cliente name"
                type="text"
                placeholder="Juan Pérez"
                error={errors.clientName}
                {...register("clientName")}
              />
              <FormInput
                label="Cliente phone"
                type="tel"
                placeholder="+1 555 123 456"
                error={errors.clientPhone}
                {...register("clientPhone")}
              />
              <FormInput
                label="Client email"
                type="email"
                placeholder="cliente@correo.com"
                error={errors.clientEmail}
                {...register("clientEmail")}
              />
              <FormInput
                label="Adress"
                type="text"
                placeholder="Street, number, city..."
                error={errors.address}
                {...register("address")}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-600 tracking-[0.12em] uppercase">
                  Urgency
                </label>
                <Controller
                  name="urgency"
                  control={control}
                  render={({ field }) => (
                    <UrgencySelect
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Seleccionar urgencia"
                    />
                  )}
                />

                {errors.urgency && (
                  <p className="text-[11px] text-red-500 mt-0.5">
                    {errors.urgency.message}
                  </p>
                )}
              </div>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <AsyncSelect<Category>
                    mode="input"
                    label="Category"
                    name={field.name}
                    value={field.value ? String(field.value) : ""}
                    onChange={(val) => field.onChange(Number(val))}
                    error={errors.categoryId}
                    placeholder="Select category"
                    useOptionsHook={useGetCategoriesQuery}
                    getOptionLabel={(cat) => cat.name}
                    getOptionValue={(cat) => String(cat.id)}
                    enableSearch
                  />
                )}
              />
            </div>

            <TicketImagesUploader
              images={fields.map((f) => ({
                id: f.id,
                url: f.url,
              }))}
              onAddImage={(url) => append({ url })}
              onRemoveImage={remove}
            />

            {/* Acciones */}
            <div className="flex justify-end gap-2 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="
                px-4 py-2 text-sm rounded-lg
                bg-oxford-blue-600 text-white font-varien
                hover:bg-oxford-blue-700
                disabled:opacity-60 disabled:cursor-not-allowed
                shadow-sm
              "
              >
                {isLoading ? "Creating..." : "Create Ticket"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
