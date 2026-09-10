"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { GripVertical, Info, Plus, Trash2, Users } from "lucide-react";

import {
  runTournamentDrawAction,
  saveTournamentManualZonesAction,
} from "@/actions/tournaments";
import { Button } from "@/components/ui/button";
import type {
  TournamentCategory,
  TournamentZoneGroupFormat,
} from "@/types/tournament";

type ZoneEntryView = {
  id: string;
  registrationId: string | null;
  label: string;
  isBye: boolean;
};

type CrossMatchView = {
  homeRegistrationId: string;
  awayRegistrationId: string;
};

type ZoneView = {
  id: string;
  name: string;
  order: number;
  groupMatchFormat: TournamentZoneGroupFormat;
  groupCrossPairing: CrossMatchView[];
  entries: ZoneEntryView[];
};

type Props = {
  clubId: string;
  tournamentId: string;
  categories: TournamentCategory[];
};

function pairLabelFromRegistration(
  category: TournamentCategory,
  registrationId: string,
) {
  const registration = category.registrations.find(
    (item) => item.id === registrationId,
  );
  if (!registration) return "Pareja";
  const playerName = registration.playerProfile.fullName ?? "Jugador";
  return `${playerName} / ${registration.partnerName}`;
}

function parseCrossPairing(
  value: TournamentCategory["zones"][number]["groupCrossPairing"],
): CrossMatchView[] {
  if (!value) return [];
  const rows = Array.isArray(value)
    ? value
    : Array.isArray((value as { firstRound?: CrossMatchView[] }).firstRound)
      ? (value as { firstRound: CrossMatchView[] }).firstRound
      : [];
  return rows
    .map((row) => ({
      homeRegistrationId: row.homeRegistrationId,
      awayRegistrationId: row.awayRegistrationId,
    }))
    .filter((row) => row.homeRegistrationId && row.awayRegistrationId);
}

function isEvenGroupSize(count: number) {
  return count >= 2 && count % 2 === 0;
}

function normalizeZoneFormat(zone: ZoneView): ZoneView {
  const realCount = zone.entries.filter(
    (entry) => entry.registrationId && !entry.isBye,
  ).length;
  if (!isEvenGroupSize(realCount)) {
    return {
      ...zone,
      groupMatchFormat: "ROUND_ROBIN",
      groupCrossPairing: [],
    };
  }
  if (
    zone.groupMatchFormat === "CROSSED" &&
    zone.groupCrossPairing.length !== realCount / 2
  ) {
    return { ...zone, groupCrossPairing: defaultCrossPairing(zone.entries) };
  }
  return zone;
}

function defaultCrossPairing(entries: ZoneEntryView[]): CrossMatchView[] {
  const real = entries
    .map((entry) => entry.registrationId)
    .filter((id): id is string => Boolean(id));
  if (!isEvenGroupSize(real.length)) return [];
  const half = real.length / 2;
  return Array.from({ length: half }, (_, index) => ({
    homeRegistrationId: real[index],
    awayRegistrationId: real[index + half],
  }));
}

function buildInitialZones(categories: TournamentCategory[]) {
  return Object.fromEntries(
    categories.map((category) => [
      category.id,
      category.zones.map((zone) => ({
        id: zone.id,
        name: zone.name,
        order: zone.order,
        groupMatchFormat:
          zone.groupMatchFormat === "CROSSED" ? "CROSSED" : "ROUND_ROBIN",
        groupCrossPairing: parseCrossPairing(zone.groupCrossPairing),
        entries: zone.entries.map((entry) => ({
          id: entry.id,
          registrationId: entry.registration?.id ?? null,
          label: entry.isBye
            ? "BYE"
            : entry.registration
              ? pairLabelFromRegistration(category, entry.registration.id)
              : "Pareja",
          isBye: entry.isBye,
        })),
      })),
    ]),
  ) as Record<string, ZoneView[]>;
}

function categoriesSyncKey(categories: TournamentCategory[]) {
  return categories
    .map((category) => {
      const zonesKey = category.zones
        .map(
          (zone) =>
            `${zone.id}:${zone.entries
              .map(
                (entry) =>
                  `${entry.id}:${entry.registration?.id ?? "bye"}:${entry.isBye ? 1 : 0}`,
              )
              .join(",")}`,
        )
        .join("|");
      return `${category.id}[${zonesKey}]`;
    })
    .join(";");
}

