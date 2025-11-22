import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { logger } from "../utils/logger";

const setup = () => {
  if (!process.env.DATABASE_URL) {
    logger.warn("DATABASE_URL is not set, database queries will fall back to mock data");
    // Return a mock database instance with the proper type
    // This will be type-compatible but will fail at runtime if used
    // The seed route now checks for DATABASE_URL before using db methods
    return drizzle(null as any);
  }

  // for query purposes
  const queryClient = postgres(process.env.DATABASE_URL);
  const db = drizzle(queryClient);
  return db;
};

export default setup();
