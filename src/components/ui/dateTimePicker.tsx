import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "./button";
import { Calendar } from "./calendar";

import { PopoverContent, Popover, PopoverTrigger } from "./popover";
import { Label } from "./label";
import { Input } from "./input";
import { useTranslation } from "react-i18next";

type DateTimePickerProps = {
  value?: Date | null;
  onChange?: (value: Date | null) => void;
  defaultTime?: string; // "10:30:00"
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function dateToTimeString(d: Date) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(
    d.getSeconds()
  )}`;
}

function combineDateAndTime(date: Date, time: string) {
  const [hh, mm, ss] = time.split(":").map((x) => Number(x));
  const next = new Date(date);
  next.setHours(hh || 0, mm || 0, ss || 0, 0);
  return next;
}

export function DateTimePicker({
  value,
  onChange,
  defaultTime = "10:30:00",
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation(); // ✅ no dependas del namespace aquí

  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  );
  const [time, setTime] = React.useState<string>(
    value ? dateToTimeString(new Date(value)) : defaultTime
  );

  React.useEffect(() => {
    if (!value) {
      setDate((prev) => (prev ? undefined : prev));
      setTime((prev) => (prev === defaultTime ? prev : defaultTime));
      return;
    }

    const d = new Date(value);

    setDate((prev) => {
      if (prev && prev.getTime() === d.getTime()) return prev;
      return d;
    });

    const nextTime = dateToTimeString(d);
    setTime((prev) => (prev === nextTime ? prev : nextTime));
  }, [value, defaultTime]);

  React.useEffect(() => {
    if (!onChange) return;

    if (!date) {
      if (value !== null && value !== undefined) onChange(null);
      return;
    }

    const next = combineDateAndTime(date, time);
    const prev = value ? new Date(value).getTime() : null;

    if (prev === next.getTime()) return;
    onChange(next);
  }, [date, time, onChange, value]);

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Label htmlFor="date-picker" className="px-1">
          {t("tickets:technician.dateLabel")}
        </Label>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-40 justify-between font-normal"
              type="button"
            >
              {date
                ? date.toLocaleDateString()
                : t("tickets:technician.selectDate")}
              <ChevronDownIcon className="h-4 w-4 opacity-70" />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="w-auto overflow-hidden p-0 border-0"
            align="start"
          >
            <Calendar
              className="border-cameo-500 border-2 rounded-3xl"
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(d: React.SetStateAction<Date | undefined>) => {
                setDate(d);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="time-picker" className="px-1">
          {t("tickets:technician.timeLabel")}
        </Label>

        <Input
          type="time"
          id="time-picker"
          step="60"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}
