"use client";

import { createContext, useContext, useEffect } from "react";

import type { User } from "@/types";

export type AuthContextValue = {
  user: User;
  isClubAccount: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  user,
  isClubAccount = false,
  children,
}: {
  user: User;
  isClubAccount?: boolean;
  children: React.ReactNode;
}) {
  return (
    <AuthContext.Provider value={{ user, isClubAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return ctx;
}
