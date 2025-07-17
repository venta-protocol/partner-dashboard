import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export const sqlClient = postgres("", {
  max: 3, // tiny pool – one per concurrent invocation
  idle_timeout: 5_000,
  connect_timeout: 10_000,
  max_lifetime: 1_800, // 30 min
  prepare: false,
});

export const db = drizzle(sqlClient, { schema });

export * from "drizzle-orm";
