// src/components/layout/DashboardLayout.tsx
import * as React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useTranslation } from "react-i18next";

import { Sidebar } from "./SideBar";
import RenovoLogo from "../../assets/images/LOGOTIPO_3RENOVO.png";
import { AppShell } from "./AppShell";

export const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentUser = useSelector((state: RootState) => state.auth.user);

  React.useEffect(() => {
    if (!currentUser) navigate("/login", { replace: true });
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sidebar solo si hay user */}
      {currentUser ? <Sidebar /> : null}

      {/* Main + Header reutilizable */}
      <div className="ml-0 md:ml-20">
        <AppShell
          logoSrc={RenovoLogo}
          logoAlt="Renovo Logo"
          user={
            currentUser ? { id: currentUser.id, name: currentUser.name } : null
          }
          showUserPill={true}
          contentVariant="container"
        >
          <div className="max-w-6xl mx-auto w-full">
            <Outlet />
          </div>
        </AppShell>

        {/* Si en algún momento quieres un fallback visual mientras redirige */}
        {!currentUser ? (
          <div className="px-4 sm:px-6 py-10 text-center text-sm text-slate-500">
            {t("layout.redirecting") ?? "Redirecting..."}
          </div>
        ) : null}
      </div>
    </div>
  );
};
