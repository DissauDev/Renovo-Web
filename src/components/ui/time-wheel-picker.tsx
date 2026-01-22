import * as React from "react";
import { cn } from "../../lib/utils";

import { XCircleIcon } from "@heroicons/react/24/outline";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function parse24(time24: string) {
  const [hh, mm] = time24.split(":").map((x) => Number(x));
  return { hh: hh || 0, mm: mm || 0 };
}

function to24(h12: number, mm: number, period: "AM" | "PM") {
  let H = h12 % 12;
  if (period === "PM") H += 12;
  return `${pad2(H)}:${pad2(mm)}:00`;
}

function to12Parts(time24: string) {
  const { hh, mm } = parse24(time24);
  const period: "AM" | "PM" = hh >= 12 ? "PM" : "AM";
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return { h12, mm, period };
}

type WheelProps = {
  value: string; // "HH:mm:ss"
  onChange: (next: string) => void; // "HH:mm:ss"
  onClose?: () => void; // ✅ nuevo
};

export function TimeWheelPicker({ value, onChange, onClose }: WheelProps) {
  const { h12, mm, period } = React.useMemo(() => to12Parts(value), [value]);

  return (
    <div className="relative">
      {/* Header con botón cerrar */}
      <div className="mb-2 flex items-center justify-between px-1">
        <div className="w-2 h-2" />
        <button
          type="button"
          onClick={onClose}
          className={cn(
            "rounded-xl px-2.5  py-1 text-xs font-semibold",
            "text-oxford-blue-700 hover:text-oxford-blue-900",
            "hover:bg-cameo-50",
            "transition-colors",
            !onClose && "pointer-events-none opacity-40",
          )}
        >
          <XCircleIcon className="w-6 h-6 text-cameo-700" />
        </button>
      </div>

      {/* ✅ Ventana central (detrás) */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 z-0">
        <div
          className={cn(
            "mx-auto h-10 w-full rounded-xl",
            "bg-white",
            "ring-2 ring-oxford-blue-200",
          )}
        />
      </div>

      <div className="relative z-10">
        {/* Fade superior/inferior */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-10 rounded-t-2xl bg-gradient-to-b from-white to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 rounded-b-2xl bg-gradient-to-t from-white to-transparent" />

        <div className="flex items-center justify-between gap-3 px-1">
          <WheelColumn<number>
            ariaLabel="Hours"
            items={Array.from({ length: 12 }, (_, i) => i + 1)}
            value={h12}
            render={(x) => String(x)}
            onChange={(nextH) => onChange(to24(nextH, mm, period))}
          />

          <div className="pb-1 text-2xl font-semibold text-oxford-blue-200">
            :
          </div>

          <WheelColumn<number>
            ariaLabel="Minutes"
            items={Array.from({ length: 60 }, (_, i) => i)}
            value={mm}
            render={(x) => pad2(x)}
            onChange={(nextM) => onChange(to24(h12, nextM, period))}
          />

          <WheelColumn<"AM" | "PM">
            ariaLabel="AM/PM"
            items={["AM", "PM"]}
            value={period}
            render={(x) => x}
            onChange={(nextP) => onChange(to24(h12, mm, nextP))}
            narrow
          />
        </div>
      </div>
    </div>
  );
}

type WheelColumnProps<T> = {
  ariaLabel: string;
  items: T[];
  value: T;
  render: (x: T) => string;
  onChange: (x: T) => void;
  narrow?: boolean;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function WheelColumn<T>({
  ariaLabel,
  items,
  value,
  render,
  onChange,
  narrow,
}: WheelColumnProps<T>) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  const ITEM_H = 40;
  const PADDING_ITEMS = 2;

  const [scrollTop, setScrollTop] = React.useState(0);

  const index = React.useMemo(() => {
    const i = items.findIndex((x) => Object.is(x, value));
    return Math.max(0, i);
  }, [items, value]);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const top = index * ITEM_H;
    el.scrollTo({ top, behavior: "smooth" });
  }, [index]);

  const onScroll = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;

    setScrollTop(el.scrollTop);

    const nextIndex = Math.round(el.scrollTop / ITEM_H);
    const next = items[Math.min(items.length - 1, Math.max(0, nextIndex))];
    if (!Object.is(next, value)) onChange(next);
  }, [items, onChange, value]);

  const raf = React.useRef<number | null>(null);
  const handleScroll = React.useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(onScroll);
  }, [onScroll]);

  const centerY = scrollTop + 100; // 200px alto / 2

  return (
    <div className={cn("flex flex-col items-center", narrow ? "w-16" : "w-20")}>
      <div
        ref={ref}
        aria-label={ariaLabel}
        className={cn(
          "h-[200px] w-full overflow-y-auto overscroll-contain",
          "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
          "snap-y snap-mandatory",
          "rounded-2xl bg-white",
          "px-1",
        )}
        onScroll={handleScroll}
      >
        {Array.from({ length: PADDING_ITEMS }).map((_, i) => (
          <div key={`pt-${i}`} style={{ height: ITEM_H }} />
        ))}

        {items.map((it, i) => {
          const active = Object.is(it, value);

          const itemCenterY = PADDING_ITEMS * ITEM_H + i * ITEM_H + ITEM_H / 2;
          const dist = Math.abs(itemCenterY - centerY);
          const proximity = 1 - clamp(dist / 120, 0, 1);

          const scale = 0.88 + proximity * 0.14;
          const opacity = 0.35 + proximity * 0.65;
          const blur = (1 - proximity) * 0.4;

          return (
            <button
              key={i}
              type="button"
              onClick={() => onChange(it)}
              className={cn(
                "snap-center w-full",
                "h-10 rounded-xl",
                "flex items-center justify-center",
                "transition-all duration-200 ease-out",
                "will-change-transform",
                active
                  ? cn(
                      "bg-persian-red-600 text-white font-semibold",
                      "shadow-sm shadow-persian-red-200/60",
                      "ring-2 ring-persian-red-300",
                    )
                  : cn(
                      "text-oxford-blue-300",
                      "hover:text-oxford-blue-800 hover:bg-cameo-50",
                    ),
              )}
              style={{
                height: ITEM_H,
                transform: `scale(${active ? 1.04 : scale})`,
                opacity: active ? 1 : opacity,
                filter: blur > 0.01 ? `blur(${blur}px)` : undefined,
              }}
            >
              <span className="text-[20px] leading-none">{render(it)}</span>
            </button>
          );
        })}

        {Array.from({ length: PADDING_ITEMS }).map((_, i) => (
          <div key={`pb-${i}`} style={{ height: ITEM_H }} />
        ))}
      </div>
    </div>
  );
}
