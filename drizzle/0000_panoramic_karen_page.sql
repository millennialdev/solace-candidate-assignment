CREATE TABLE IF NOT EXISTS "advocates" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"city" text NOT NULL,
	"degree" text NOT NULL,
	"specialties" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"years_of_experience" integer NOT NULL,
	"phone_number" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_advocates_city" ON "advocates" USING btree ("city");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_advocates_degree" ON "advocates" USING btree ("degree");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_advocates_experience" ON "advocates" USING btree ("years_of_experience");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_advocates_first_name" ON "advocates" USING btree ("first_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_advocates_last_name" ON "advocates" USING btree ("last_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_advocates_city_degree" ON "advocates" USING btree ("city","degree");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_advocates_experience_first_name" ON "advocates" USING btree ("years_of_experience","first_name");