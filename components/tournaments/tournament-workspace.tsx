"use client";

import { useState } from "react";
import { CalendarDays, Grip, ListChecks, Settings2, Trophy, Users } from "lucide-react";

import { TournamentDrawBoard } from "@/components/tournaments/tournament-draw-board";
import { TournamentFixtureBoard } from "@/components/tournaments/tournament-fixture-board";
import { TournamentKnockoutBoard } from "@/components/tournaments/tournament-knockout-board";
import { TournamentEditor } from "@/components/tournaments/tournament-editor";
import { TournamentInscriptionsBoard } from "@/components/tournaments/tournament-inscriptions-board";
import { TournamentResultsBoard } from "@/components/tournaments/tournament-results-board";
import type { TournamentRecord, TournamentStandingRow } from "@/types/tournament";

type CourtOption = {
  id: string;
  name: string;
  schedules: Array<{
    dayOfWeek: number;
    startTimeMinutes: number;
    endTimeMinutes: number;
    periodStart?: string | null;
    periodEnd?: string | null;
  }>;
};

const tabs = [
  { id: "configuracion", label: "Configuración", icon: Settings2 },
  { id: "sorteo", label: "Sorteo", icon: Users },
  { id: "cuadro", label: "Cuadro", icon: Grip },
  { id: "fixture", label: "Fixture", icon: CalendarDays },
  { id: "resultados", label: "Resultados", icon: Trophy },
  { id: "inscripciones", label: "Inscripciones", icon: ListChecks },
] as const;

type TabId = (typeof tabs)[number]["id"];

type Props = {
  clubId: string;
  ownClubName: string;
  tournament: TournamentRecord;
  courts: CourtOption[];
  standingsByCategory: Record<string, TournamentStandingRow[]>;
};

export function TournamentWorkspace({
  clubId,
  ownClubName,
  tournament,
  courts,
  standingsByCategory,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("configuracion");

  return (
    <>
      <section className="rounded-xl border border-border bg-card p-2">
        <div className="flex flex-wrap gap-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${
                activeTab === id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          ))}
        </div>
      </section>

      {activeTab === "configuracion" ? (
        <TournamentEditor
          clubId={clubId}
          ownClubName={ownClubName}
          tournament={tournament}
          courts={courts}
          showHeaderCard={false}
        />
      ) : null}

      {activeTab === "sorteo" ? (
        <TournamentDrawBoard
          clubId={clubId}
          tournamentId={tournament.id}
          categories={tournament.categories}
        />
      ) : null}

      {activeTab === "cuadro" ? (
        <TournamentKnockoutBoard
          categories={tournament.categories}
          knockoutMatches={tournament.matches.filter(
            (match) => match.phase === "KNOCKOUT",
          )}
        />
      ) : null}

      {activeTab === "fixture" ? (
        <TournamentFixtureBoard
          categories={tournament.categories}
          matches={tournament.matches}
        />
      ) : null}

      {activeTab === "resultados" ? (
        <TournamentResultsBoard
          clubId={clubId}
          tournamentId={tournament.id}
          categories={tournament.categories}
          allMatches={tournament.matches}
          standingsByCategory={standingsByCategory}
        />
      ) : null}

      {activeTab === "inscripciones" ? (
        <TournamentInscriptionsBoard clubId={clubId} tournamentId={tournament.id} categories={tournament.categories} />
      ) : null}
    </>
  );
}

