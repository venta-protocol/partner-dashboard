import type { Config } from "drizzle-kit";
import { DATABASE_URL } from "./src/lib/config";
export default {
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db/supabase",
  breakpoints: true,
  driver: "pg",
  dbCredentials: {
    connectionString: DATABASE_URL,
  },
} satisfies Config;
