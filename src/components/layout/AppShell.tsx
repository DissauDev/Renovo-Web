import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguagePill } from "./LanguagePill";
import { cn } from "../../lib/utils";

type AppShellUser = {
  id: string | number;
  name?: string | null;
};

type Props = {
  logoSrc: string;
  logoAlt?: string;
  user?: AppShellUser | null;
  showUserPill?: boolean; // por si en algunas públicas lo quieres ocultar
  children: React.ReactNode;

  // Layout del contenido
  contentVariant?: "container" | "centered";
  className?: string;
};

export const AppShell: React.FC<Props> = ({
  logoSrc,
  logoAlt = "Logo",
  user,
  showUserPill = true,
  children,
  contentVariant = "container",
  className,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const initials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase() ?? "?";

  return (
    <main
      className={cn(
        "min-h-screen w-full flex flex-col text-slate-900 bg-slate-100",
        className,
      )}
    >
      {/* Topbar */}
      <header
        className="sticky top-0 z-40 h-16 bg-white/95 backdrop-blur border-b
        border-slate-200 shadow-sm flex items-center justify-between px-4 sm:px-6"
      >
        {/* Left */}

        <div className="md:hidden block w-1 h-1" />
        <img
          src={logoSrc}
          alt={logoAlt}
          className=" h-8 md:h-10 w-auto object-contain"
        />

        {/* Right */}
        <div className="flex items-center gap-3 sm:gap-4">
          <LanguagePill />

          {user && showUserPill ? (
            <>
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                  {t("layout.loggedInAs")}
                </span>
                <span className="text-xs sm:text-sm font-varien text-oxford-blue-700 max-w-[180px] truncate">
                  {user?.name ?? t("layout.userFallback")}
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/app/user/${user?.id}`)}
                className="
                  inline-flex items-center gap-2
                  rounded-full border-slate-200
                  bg-slate-50/80
                  text-xs sm:text-sm font-medium text-slate-700
                  shadow-sm
                  hover:border-woodsmoke-500 border-2 hover:text-white
                  active:scale-95
                  transition-all duration-150
                "
              >
                <div
                  className="
                    h-7 w-7 sm:h-10 sm:w-10
                    rounded-full
                    bg-gradient-to-br from-persian-red-600 to-cameo-600
                    flex items-center justify-center
                    text-[11px] sm:text-sm font-varien text-white
                    shadow-sm
                  "
                >
                  {initials}
                </div>

                <span className="hidden xs:inline-block">
                  {t("layout.myProfile")}
                </span>
              </button>
            </>
          ) : null}
        </div>
      </header>

      {/* Content */}
      <div
        className={cn(
          "flex-1 px-4 sm:px-6 py-6",
          contentVariant === "centered" && "flex items-center justify-center",
        )}
      >
        <div
          className={cn(
            contentVariant === "container" && "max-w-6xl mx-auto w-full",
            contentVariant === "centered" && "w-full",
          )}
        >
          {children}
        </div>
      </div>
    </main>
  );
};
