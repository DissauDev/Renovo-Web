import * as React from "react";
import i18n from "../../i18n";
import { cn } from "../../lib/utils";

type Lang = "en" | "es";

const LOCALE_KEY = "app_locale";

function normalizeLang(v?: string | null): Lang {
  return v?.startsWith("es") ? "es" : "en";
}

export const LanguagePill: React.FC<{
  className?: string;
  size?: "sm" | "md";
}> = ({ className, size = "sm" }) => {
  const [lang, setLang] = React.useState<Lang>(() => {
    const saved = localStorage.getItem(LOCALE_KEY);
    return normalizeLang(saved ?? i18n.language);
  });

  React.useEffect(() => {
    // Mantiene sincronizado si el idioma cambia desde otro lugar
    const next = normalizeLang(i18n.language);
    setLang(next);
  }, []);

  const changeLang = async (next: Lang) => {
    if (next === lang) return;
    setLang(next);
    localStorage.setItem(LOCALE_KEY, next);
    await i18n.changeLanguage(next);
  };

  const isSm = size === "sm";

  return (
    <div
      role="tablist"
      aria-label="Language"
      className={cn(
        "relative inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-1 shadow-xs",
        isSm ? "h-8" : "h-9",
        className,
      )}
    >
      {/* Thumb */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-1 bottom-1 rounded-full bg-white shadow-sm border border-slate-200",
          "transition-transform duration-200 ease-out",
          isSm ? "w-[calc(50%-4px)]" : "w-[calc(50%-4px)]",
          lang === "es" ? "translate-x-0" : "translate-x-[100%]",
        )}
      />

      <button
        type="button"
        role="tab"
        aria-selected={lang === "es"}
        onClick={() => changeLang("es")}
        className={cn(
          "relative z-10 rounded-full px-3",
          isSm ? "h-6 text-[11px]" : "h-7 text-xs",
          "font-varien tracking-wide transition-colors",
          lang === "es"
            ? "text-oxford-blue-800"
            : "text-slate-500 hover:text-slate-700",
        )}
      >
        ES
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={lang === "en"}
        onClick={() => changeLang("en")}
        className={cn(
          "relative z-10 rounded-full px-3",
          isSm ? "h-6 text-[11px]" : "h-7 text-xs",
          "font-varien tracking-wide transition-colors",
          lang === "en"
            ? "text-oxford-blue-800"
            : "text-slate-500 hover:text-slate-700",
        )}
      >
        EN
      </button>
    </div>
  );
};
