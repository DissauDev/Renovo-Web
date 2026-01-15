// src/pages/settings/SettingsPage.tsx
import * as React from "react";
import { HeaderTab } from "../../components/layout/HeaderTab";
import i18n from "../../i18n";
import { cn } from "../../lib/utils";
import { useTranslation } from "react-i18next";
import { InvoiceSettingsCard } from "../../components/settings/InvoiceSettingsCard";

type Lang = "en" | "es";

export const SettingsPage = () => {
  const { t } = useTranslation("common");

  const [lang, setLang] = React.useState<Lang>(
    (i18n.language?.startsWith("es") ? "es" : "en") as Lang
  );

  React.useEffect(() => {
    const next = (i18n.language?.startsWith("es") ? "es" : "en") as Lang;
    setLang(next);
  }, []);

  const changeLang = async (next: Lang) => {
    setLang(next);
    await i18n.changeLanguage(next);
  };

  return (
    <div className="space-y-5">
      <HeaderTab title={"settings"} hasCreated={false} />

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 max-w-xl">
        {/* Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-sm font-varien text-oxford-blue-800">
              {t("settings.language.title")}
            </h2>
            <p className="text-[12px] font-semibold text-slate-500 leading-relaxed">
              {t("settings.language.subtitle")}
            </p>
          </div>

          {/* Switch */}
          <div className="flex flex-col items-end gap-2">
            <div
              role="tablist"
              aria-label={t("settings.language.aria")}
              className="relative inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 shadow-xs"
            >
              {/* Thumb */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-white shadow-sm border border-slate-200",
                  "transition-transform duration-200 ease-out",
                  lang === "es" ? "translate-x-0" : "translate-x-[100%]"
                )}
              />

              <button
                type="button"
                role="tab"
                aria-selected={lang === "es"}
                onClick={() => changeLang("es")}
                className={cn(
                  "relative z-10 h-9 min-w-[92px] px-3 rounded-lg",
                  "text-xs font-varien tracking-wide",
                  "transition-colors duration-150",
                  lang === "es"
                    ? "text-oxford-blue-800"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {t("settings.language.es")}
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={lang === "en"}
                onClick={() => changeLang("en")}
                className={cn(
                  "relative z-10 h-9 min-w-[92px] px-3 rounded-lg",
                  "text-xs font-varien tracking-wide",
                  "transition-colors duration-150",
                  lang === "en"
                    ? "text-oxford-blue-800"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {t("settings.language.en")}
              </button>
            </div>

            {/* Helper */}
            <p className="text-[11px] text-slate-500">
              {t("settings.language.hint")}
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 max-w-xl">
        <InvoiceSettingsCard className="mt-6" />
      </div>
    </div>
  );
};
