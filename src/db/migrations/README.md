# Database Migrations

This directory contains database migration scripts for the Solace Advocates application.

## Running Migrations

### Option 1: Using psql (Recommended for Production)

```bash
# Connect to your PostgreSQL database and run the migration
psql $DATABASE_URL -f src/db/migrations/001_add_indexes.sql
```

### Option 2: Using Drizzle Kit

If you're using Drizzle Kit for migrations:

```bash
npm install drizzle-kit --save-dev
npx drizzle-kit push:pg
```

### Option 3: Manual Execution

Connect to your database using your preferred PostgreSQL client and execute the SQL files in order.

## Migration Files

### 001_add_indexes.sql

Adds performance indexes for:
- **Single column indexes**: city, degree, yearsOfExperience, firstName, lastName
- **GIN index**: specialties (JSONB) for array containment queries
- **Composite indexes**: city+degree, yearsOfExperience+firstName

These indexes are designed to optimize the most common query patterns:
1. Filtering by city, degree, or experience range
2. Searching by name
3. Filtering by specialties
4. Combined filters (e.g., city AND degree)
5. Sorting results by any field

## Performance Impact

With these indexes in place, the application can efficiently handle:
- Hundreds of thousands of advocate records
- Complex multi-filter queries
- Fast sorting on any field
- Specialty containment searches

## Verifying Indexes

To verify indexes are created:

```sql
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'advocates'
ORDER BY indexname;
```

## Rolling Back

To remove all indexes (not recommended):

```sql
DROP INDEX IF EXISTS idx_advocates_city;
DROP INDEX IF EXISTS idx_advocates_degree;
DROP INDEX IF EXISTS idx_advocates_experience;
DROP INDEX IF EXISTS idx_advocates_first_name;
DROP INDEX IF EXISTS idx_advocates_last_name;
DROP INDEX IF EXISTS idx_advocates_specialties;
DROP INDEX IF EXISTS idx_advocates_city_degree;
DROP INDEX IF EXISTS idx_advocates_experience_first_name;
```
