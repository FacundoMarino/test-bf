"use client";

import { useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  CalendarDays,
  ShieldCheck,
  Grid3x3,
  Home,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

import { cn } from "@/lib/utils";

const baseNav = [{ href: "/dashboard", label: "Inicio", icon: Home }] as const;

export function Sidebar({
  showClubNav = false,
  showSuperAdminNav = false,
}: {
  showClubNav?: boolean;
  showSuperAdminNav?: boolean;
}) {
  const nav = showSuperAdminNav
    ? ([
        {
          href: "/dashboard/admin/clubs",
          label: "Aprobar clubes",
          icon: ShieldCheck,
        },
      ] as const)
    : ([
        baseNav[0],
        ...(showClubNav
          ? ([
              {
                href: "/dashboard/club",
                label: "Editar club",
                icon: Building2,
              },
              {
                href: "/dashboard/club/pistas",
                label: "Canchas",
                icon: Grid3x3,
              },
              {
                href: "/dashboard/club/reservas",
                label: "Reservas",
                icon: CalendarDays,
              },
              {
                href: "/dashboard/club/metricas",
                label: "Métricas",
                icon: BarChart3,
              },
            ] as const)
          : []),
      ] as const);
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <input
        type="checkbox"
        id="mobile-nav"
        className="peer/nav sr-only"
        aria-hidden
      />
      <label
        htmlFor="mobile-nav"
        className="border-border bg-sidebar text-sidebar-foreground fixed left-4 top-4 z-50 flex size-10 cursor-pointer items-center justify-center rounded-lg border shadow-sm transition-colors duration-150 ease-out hover:bg-accent md:hidden"
      >
        <span className="sr-only">Abrir o cerrar menú</span>
        <PanelLeft className="size-5" />
      </label>
      <aside
        className={cn(
          "border-border bg-sidebar text-sidebar-foreground fixed inset-y-0 left-0 z-40 flex w-56 -translate-x-full flex-col border-r transition-[transform,width] duration-150 ease-out peer-checked/nav:translate-x-0 md:relative md:z-0 md:translate-x-0",
          collapsed ? "md:w-[4.5rem]" : "md:w-56",
        )}
      >
        <div className="flex h-14 items-center justify-between gap-2 border-b border-border/80 px-3">
          {!collapsed ? (
            <span className="text-primary truncate text-sm font-semibold tracking-tight">
              Serxus
            </span>
          ) : (
            <span className="text-primary mx-auto text-xs font-bold">S</span>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground hidden size-8 shrink-0 items-center justify-center rounded-md transition-colors duration-150 ease-out md:inline-flex"
            aria-label={collapsed ? "Expandir barra" : "Colapsar barra"}
          >
            {collapsed ? (
              <PanelLeft className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-2">
          {nav.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== "/dashboard/club" && pathname.startsWith(`${href}/`));
            return (
              <Link
                key={href}
                href={href as Route}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors duration-150 ease-out",
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  collapsed && "md:justify-center md:px-0",
                )}
                title={collapsed ? label : undefined}
              >
                <Icon className="size-[1.125rem] shrink-0" />
                <span className={cn("truncate", collapsed && "md:sr-only")}>
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <label
        htmlFor="mobile-nav"
        className="pointer-events-none fixed inset-0 z-30 bg-black/50 opacity-0 transition-opacity duration-150 ease-out peer-checked/nav:pointer-events-auto peer-checked/nav:opacity-100 md:hidden"
        aria-hidden
      />
    </>
  );
}
