"use client";

import { useMemo, useState } from "react";
import { BarChart3, Info, Trophy } from "lucide-react";

import type {
  TournamentCategory,
  TournamentCategoryStandings,
  TournamentStandingRow,
} from "@/types/tournament";

type Props = {
  categories: TournamentCategory[];
  standingsByCategory: Record<string, TournamentCategoryStandings>;
};

function formatSigned(value: number) {
  if (value > 0) return `+${value}`;
  return String(value);
}

function ZoneTable({
  zoneName,
  rows,
}: {
  zoneName: string;
  rows: TournamentStandingRow[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/80 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-border/60 bg-[#F8F9FB] px-4 py-3">
        <p className="text-sm font-semibold text-foreground">{zoneName}</p>
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
          {rows.length} {rows.length === 1 ? "pareja" : "parejas"}
        </span>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="border-b border-border/50 text-[11px] uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 font-semibold">Pareja</th>
              <th className="px-2 py-2.5 text-center font-semibold">PG</th>
              <th className="px-2 py-2.5 text-center font-semibold">PP</th>
              <th className="px-2 py-2.5 text-center font-semibold">
                Dif. sets
              </th>
              <th className="px-2 py-2.5 text-center font-semibold">
                Dif. games
              </th>
              <th className="px-4 py-2.5 text-right font-semibold">Pts</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row.registrationId}
                className={index % 2 === 0 ? "bg-primary/[0.03]" : "bg-white"}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-4 text-xs font-medium">
                      {index + 1}
                    </span>
                    <span
                      className={`font-medium ${
                        row.qualifies ? "text-foreground" : "text-foreground/80"
                      }`}
                    >
                      {row.pairLabel}
                    </span>
                    {row.qualifies ? (
                      <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                        Clasifica
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="px-2 py-3 text-center">{row.won}</td>
                <td className="px-2 py-3 text-center">{row.lost}</td>
                <td className="px-2 py-3 text-center">
                  {formatSigned(row.setDiff)}
                </td>
                <td className="px-2 py-3 text-center">
                  {formatSigned(row.gameDiff)}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-primary">
                  {row.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TournamentStandingsBoard({
  categories,
  standingsByCategory,
}: Props) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categories[0]?.id ?? "",
  );

  const selectedCategory = useMemo(
    () =>
      categories.find((category) => category.id === selectedCategoryId) ?? null,
    [categories, selectedCategoryId],
  );

  const standings = standingsByCategory[selectedCategoryId] ?? null;
  const zones = standings?.zones ?? [];
  const hasRows = zones.some((zone) => zone.rows.length > 0);

  return (
    <section className="space-y-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-foreground">
          <BarChart3 className="size-5 text-primary" />
          Clasificación
        </h2>
        <select
          className="border-input bg-background h-10 min-w-48 rounded-lg border px-3 text-sm"
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCategory ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
            <Trophy className="size-4 text-primary" />
            {selectedCategory.name}
          </p>
          <p className="text-muted-foreground text-xs">
            Puntos: victoria{" "}
            {standings?.groupPointsWin ?? selectedCategory.groupPointsWin} ·
            derrota{" "}
            {standings?.groupPointsLoss ?? selectedCategory.groupPointsLoss} ·
            no presentado{" "}
            {standings?.groupPointsNoShow ?? selectedCategory.groupPointsNoShow}{" "}
            · clasifican{" "}
            {standings?.groupQualifiers ?? selectedCategory.groupQualifiers} por
            zona
          </p>
        </div>
      ) : null}

      {hasRows ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {zones.map((zone) => (
            <ZoneTable
              key={zone.zoneId}
              zoneName={zone.zoneName}
              rows={zone.rows}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border px-3 py-10 text-center text-sm text-muted-foreground">
          <BarChart3 className="mx-auto mb-2 size-5 opacity-60" />
          Todavía no hay clasificación. Sorteá las zonas y cargá resultados.
        </div>
      )}

      <p className="text-muted-foreground inline-flex items-start gap-2 text-xs">
        <Info className="mt-0.5 size-3.5 shrink-0 text-primary" />
        La tabla se actualiza automáticamente a medida que cargás resultados en
        la pestaña Resultados. Desempate: dif. sets → dif. games →
        enfrentamiento directo.
      </p>
    </section>
  );
}
