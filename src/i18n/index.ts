// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import esCommon from "./locales/es/common.json";
import enTickets from "./locales/en/tickets.json";
import esTickets from "./locales/es/tickets.json";
import enCategories from "./locales/en/categories.json";
import esCategories from "./locales/es/categories.json";
import enProducts from "./locales/en/products.json";
import esProducts from "./locales/es/products.json";
import enProviders from "./locales/en/providers.json";
import esProviders from "./locales/es/providers.json";
import enAuth from "./locales/en/auth.json";
import esAuth from "./locales/es/auth.json";
import enTechnicians from "./locales/en/technicians.json";
import esTechnicians from "./locales/es/technicians.json";
import { store } from "../store/store";

// ✅ Importa el store para leer el idioma persistido


i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
      tickets: enTickets,
      providers: enProviders,
      categories: enCategories,
      products: enProducts,
      auth: enAuth,
      technicians: enTechnicians,
    },
    es: {
      common: esCommon,
      tickets: esTickets,
      providers: esProviders,
      categories: esCategories,
      products: esProducts,
      auth: esAuth,
      technicians: esTechnicians,
    },
  },

  // ✅ inicializa como antes (para evitar problemas antes de rehidratar)
  lng: localStorage.getItem("i18nextLng") || "en",

  fallbackLng: "en",
  supportedLngs: ["en", "es"],
  ns: [
    "common",
    "tickets",
    "categories",
    "products",
    "providers",
    "auth",
    "technicians",
  ],
  defaultNS: "common",
  fallbackNS: "common",
  interpolation: { escapeValue: false },
});

// ✅ Sincroniza i18n con Redux (cuando redux-persist rehidrata o cambias el switch)
let lastLang = i18n.language;

store.subscribe(() => {
  const state = store.getState();
  const nextLang = state?.settings?.language;

  if (!nextLang) return;
  if (nextLang !== lastLang) {
    lastLang = nextLang;
    void i18n.changeLanguage(nextLang);
    // (opcional) si quieres mantener también i18nextLng actualizado:
    localStorage.setItem("i18nextLng", nextLang);
  }
});

export default i18n;
