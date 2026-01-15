// src/components/layout/DashboardLayout.tsx
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "./SideBar";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import RenovoLogo from "../../assets/images/LOGOTIPO_3RENOVO.png";
import { useTranslation } from "react-i18next";

export const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const initials =
    currentUser?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase() ?? "?";

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />

      <main className="ml-0 md:ml-20 min-h-screen flex flex-col text-slate-900">
        {/* Topbar */}
        <header
          className="sticky top-0 z-40 h-16 bg-white/95 backdrop-blur border-b
         border-slate-200 shadow-sm flex items-center justify-between px-4 sm:px-6"
        >
          {/* Logo */}
          <div className="md:hidden block w-1 h-1"></div>
          <div className="flex items-center gap-2">
            <img
              src={RenovoLogo}
              alt="Renovo Logo"
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* User section */}
          <div className="flex items-center gap-4">
            {/* Texto small a la izquierda del pill */}
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                {t("layout.loggedInAs")}
              </span>
              <span className="text-xs sm:text-sm font-varien text-oxford-blue-700 max-w-[180px] truncate">
                {currentUser?.name ?? t("layout.userFallback")}
              </span>
            </div>

            {/* Botón "My profile" */}
            <button
              type="button"
              onClick={() => navigate(`/app/user/${currentUser?.id}`)}
              className="
                inline-flex items-center gap-2
                rounded-full  border-slate-200
                bg-slate-50/80
                
                text-xs sm:text-sm font-medium text-slate-700
                shadow-sm
                hover:border-woodsmoke-500 border-2 hover:text-white 
                active:scale-95
                transition-all duration-150
              "
            >
              {/* Avatar con iniciales */}
              <div
                className="
                  h-7 w-7 sm:h-10 sm:w-10
                  rounded-full
                  bg-gradient-to-br from-persian-red-600 to-cameo-600
                  flex items-center justify-center
                  text-[11px] sm:text-sm  font-varien text-white
                  shadow-sm
                "
              >
                {initials}
              </div>

              <span className="hidden xs:inline-block">
                {t("layout.myProfile")}
              </span>
            </button>
          </div>
        </header>

        {/* Contenido */}
        <div className="flex-1 px-4 sm:px-6 py-6">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};
