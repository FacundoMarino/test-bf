"use client";

import type { ClubScheduleBlocks } from "@/types/club";
import { SLOT_DURATION_OPTIONS } from "@/types/club";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export const CLUB_SCHEDULE_DAY_ROWS = [
  {
    groupKey: "weekday" as const,
    label: "Lunes – Viernes",
    day: "Lunes - Viernes",
  },
  { groupKey: "saturday" as const, label: "Sábado", day: "Sábado" },
  { groupKey: "sunday" as const, label: "Domingo", day: "Domingo" },
] as const;

export type ScheduleBlocksEditorProps = {
  value: ClubScheduleBlocks;
  onChange: (next: ClubScheduleBlocks) => void;
  slotDurationOptions?: ReadonlyArray<{ minutes: number; label: string }>;
  idPrefix?: string;
};

export function ScheduleBlocksEditor({
  value,
  onChange,
  slotDurationOptions = SLOT_DURATION_OPTIONS,
  idPrefix = "schedule",
}: ScheduleBlocksEditorProps) {
  return (
    <div className="space-y-4">
      {CLUB_SCHEDULE_DAY_ROWS.map(({ groupKey, label }) => {
        const block = value[groupKey];
        const knownSlot = slotDurationOptions.some(
          (o) => o.minutes === block.slotDurationMinutes,
        );
        const active = block.enabled;
        return (
          <div
            key={groupKey}
            className="border-border/80 space-y-3 rounded-lg border px-4 py-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm font-medium">{label}</span>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor={`${idPrefix}-${groupKey}-enabled`}
                  className="text-muted-foreground cursor-pointer text-xs font-normal"
                >
                  Abre
                </Label>
                <Switch
                  id={`${idPrefix}-${groupKey}-enabled`}
                  checked={active}
                  onCheckedChange={(checked) =>
                    onChange({
                      ...value,
                      [groupKey]: {
                        ...value[groupKey],
                        enabled: checked,
                      },
                    })
                  }
                />
              </div>
            </div>
            <div
              className={cn(
                "grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:items-end",
                !active && "pointer-events-none opacity-45",
              )}
            >
              <div className="space-y-1.5">
                <Label
                  className="text-xs"
                  htmlFor={`${idPrefix}-${groupKey}-start`}
                >
                  Inicio
                </Label>
                <Input
                  id={`${idPrefix}-${groupKey}-start`}
                  type="time"
                  value={block.startTime}
                  disabled={!active}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      [groupKey]: {
                        ...value[groupKey],
                        startTime: e.target.value,
                      },
                    })
                  }
                  className="h-10 rounded-lg"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  className="text-xs"
                  htmlFor={`${idPrefix}-${groupKey}-end`}
                >
                  Fin
                </Label>
                <Input
                  id={`${idPrefix}-${groupKey}-end`}
                  type="time"
                  value={block.endTime}
                  disabled={!active}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      [groupKey]: {
                        ...value[groupKey],
                        endTime: e.target.value,
                      },
                    })
                  }
                  className="h-10 rounded-lg"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
                <Label
                  className="text-xs"
                  htmlFor={`${idPrefix}-${groupKey}-slot`}
                >
                  Duración del slot
                </Label>
                <select
                  id={`${idPrefix}-${groupKey}-slot`}
                  value={block.slotDurationMinutes}
                  disabled={!active}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      [groupKey]: {
                        ...value[groupKey],
                        slotDurationMinutes: Number.parseInt(
                          e.target.value,
                          10,
                        ),
                      },
                    })
                  }
                  className="border-input bg-background h-10 w-full max-w-xs rounded-lg border px-3 text-sm shadow-sm disabled:cursor-not-allowed"
                >
                  {slotDurationOptions.map((o) => (
                    <option key={o.minutes} value={o.minutes}>
                      {o.label}
                    </option>
                  ))}
                  {!knownSlot ? (
                    <option value={block.slotDurationMinutes}>
                      {block.slotDurationMinutes} min (guardado)
                    </option>
                  ) : null}
                </select>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
