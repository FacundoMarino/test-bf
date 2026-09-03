"use client";

const dateTimeOpts: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
};

export function formatTournamentDateTime(iso: string) {
  return new Date(iso).toLocaleString("es-AR", dateTimeOpts);
}

export function TournamentDateRange({
  startsAt,
  endsAt,
}: {
  startsAt: string;
  endsAt: string;
}) {
  return (
    <>
      {formatTournamentDateTime(startsAt)} - {formatTournamentDateTime(endsAt)}
    </>
  );
}
