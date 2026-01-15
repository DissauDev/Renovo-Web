import * as React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { cn } from "../../../lib/utils";

export interface TableColumn<T> {
  /** Clave única por columna */
  key: string;
  /** Texto del encabezado (ya traducido desde el caller) */
  header: string;
  /** Cómo renderizar la celda */
  render: (row: T) => React.ReactNode;
  /** Clases opcionales por columna */
  className?: string;
}

interface DataTableProps<T> {
  title?: string;
  data: T[];
  columns: TableColumn<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  page: number; // página actual (1-based)
  pageSize: number; // items por página
  totalItems: number; // total de registros en el backend
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onRowClick?: (row: T) => void;
  className?: string;
  rightSlot?: React.ReactNode;
  i18nNs?: string; // default "common"
}

export function DataTable<T>({
  title,
  data,
  columns,
  isLoading = false,
  emptyMessage,
  searchTerm,
  onSearchChange,
  searchPlaceholder,
  page,
  pageSize,
  totalItems,
  onPageChange,
  onRowClick,
  className,
  rightSlot,
  i18nNs = "common",
}: DataTableProps<T>) {
  const { t } = useTranslation(i18nNs);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  const handlePrev = () => {
    if (onPageChange && page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (onPageChange && page < totalPages) onPageChange(page + 1);
  };

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-slate-200 bg-white shadow-sm",
        className
      )}
    >
      {/* Header: título + search */}
      <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between border-b border-slate-100">
        <div className="space-y-1">
          {title && (
            <h2 className="text-sm font-varien text-oxford-blue-800">
              {title}
            </h2>
          )}
          <p className="text-sm font-semibold text-slate-500">
            {t("table.subtitle", "Manage and search records.")}
          </p>
        </div>

        {/* Search + filtros (derecha) */}
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-2 md:items-center md:justify-end">
          {/* Search */}
          <div className="w-full md:w-64">
            <div className="relative">
              <MagnifyingGlassIcon className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={
                  searchPlaceholder ?? t("table.searchPlaceholder", "Search...")
                }
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-700
                 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Slot para filtros extra */}
          {rightSlot && (
            <div className="w-full md:w-auto flex justify-end">{rightSlot}</div>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-full text-xs text-left text-slate-700">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-2 font-semibold text-[11px] uppercase tracking-[0.12em] text-slate-500",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-xs text-slate-400"
                >
                  {t("table.loading", "Loading records...")}
                </td>
              </tr>
            )}

            {!isLoading && data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-xs text-slate-400"
                >
                  {emptyMessage ?? t("table.empty", "No records found.")}
                </td>
              </tr>
            )}

            {!isLoading &&
              data.map((row, idx) => (
                <tr
                  key={idx}
                  className={cn(
                    "border-b border-slate-50",
                    onRowClick && "cursor-pointer hover:bg-emerald-50/40"
                  )}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-2 align-middle">
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Footer: info + paginación */}
      <div className="flex flex-col gap-2 px-4 py-3 border-t border-slate-100 md:flex-row md:items-center md:justify-between">
        {/* Info de filas */}
        <div className="text-[11px] text-slate-500">
          {totalItems === 0
            ? t("table.noRecords", "No records to display.")
            : t("table.showing", {
                from,
                to,
                total: totalItems,
                defaultValue: `Showing ${from}–${to} of ${totalItems} records`,
              })}
        </div>

        {/* Controles de paginación */}
        <div className="flex items-center gap-3 justify-end">
          <div className="flex items-center gap-1 text-[11px]">
            <button
              type="button"
              onClick={handlePrev}
              disabled={page <= 1 || !onPageChange}
              className={cn(
                "px-2 py-1 rounded-md border text-xs",
                page <= 1 || !onPageChange
                  ? "border-slate-200 text-slate-300 cursor-not-allowed"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50"
              )}
            >
              {t("table.prev", "Prev")}
            </button>

            <span className="px-1 text-slate-500">
              {t("table.pageOf", {
                page,
                totalPages,
                defaultValue: `Page ${page} of ${totalPages}`,
              })}
            </span>

            <button
              type="button"
              onClick={handleNext}
              disabled={page >= totalPages || !onPageChange}
              className={cn(
                "px-2 py-1 rounded-md border text-xs",
                page >= totalPages || !onPageChange
                  ? "border-slate-200 text-slate-300 cursor-not-allowed"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50"
              )}
            >
              {t("table.next", "Next")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
