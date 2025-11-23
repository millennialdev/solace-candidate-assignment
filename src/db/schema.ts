import { sql } from "drizzle-orm";
import {
  pgTable,
  integer,
  text,
  jsonb,
  serial,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

const advocates = pgTable(
  "advocates",
  {
    id: serial("id").primaryKey(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    city: text("city").notNull(),
    degree: text("degree").notNull(),
    specialties: jsonb("specialties").default([]).notNull(),
    yearsOfExperience: integer("years_of_experience").notNull(),
    phoneNumber: text("phone_number").notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      // Indexes for common filters
      cityIdx: index("idx_advocates_city").on(table.city),
      degreeIdx: index("idx_advocates_degree").on(table.degree),
      experienceIdx: index("idx_advocates_experience").on(table.yearsOfExperience),

      // Indexes for sorting and searching
      firstNameIdx: index("idx_advocates_first_name").on(table.firstName),
      lastNameIdx: index("idx_advocates_last_name").on(table.lastName),

      // Note: GIN index for specialties is created via migration SQL
      // Standard B-tree index is created here for consistency
      // Use the migration file (001_add_indexes.sql) to create the GIN index in production

      // Composite indexes for common query patterns
      cityDegreeIdx: index("idx_advocates_city_degree").on(table.city, table.degree),
      experienceFirstNameIdx: index("idx_advocates_experience_first_name").on(
        table.yearsOfExperience,
        table.firstName
      ),
    };
  }
);

export { advocates };
