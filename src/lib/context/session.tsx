// lib/context/session.tsx
"use client";

import { createContext, useContext } from "react";
import type { Session } from "next-auth"; // or your custom auth type

const SessionContext = createContext<Session | null>(null);

export const SessionProvider = ({
  value,
  children,
}: {
  value: Session;
  children: React.ReactNode;
}) => {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
