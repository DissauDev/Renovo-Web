/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type DropdownProps,
} from "react-day-picker";

import { cn } from "../../lib/utils";
import { Button, buttonVariants } from "./button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

/**
 * Renovo themed Calendar (Persian Red + Cameo + Oxford Blue)
 * Uses CSS variables via arbitrary values (bg-[var(--color-...)])
 */

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar p-3 rounded-2xl border shadow-sm",
        "bg-[var(--color-seashell-50)] border-[var(--color-seashell-200)]",
        "text-[var(--color-oxford-blue-900)]",
        "[--cell-size:--spacing(8)]",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),

        months: cn(
          "flex gap-4 flex-col md:flex-row relative",
          defaultClassNames.months
        ),

        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),

        // ✅ IMPORTANT FIX:
        // This absolute full-width nav can block clicks in the middle (month/year).
        // Make it ignore pointer events, then re-enable them for the buttons.
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between pointer-events-none",
          defaultClassNames.nav
        ),

        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-40 pointer-events-auto",
          "hover:bg-[var(--color-cameo-50)] hover:text-[var(--color-oxford-blue-900)]",
          defaultClassNames.button_previous
        ),

        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-40 pointer-events-auto",
          "hover:bg-[var(--color-cameo-50)] hover:text-[var(--color-oxford-blue-900)]",
          defaultClassNames.button_next
        ),

        month_caption: cn(
          "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size) relative",
          "text-[var(--color-oxford-blue-900)]",
          defaultClassNames.month_caption
        ),

        dropdowns: cn(
          "w-full flex items-center text-sm font-semibold justify-center h-(--cell-size) gap-1.5",
          "text-[var(--color-oxford-blue-900)]",
          defaultClassNames.dropdowns
        ),

        // Not used visually when overriding components.Dropdown, safe to keep
        dropdown_root: cn(defaultClassNames.dropdown_root),
        dropdown: cn(defaultClassNames.dropdown),

        caption_label: cn(
          "select-none font-semibold tracking-tight flex items-center gap-1",
          "text-[var(--color-oxford-blue-900)]",
          captionLayout === "label" ? "text-sm" : "h-8 px-2 rounded-xl",
          "[&>svg]:size-3.5 [&>svg]:text-[var(--color-oxford-blue-500)]",
          defaultClassNames.caption_label
        ),

        table: "w-full border-collapse",

        weekdays: cn("flex", defaultClassNames.weekdays),

        weekday: cn(
          "rounded-md flex-1 text-[0.78rem] font-semibold select-none",
          "text-[var(--color-oxford-blue-500)]",
          defaultClassNames.weekday
        ),

        week: cn("flex w-full mt-2", defaultClassNames.week),

        week_number_header: cn(
          "select-none w-(--cell-size)",
          defaultClassNames.week_number_header
        ),

        week_number: cn(
          "text-[0.8rem] select-none",
          "text-[var(--color-oxford-blue-400)]",
          defaultClassNames.week_number
        ),

        day: cn(
          "relative w-full h-full p-0 text-center aspect-square select-none group/day",
          "[&:last-child[data-selected=true]_button]:rounded-r-xl",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-xl"
            : "[&:first-child[data-selected=true]_button]:rounded-l-xl",
          defaultClassNames.day
        ),

        range_start: cn(
          "rounded-l-xl bg-[var(--color-persian-red-50)]",
          defaultClassNames.range_start
        ),
        range_middle: cn(
          "rounded-none bg-[var(--color-persian-red-50)]",
          defaultClassNames.range_middle
        ),
        range_end: cn(
          "rounded-r-xl bg-[var(--color-persian-red-50)]",
          defaultClassNames.range_end
        ),

        today: cn(
          "rounded-xl bg-[var(--color-cameo-50)] text-[var(--color-oxford-blue-900)]",
          "ring-1 ring-[color:var(--color-cameo-200)]",
          "data-[selected=true]:bg-[var(--color-persian-red-600)] data-[selected=true]:text-white data-[selected=true]:ring-0",
          defaultClassNames.today
        ),

        outside: cn(
          "text-[var(--color-oxford-blue-300)] aria-selected:text-[var(--color-oxford-blue-300)]",
          defaultClassNames.outside
        ),

        disabled: cn(
          "text-[var(--color-oxford-blue-300)] opacity-50",
          defaultClassNames.disabled
        ),

        hidden: cn("invisible", defaultClassNames.hidden),

        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => (
          <div
            data-slot="calendar"
            ref={rootRef}
            className={cn(className)}
            {...props}
          />
        ),

        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            );
          }
          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            );
          }
          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          );
        },

        // ✅ Custom shadcn select for month/year
        Dropdown: CalendarShadcnDropdown,

        DayButton: CalendarDayButton,

        WeekNumber: ({ children, ...props }) => (
          <td {...props}>
            <div className="flex size-(--cell-size) items-center justify-center text-center">
              {children}
            </div>
          </td>
        ),

        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <Button
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-medium rounded-xl transition-colors",
        "text-[var(--color-oxford-blue-900)]",
        "hover:bg-[var(--color-cameo-50)] hover:text-[var(--color-oxford-blue-900)]",
        "data-[selected-single=true]:bg-[var(--color-persian-red-600)] data-[selected-single=true]:text-white",
        "data-[selected-single=true]:hover:bg-[var(--color-persian-red-700)]",
        "data-[range-start=true]:bg-[var(--color-persian-red-600)] data-[range-start=true]:text-white",
        "data-[range-end=true]:bg-[var(--color-persian-red-600)] data-[range-end=true]:text-white",
        "data-[range-middle=true]:bg-[var(--color-persian-red-50)] data-[range-middle=true]:text-[var(--color-oxford-blue-900)]",
        "data-[range-start=true]:rounded-l-xl data-[range-end=true]:rounded-r-xl data-[range-middle=true]:rounded-none",
        "group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10",
        "group-data-[focused=true]/day:ring-2 group-data-[focused=true]/day:ring-[color:var(--color-persian-red-300)]",
        "[&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  );
}

function CalendarShadcnDropdown(props: DropdownProps) {
  const { value, onChange, options: dropdownOptions, name } = props;

  const selectedOption = dropdownOptions?.find(
    (opt) => String(opt.value) === String(value)
  );
  const selectedLabel = selectedOption?.label ?? "";

  return (
    <Select
      value={String(value)}
      onValueChange={(v) => {
        onChange?.({ target: { value: v, name } } as any);
      }}
    >
      <SelectTrigger
        className={cn(
          "h-8 rounded-xl px-2 text-sm font-semibold shadow-sm min-w-[4.25rem]",
          "bg-white border border-[var(--color-seashell-200)]",
          "text-[var(--color-oxford-blue-900)]",
          "hover:bg-[var(--color-cameo-50)]",
          "focus:ring-2 focus:ring-[color:var(--color-persian-red-300)]"
        )}
      >
        <SelectValue placeholder={selectedLabel as any} />
      </SelectTrigger>

      <SelectContent
        className={cn(
          "z-[9999]",
          "border border-[var(--color-seashell-200)]",
          "bg-white text-[var(--color-oxford-blue-900)]"
        )}
      >
        {dropdownOptions?.map((opt) => (
          <SelectItem
            key={String(opt.value)}
            value={String(opt.value)}
            className={cn(
              "focus:bg-[var(--color-cameo-50)] focus:text-[var(--color-oxford-blue-900)]"
            )}
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export { Calendar, CalendarDayButton };
