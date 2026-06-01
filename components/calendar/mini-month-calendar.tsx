"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

/** Lunes = primera columna (misma lógica que Reservas). */
const WEEKDAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"] as const;

function formatLocalYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfLocalDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function sameLocalDay(a: Date, b: Date): boolean {
  return formatLocalYmd(a) === formatLocalYmd(b);
}

export type MiniMonthCalendarProps = {
  viewMonth: Date;
  onViewMonthChange: (d: Date) => void;
  selectedDate: Date | null;
  onSelectDate: (d: Date) => void;
  /** Punto bajo el día (reservas del día). */
  markedDays?: Set<string>;
  /** Fondo destacado (turnos personalizados en excepciones). */
  highlightedDays?: Set<string>;
  className?: string;
};

export function MiniMonthCalendar({
  viewMonth,
  onViewMonthChange,
  selectedDate,
  onSelectDate,
  markedDays = new Set(),
  highlightedDays = new Set(),
  className,
}: MiniMonthCalendarProps) {
  const y = viewMonth.getFullYear();
  const m = viewMonth.getMonth();
  const first = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7;
  const today = startOfLocalDay(new Date());

  const cells: (number | null)[] = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= lastDay; d++) cells.push(d);

  const title = viewMonth.toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className={cn("rounded-2xl", className)}>
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          className="border-border text-muted-foreground hover:bg-muted inline-flex size-8 items-center justify-center rounded-full border"
          onClick={() => onViewMonthChange(new Date(y, m - 1, 1))}
          aria-label="Mes anterior"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-sm font-semibold capitalize">{title}</span>
        <button
          type="button"
          className="border-border text-muted-foreground hover:bg-muted inline-flex size-8 items-center justify-center rounded-full border"
          onClick={() => onViewMonthChange(new Date(y, m + 1, 1))}
          aria-label="Mes siguiente"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="mb-2 grid grid-cols-7 text-center text-xs text-muted-foreground">
        {WEEKDAY_LABELS.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="h-9" />;
          }
          const cellDate = new Date(y, m, day);
          const ymd = formatLocalYmd(cellDate);
          const isSelected =
            selectedDate != null && sameLocalDay(cellDate, selectedDate);
          const isToday = sameLocalDay(cellDate, today);
          const hasMark = markedDays.has(ymd);
          const isHighlighted = highlightedDays.has(ymd);

          return (
            <button
              key={ymd}
              type="button"
              onClick={() => onSelectDate(cellDate)}
              className={cn(
                "relative h-9 rounded-lg text-sm font-medium transition-colors",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : isHighlighted
                    ? "bg-[#d4f542]/40 hover:bg-[#d4f542]/55"
                    : "hover:bg-muted",
                isToday && !isSelected && "ring-primary/40 ring-2",
              )}
            >
              {day}
              {hasMark && !isSelected && !isHighlighted ? (
                <span className="bg-primary absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
