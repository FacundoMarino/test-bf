"use client";

import { useState } from "react";
import {
  CalendarDays,
  Grip,
  ListChecks,
  Settings2,
  BarChart3,
  Trophy,
  Users,
} from "lucide-react";

import { TournamentDrawBoard } from "@/components/tournaments/tournament-draw-board";
import { TournamentFixtureBoard } from "@/components/tournaments/tournament-fixture-board";
import { TournamentKnockoutBoard } from "@/components/tournaments/tournament-knockout-board";
import { TournamentEditor } from "@/components/tournaments/tournament-editor";
import { TournamentInscriptionsBoard } from "@/components/tournaments/tournament-inscriptions-board";
import { TournamentResultsBoard } from "@/components/tournaments/tournament-results-board";
import { TournamentStandingsBoard } from "@/components/tournaments/tournament-standings-board";
import type {
  TournamentCategoryStandings,
  TournamentRecord,
} from "@/types/tournament";

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
  { id: "inscripciones", label: "Inscripciones", icon: ListChecks },
  { id: "sorteo", label: "Sorteo", icon: Users },
  { id: "fixture", label: "Fixture", icon: CalendarDays },
  { id: "resultados", label: "Resultados", icon: Trophy },
  { id: "clasificacion", label: "Clasificación", icon: BarChart3 },
  { id: "cuadros", label: "Cuadros", icon: Grip },
] as const;

type TabId = (typeof tabs)[number]["id"];

type Props = {
  clubId: string;
  ownClubName: string;
  tournament: TournamentRecord;
  courts: CourtOption[];
  standingsByCategory: Record<string, TournamentCategoryStandings>;
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

      {activeTab === "inscripciones" ? (
        <TournamentInscriptionsBoard
          clubId={clubId}
          tournamentId={tournament.id}
          categories={tournament.categories}
          startsAt={tournament.startsAt}
          endsAt={tournament.endsAt}
        />
      ) : null}

      {activeTab === "sorteo" ? (
        <TournamentDrawBoard
          clubId={clubId}
          tournamentId={tournament.id}
          categories={tournament.categories}
        />
      ) : null}

      {activeTab === "fixture" ? (
        <TournamentFixtureBoard
          clubId={clubId}
          tournamentId={tournament.id}
          ownClubName={ownClubName}
          categories={tournament.categories}
          matches={tournament.matches}
          courtBlocks={tournament.courtBlocks}
          courts={courts}
        />
      ) : null}

      {activeTab === "resultados" ? (
        <TournamentResultsBoard
          clubId={clubId}
          tournamentId={tournament.id}
          categories={tournament.categories}
          allMatches={tournament.matches}
        />
      ) : null}

      {activeTab === "clasificacion" ? (
        <TournamentStandingsBoard
          categories={tournament.categories}
          standingsByCategory={standingsByCategory}
        />
      ) : null}

      {activeTab === "cuadros" ? (
        <TournamentKnockoutBoard
          clubId={clubId}
          tournamentId={tournament.id}
          categories={tournament.categories}
          knockoutMatches={tournament.matches.filter(
            (match) => match.phase === "KNOCKOUT",
          )}
        />
      ) : null}
    </>
  );
}
