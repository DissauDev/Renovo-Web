import { apiSlice } from "./apiSlice";

export type InvoiceSettings = {
  id: number;

  // Product tax
  productTaxEnabled: boolean;
  productTaxPercent: number | null;

  // Invoice tax
  invoiceTaxEnabled: boolean;
  invoiceTaxPercent: number | null;
  invoiceTaxFixed: number | null;

  createdAt: string;
  updatedAt: string;
};

export type UpdateInvoiceSettingsRequest = Partial<{
  productTaxEnabled: boolean;
  productTaxPercent: number | null;

  invoiceTaxEnabled: boolean;
  invoiceTaxPercent: number | null;
  invoiceTaxFixed: number | null;
}>;

export const invoiceSettingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInvoiceSettings: builder.query<InvoiceSettings, void>({
      query: () => ({
        url: "/invoice-settings",
        method: "GET",
      }),
      providesTags: ["InvoiceSettings"],
    }),

    updateInvoiceSettings: builder.mutation<
      InvoiceSettings,
      UpdateInvoiceSettingsRequest
    >({
      query: (body) => ({
        url: "/invoice-settings",
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["InvoiceSettings"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetInvoiceSettingsQuery,
  useUpdateInvoiceSettingsMutation,
} = invoiceSettingsApi;