export function TournamentDrawBoard({
  clubId,
  tournamentId,
  categories,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const syncKey = categoriesSyncKey(categories);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categories[0]?.id ?? "",
  );
  const [zonesByCategory, setZonesByCategory] = useState<
    Record<string, ZoneView[]>
  >(() => buildInitialZones(categories));
  const [zonesSyncKey, setZonesSyncKey] = useState(syncKey);
  const [draggingEntry, setDraggingEntry] = useState<{
    categoryId: string;
    zoneId: string;
    entryId: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Re-sincroniza el estado local cuando llega data fresca del servidor (sin useEffect).
  if (zonesSyncKey !== syncKey) {
    setZonesSyncKey(syncKey);
    setZonesByCategory(buildInitialZones(categories));
    if (!categories.some((category) => category.id === selectedCategoryId)) {
      setSelectedCategoryId(categories[0]?.id ?? "");
    }
  }

  const selectedCategory = useMemo(
    () =>
      categories.find((category) => category.id === selectedCategoryId) ?? null,
    [categories, selectedCategoryId],
  );

  const selectedZones = useMemo(
    () => zonesByCategory[selectedCategoryId] ?? [],
    [zonesByCategory, selectedCategoryId],
  );
  const oddTotalPairs =
    (selectedCategory?.registrations.length ?? 0) % 2 === 1;
  const hasUnsavedChanges = useMemo(() => {
    if (!selectedCategory) return false;
    const original =
      buildInitialZones([selectedCategory])[selectedCategory.id] ?? [];
    return JSON.stringify(original) !== JSON.stringify(selectedZones);
  }, [selectedCategory, selectedZones]);

  const onRunDraw = () => {
    if (!selectedCategoryId) return;
    setError(null);
    startTransition(async () => {
      const response = await runTournamentDrawAction(
        clubId,
        tournamentId,
        selectedCategoryId,
      );
      if (!response.ok) {
        setError(response.error);
        return;
      }
      router.refresh();
    });
  };

  const onSaveManualZones = () => {
    if (!selectedCategoryId || !selectedZones.length) return;
    setError(null);
    startTransition(async () => {
      const response = await saveTournamentManualZonesAction(
        clubId,
        tournamentId,
        selectedCategoryId,
        {
          zones: selectedZones.map((zone) => ({
            zoneId: zone.id,
            groupMatchFormat: zone.groupMatchFormat,
            groupCrossPairing:
              zone.groupMatchFormat === "CROSSED"
                ? zone.groupCrossPairing
                : undefined,
            entries: zone.entries.map((entry) => ({
              registrationId: entry.registrationId ?? undefined,
              isBye: entry.isBye,
            })),
          })),
        },
      );
      if (!response.ok) {
        setError(response.error);
        return;
      }
      router.refresh();
    });
  };

  const moveEntryToZone = (targetZoneId: string) => {
    if (!draggingEntry || draggingEntry.categoryId !== selectedCategoryId)
      return;
    setZonesByCategory((current) => {
      const zones = [...(current[selectedCategoryId] ?? [])];
      const sourceZone = zones.find((zone) => zone.id === draggingEntry.zoneId);
      const targetZone = zones.find((zone) => zone.id === targetZoneId);
      if (!sourceZone || !targetZone) return current;

      const entry = sourceZone.entries.find(
        (item) => item.id === draggingEntry.entryId,
      );
      if (!entry) return current;
      sourceZone.entries = sourceZone.entries.filter(
        (item) => item.id !== entry.id,
      );
      targetZone.entries = [...targetZone.entries, entry];
      return {
        ...current,
        [selectedCategoryId]: zones.map((zone) => normalizeZoneFormat(zone)),
      };
    });
    setDraggingEntry(null);
  };

  const removeZoneEntry = (zoneId: string, entryId: string) => {
    setZonesByCategory((current) => {
      const zones = (current[selectedCategoryId] ?? []).map((zone) =>
        zone.id === zoneId
          ? {
              ...zone,
              entries: zone.entries.filter((entry) => entry.id !== entryId),
            }
          : zone,
      );
      return {
        ...current,
        [selectedCategoryId]: zones.map((zone) => normalizeZoneFormat(zone)),
      };
    });
  };

  const addByeToZone = (zoneId: string) => {
    setZonesByCategory((current) => {
      const zones = (current[selectedCategoryId] ?? []).map((zone) =>
        zone.id === zoneId
          ? {
              ...zone,
              entries: [
                ...zone.entries,
                {
                  id: `bye-${Date.now()}-${Math.random().toString(16).slice(2)}`,
                  registrationId: null,
                  label: "BYE",
                  isBye: true,
                },
              ],
            }
          : zone,
      );
      return { ...current, [selectedCategoryId]: zones };
    });
  };

  if (!categories.length) return null;

  return (
    <section className="space-y-3 p-4">
      <div className="space-y-2 rounded-xl border border-border/80 border-l-4 border-l-primary bg-card p-3">
        <div className="flex flex-wrap items-center gap-2">
          <select
            className="border-input bg-background h-10 min-w-52 rounded-lg border px-3 text-sm"
            value={selectedCategoryId}
            onChange={(event) => setSelectedCategoryId(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <Button
            type="button"
            onClick={onRunDraw}
            disabled={isPending || !selectedCategoryId}
            className="h-10 rounded-lg"
          >
            <Users className="size-4" />
            Sortear zonas
          </Button>
          <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
            <Users className="size-3.5" />
            {selectedCategory?.registrations.length ?? 0} parejas ·{" "}
            {selectedCategory?.groupTeamsPerZone ?? 0} por zona →{" "}
            {selectedCategory
              ? Math.max(
                  1,
                  Math.ceil(
                    selectedCategory.registrations.length /
                      Math.max(1, selectedCategory.groupTeamsPerZone),
                  ),
                )
              : 0}{" "}
            zonas
          </span>
          {hasUnsavedChanges ? (
            <Button
              type="button"
              variant="outline"
              onClick={onSaveManualZones}
              disabled={isPending || !selectedCategoryId}
              className="h-10 rounded-lg"
            >
              Guardar ajustes
            </Button>
          ) : null}
        </div>
        <p className="text-muted-foreground inline-flex items-center gap-1 text-xs">
          <Info className="size-3.5" />
          Arrastrá una pareja de una zona a otra. Si el total de parejas de la
          categoría es impar, en la zona que quede par podés usar el cruce
          (primera ronda + ganador vs perdedor) para que todos jueguen 2
          partidos.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {selectedCategory ? (
        <div className="space-y-2 rounded-xl border border-border/80 bg-card px-3 py-2.5">
          <p className="inline-flex items-center gap-1.5 text-sm font-semibold">
            <Users className="size-3.5 text-primary" />
            Parejas inscriptas ({selectedCategory.registrations.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {selectedCategory.registrations.map((registration) => (
              <span
                key={registration.id}
                className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium leading-none"
              >
                {(registration.playerProfile.fullName ?? "Jugador") +
                  " / " +
                  registration.partnerName}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {selectedZones.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {selectedZones
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((zone, zoneIndex) => {
              const letter =
                zone.name
                  .replace(/^Zona\s+/i, "")
                  .trim()
                  .charAt(0) || String.fromCharCode(65 + zoneIndex);
              const accentClass =
                zoneIndex % 2 === 0 ? "border-l-primary" : "border-l-lime-500";
              const badgeClass =
                zoneIndex % 2 === 0
                  ? "bg-primary/15 text-primary"
                  : "bg-lime-500/15 text-lime-700";
              return (
                <div
                  key={zone.id}
                  className={`rounded-xl border border-border/80 border-l-4 bg-card ${accentClass}`}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => moveEntryToZone(zone.id)}
                >
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <p className="inline-flex items-center gap-2 text-sm font-semibold">
                      <span
                        className={`inline-flex size-6 items-center justify-center rounded-full text-xs font-bold ${badgeClass}`}
                      >
                        {letter}
                      </span>
                      {zone.name}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs font-semibold"
                      onClick={() => addByeToZone(zone.id)}
                    >
                      <Plus className="size-3.5" />
                      BYE
                    </Button>
                  </div>
                  {(() => {
                    const realEntries = zone.entries.filter(
                      (entry) => entry.registrationId && !entry.isBye,
                    );
                    const canCross =
                      oddTotalPairs && isEvenGroupSize(realEntries.length);
                    return (
                      <div className="space-y-2 px-3 pb-2">
                        <select
                          className="border-input bg-background h-9 w-full rounded-lg border px-2 text-xs"
                          value={canCross ? zone.groupMatchFormat : "ROUND_ROBIN"}
                          disabled={!canCross}
                          onChange={(event) => {
                            const format = event.target.value as
                              | "ROUND_ROBIN"
                              | "CROSSED";
                            setZonesByCategory((current) => {
                              const zones = (current[selectedCategoryId] ?? []).map(
                                (item) =>
                                  item.id === zone.id
                                    ? {
                                        ...item,
                                        groupMatchFormat: format,
                                        groupCrossPairing:
                                          format === "CROSSED"
                                            ? item.groupCrossPairing.length ===
                                              realEntries.length / 2
                                              ? item.groupCrossPairing
                                              : defaultCrossPairing(item.entries)
                                            : [],
                                      }
                                    : item,
                              );
                              return { ...current, [selectedCategoryId]: zones };
                            });
                          }}
                        >
                          <option value="ROUND_ROBIN">
                            Todos contra todos
                          </option>
                          <option value="CROSSED">
                            Cruce (2 partidos por pareja)
                          </option>
                        </select>
                        {canCross && zone.groupMatchFormat === "CROSSED" ? (
                          <div className="space-y-1.5 rounded-lg border border-border/70 bg-background p-2">
                            <p className="text-muted-foreground text-[11px]">
                              Definí los partidos de la primera ronda. Después se
                              juega Ganador 1 vs Perdedor 2, Ganador 2 vs Perdedor
                              3, y así (el último contra el perdedor del primero).
                            </p>
                            {Array.from(
                              { length: realEntries.length / 2 },
                              (_, matchIndex) => {
                              const pairing =
                                zone.groupCrossPairing[matchIndex] ?? {
                                  homeRegistrationId:
                                    realEntries[matchIndex * 2]?.registrationId ??
                                    "",
                                  awayRegistrationId:
                                    realEntries[matchIndex * 2 + 1]
                                      ?.registrationId ?? "",
                                };
                              const usedElsewhere = new Set(
                                zone.groupCrossPairing
                                  .filter((_, index) => index !== matchIndex)
                                  .flatMap((row) => [
                                    row.homeRegistrationId,
                                    row.awayRegistrationId,
                                  ]),
                              );
                              return (
                                <div
                                  key={`cross-${zone.id}-${matchIndex}`}
                                  className="grid grid-cols-[1fr_auto_1fr] items-center gap-1"
                                >
                                  <select
                                    className="border-input h-8 rounded-md border px-1 text-[11px]"
                                    value={pairing.homeRegistrationId}
                                    onChange={(event) => {
                                      const homeRegistrationId = event.target.value;
                                      setZonesByCategory((current) => {
                                        const zones = (
                                          current[selectedCategoryId] ?? []
                                        ).map((item) => {
                                          if (item.id !== zone.id) return item;
                                          const next = [...item.groupCrossPairing];
                                          next[matchIndex] = {
                                            ...pairing,
                                            homeRegistrationId,
                                          };
                                          return {
                                            ...item,
                                            groupCrossPairing: next,
                                          };
                                        });
                                        return {
                                          ...current,
                                          [selectedCategoryId]: zones,
                                        };
                                      });
                                    }}
                                  >
                                    {realEntries.map((entry) => (
                                      <option
                                        key={entry.id}
                                        value={entry.registrationId ?? ""}
                                        disabled={usedElsewhere.has(
                                          entry.registrationId ?? "",
                                        )}
                                      >
                                        {entry.label}
                                      </option>
                                    ))}
                                  </select>
                                  <span className="text-muted-foreground text-[10px] font-semibold">
                                    VS
                                  </span>
                                  <select
                                    className="border-input h-8 rounded-md border px-1 text-[11px]"
                                    value={pairing.awayRegistrationId}
                                    onChange={(event) => {
                                      const awayRegistrationId = event.target.value;
                                      setZonesByCategory((current) => {
                                        const zones = (
                                          current[selectedCategoryId] ?? []
                                        ).map((item) => {
                                          if (item.id !== zone.id) return item;
                                          const next = [...item.groupCrossPairing];
                                          next[matchIndex] = {
                                            ...pairing,
                                            awayRegistrationId,
                                          };
                                          return {
                                            ...item,
                                            groupCrossPairing: next,
                                          };
                                        });
                                        return {
                                          ...current,
                                          [selectedCategoryId]: zones,
                                        };
                                      });
                                    }}
                                  >
                                    {realEntries.map((entry) => (
                                      <option
                                        key={entry.id}
                                        value={entry.registrationId ?? ""}
                                        disabled={usedElsewhere.has(
                                          entry.registrationId ?? "",
                                        )}
                                      >
                                        {entry.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              );
                            })}
                          </div>
                        ) : null}
                        {!canCross ? (
                          <p className="text-muted-foreground text-[11px]">
                            {oddTotalPairs
                              ? "El cruce se usa en la zona que quedó con cantidad par."
                              : "El cruce se habilita cuando el total de parejas de la categoría es impar."}
                          </p>
                        ) : null}
                      </div>
                    );
                  })()}
                  <div className="space-y-2 px-3 pb-3">
                    {zone.entries.map((entry) => (
                      <div
                        key={entry.id}
                        draggable
                        onDragStart={() =>
                          setDraggingEntry({
                            categoryId: selectedCategoryId,
                            zoneId: zone.id,
                            entryId: entry.id,
                          })
                        }
                        onDragEnd={() => setDraggingEntry(null)}
                        className="flex cursor-grab items-center justify-between rounded-full border border-border/80 bg-background px-3 py-2 text-sm active:cursor-grabbing"
                      >
                        <span className="inline-flex items-center gap-2">
                          <GripVertical className="size-4 text-muted-foreground" />
                          {entry.label}
                        </span>
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-rose-600"
                          onClick={() => removeZoneEntry(zone.id, entry.id)}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
          Todavía no hay zonas. Tocá &quot;Sortear parejas&quot; para
          generarlas.
        </div>
      )}
    </section>
  );
}
