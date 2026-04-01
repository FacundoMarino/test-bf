"use client";

import { useMemo, useState } from "react";
import { CalendarRange, Clock } from "lucide-react";

import { CourtAvailabilityDialog } from "@/components/courts/CourtAvailabilityDialog";
import { CourtScheduleDialog } from "@/components/courts/CourtScheduleDialog";

type HeaderCourt = {
  id: string;
  name: string;
  type: string;
  surface: string;
};

type CourtDialogCourt = HeaderCourt & {
  lighting: boolean;
  clubId: string;
  createdAt: string;
  updatedAt: string;
};

export function ReservationsHeaderActions({
  clubId,
  courts,
}: {
  clubId: string;
  courts: HeaderCourt[];
}) {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);

  const selectedCourt = useMemo<CourtDialogCourt | null>(() => {
    const first = courts[0];
    if (!first) return null;
    return {
      ...first,
      lighting: false,
      clubId,
      createdAt: "",
      updatedAt: "",
    };
  }, [courts, clubId]);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="border-input bg-background hover:bg-muted inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium shadow-sm transition-colors disabled:opacity-50"
          disabled={!selectedCourt}
          onClick={() => setScheduleOpen(true)}
        >
          <Clock className="size-4" />
          Horarios
        </button>
        <button
          type="button"
          className="border-input bg-background hover:bg-muted inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium shadow-sm transition-colors disabled:opacity-50"
          disabled={!selectedCourt}
          onClick={() => setAvailabilityOpen(true)}
        >
          <CalendarRange className="size-4" />
          Excepciones
        </button>
      </div>

      <CourtScheduleDialog
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        clubId={clubId}
        court={selectedCourt}
        onSaved={() => window.location.reload()}
      />
      <CourtAvailabilityDialog
        open={availabilityOpen}
        onOpenChange={setAvailabilityOpen}
        clubId={clubId}
        court={selectedCourt}
        onSaved={() => window.location.reload()}
      />
    </>
  );
}
