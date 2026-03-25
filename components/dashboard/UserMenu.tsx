"use client";

import { useRouter } from "next/navigation";
import type { Route } from "next";
import { Building2, ChevronDown } from "lucide-react";

import { logoutAction } from "@/actions/auth";
import { useAuth } from "@/hooks";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
  const router = useRouter();
  const { user, isClubAccount } = useAuth();

  const initial = user.name.slice(0, 1).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "border-border/80 gap-2 transition-colors duration-150 ease-out",
        )}
      >
        <span className="bg-primary/15 text-primary flex size-7 items-center justify-center rounded-full text-xs font-medium">
          {initial}
        </span>
        <span className="hidden max-w-[140px] truncate sm:inline">
          {user.name}
        </span>
        <ChevronDown className="text-muted-foreground size-4 opacity-70" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-0.5">
            <span className="truncate font-medium">{user.name}</span>
            <span className="text-muted-foreground truncate text-xs font-normal">
              {user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isClubAccount ? (
          <>
            <div className="p-1">
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onClick={() => router.push("/dashboard/club" as Route)}
              >
                <Building2 className="size-4" />
                Editar mi club
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
          </>
        ) : null}
        <form action={logoutAction} className="p-1">
          <button
            type="submit"
            className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors duration-150 ease-out"
          >
            Cerrar sesión
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
