/* eslint-disable react-hooks/static-components */
// src/components/layout/Sidebar.tsx
import * as React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  ClipboardDocumentListIcon,
  // DocumentTextIcon,
  WrenchScrewdriverIcon,
  Cog6ToothIcon,
  HomeModernIcon,
  InboxStackIcon,
  TableCellsIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import RenovoLogo from "../../assets/images/FV_3RENOVO.png";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/utils";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

type NavItem = {
  to: string;
  labelKey: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    to: "/app/tickets",
    labelKey: "sidebar.nav.tickets",
    icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
  },
  {
    to: "/app/technicians",
    labelKey: "sidebar.nav.technicians",
    icon: <WrenchScrewdriverIcon className="h-6 w-6" />,
  },
  {
    to: "/app/providers",
    labelKey: "sidebar.nav.providers",
    icon: <HomeModernIcon className="h-6 w-6" />,
  },
  {
    to: "/app/categories",
    labelKey: "sidebar.nav.categories",
    icon: <TableCellsIcon className="h-6 w-6" />,
  },
  {
    to: "/app/products",
    labelKey: "sidebar.nav.products",
    icon: <InboxStackIcon className="h-6 w-6" />,
  },
  /* {
    to: "/app/invoices",
    labelKey: "sidebar.nav.invoices",
    icon: <DocumentTextIcon className="h-6 w-6" />,
  },*/
  {
    to: "/app/settings",
    labelKey: "sidebar.nav.settings",
    icon: <Cog6ToothIcon className="h-6 w-6" />,
  },
];

export const Sidebar: React.FC = () => {
  const role = useSelector((state: RootState) => state.auth.user?.role);
  const isAdmin = role === "ADMIN";
  const isEmployee = role === "EMPLOYEE";
  const isProvider = role === "PROVIDER";

  const visibleNavItems = React.useMemo(() => {
    return navItems.filter((item) => {
      // ADMIN ve todo
      if (isAdmin) return true;

      // EMPLOYEE: solo tickets
      if (isEmployee) {
        return ![
          "/app/providers",
          "/app/settings",
          "/app/technicians",
          "/app/categories",
          "/app/products",
        ].includes(item.to);
      }

      if (isProvider) {
        return ![
          "/app/providers",
          "/app/settings",
          "/app/technicians",
          "/app/categories",
          "/app/products",
        ].includes(item.to);
      }

      return false;
    });
  }, [isAdmin, isEmployee, isProvider]);

  const { t } = useTranslation("common");
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Cierra el modal si cambia la ruta (al hacer click en un nav item)
  React.useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Evita scroll del body cuando el modal está abierto
  React.useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const SidebarNav = ({ variant }: { variant: "desktop" | "mobile" }) => (
    <nav
      className={cn(
        "flex flex-col gap-6 flex-1",
        variant === "mobile" && "gap-4",
      )}
      aria-label={t("sidebar.aria.nav")}
    >
      {visibleNavItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          title={t(item.labelKey)} // tooltip nativo (sin aumentar ancho)
          aria-label={t(item.labelKey)}
          className={({ isActive }) =>
            cn(
              "group relative flex items-center justify-center",
              // mantiene el ancho de la barra; no agregamos texto
              variant === "desktop"
                ? "h-12 w-12 rounded-xl mx-auto"
                : "h-12 w-12 rounded-xl",
              "transition-all duration-200",
              isActive
                ? "bg-persian-red-100 text-persian-red-600 shadow-sm"
                : "text-gray-500 hover:bg-persian-red-50 hover:text-persian-red-600",
            )
          }
        >
          {item.icon}

          {/* Tooltip custom (desktop + mouse) sin afectar ancho */}
          {variant === "desktop" && (
            <span
              className={cn(
                "pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2",
                "hidden group-hover:flex",
                "items-center",
                "rounded-lg border border-slate-200 bg-white px-2 py-1",
                "text-[11px] font-semibold text-slate-700 shadow-sm",
                "whitespace-nowrap",
              )}
              role="tooltip"
            >
              {t(item.labelKey)}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <>
      {/* ✅ Desktop sidebar: visible desde md, mantiene w-20 */}
      <aside
        className={cn(
          "hidden md:flex",
          "fixed top-0 left-0 h-screen w-20",
          "bg-white shadow-[4px_0_15px_rgba(0,0,0,0.06)]",
          "flex-col items-center py-5 z-50",
        )}
      >
        {/* Logo */}
        <div className="mb-4">
          <img
            src={RenovoLogo}
            alt={t("sidebar.logoAlt")}
            className="w-full h-12 object-cover"
          />
        </div>

        <SidebarNav variant="desktop" />
        <span
          className={cn(
            "px-2 py-0.5 rounded-full",
            "text-[10px] font-semibold tracking-[0.14em] uppercase",
            "bg-slate-100 text-slate-600 border border-slate-200",
            "shadow-xs",
          )}
        >
          v1.0.0
        </span>
      </aside>

      {/* ✅ Mobile: botón menú (no ocupa ancho de sidebar) */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className={cn(
          "md:hidden",
          "fixed top-3 left-3 z-[60]",
          "inline-flex items-center justify-center",
          "h-10 w-10 rounded-xl border border-slate-200 bg-white shadow-sm",
          "text-slate-700 hover:bg-slate-50",
        )}
        aria-label={t("sidebar.mobile.openMenu")}
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* ✅ Mobile modal */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-[70]"
          role="dialog"
          aria-modal="true"
        >
          {/* overlay */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/40"
            aria-label={t("sidebar.mobile.closeMenu")}
          />

          {/* panel */}
          <div
            className={cn(
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              "w-[92vw] max-w-sm",
              "rounded-2xl border border-slate-200 bg-white shadow-xl",
            )}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <img
                  src={RenovoLogo}
                  alt={t("sidebar.logoAlt")}
                  className="h-9 w-auto object-contain"
                />
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full",
                    "text-[10px] font-semibold tracking-[0.14em] uppercase",
                    "bg-slate-100 text-slate-600 border border-slate-200",
                    "shadow-xs",
                  )}
                >
                  v1.0.0
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-varien text-oxford-blue-800">
                    {t("sidebar.mobile.title")}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {t("sidebar.mobile.subtitle")}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "h-9 w-9 rounded-xl border border-slate-200",
                  "inline-flex items-center justify-center",
                  "text-slate-700 hover:bg-slate-50",
                )}
                aria-label={t("sidebar.mobile.closeMenu")}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="px-4 py-4">
              {/* grid para que se vea tipo launcher */}
              <div className="grid grid-cols-4 gap-3 justify-items-center">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    aria-label={t(item.labelKey)}
                    title={t(item.labelKey)}
                    className={() =>
                      cn(
                        "group flex flex-col items-center justify-center gap-1",
                        "w-full",
                      )
                    }
                  >
                    <div
                      className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center transition-all",
                        location.pathname.startsWith(item.to)
                          ? "bg-persian-red-100 text-persian-red-600 shadow-sm"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-persian-red-50 hover:text-persian-red-600",
                      )}
                    >
                      {/* clona el icono para conservar tamaño */}
                      {item.icon}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600 text-center">
                      {t(item.labelKey)}
                    </span>
                  </NavLink>
                ))}
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-varien",
                    "bg-oxford-blue-600 text-white",
                    "hover:bg-oxford-blue-700",
                  )}
                >
                  {t("sidebar.mobile.close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
