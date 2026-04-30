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
  const [selectedCourtId, setSelectedCourtId] = useState<string>(
    () => courts[0]?.id ?? "",
  );

  const dialogCourts = useMemo<CourtDialogCourt[]>(
    () =>
      courts.map((court) => ({
        ...court,
        lighting: false,
        clubId,
        createdAt: "",
        updatedAt: "",
      })),
    [courts, clubId],
  );

  const selectedCourt = useMemo<CourtDialogCourt | null>(() => {
    const picked =
      dialogCourts.find((c) => c.id === selectedCourtId) ??
      dialogCourts[0] ??
      null;
    if (!picked) return null;
    return picked;
  }, [dialogCourts, selectedCourtId]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
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
        selectableCourts={dialogCourts}
        onSelectCourt={setSelectedCourtId}
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
