-- Migration: Add indexes for performance optimization
-- Created: 2025-11-22
-- Purpose: Add indexes to optimize filtering, sorting, and searching queries
--          for scaling to hundreds of thousands of advocates

-- Individual field indexes for common filters
CREATE INDEX IF NOT EXISTS idx_advocates_city ON advocates(city);
CREATE INDEX IF NOT EXISTS idx_advocates_degree ON advocates(degree);
CREATE INDEX IF NOT EXISTS idx_advocates_experience ON advocates(years_of_experience);

-- Indexes for sorting and searching
CREATE INDEX IF NOT EXISTS idx_advocates_first_name ON advocates(first_name);
CREATE INDEX IF NOT EXISTS idx_advocates_last_name ON advocates(last_name);

-- GIN index for JSONB array (specialties) for efficient containment queries
-- This enables fast lookups like: WHERE specialties @> '["Depression"]'::jsonb
CREATE INDEX IF NOT EXISTS idx_advocates_specialties ON advocates USING gin(specialties);

-- Composite indexes for common query patterns
-- Useful when filtering by both city and degree
CREATE INDEX IF NOT EXISTS idx_advocates_city_degree ON advocates(city, degree);

-- Useful for experience range queries combined with name sorting
CREATE INDEX IF NOT EXISTS idx_advocates_experience_first_name ON advocates(years_of_experience, first_name);

-- Performance impact:
-- - These indexes will significantly speed up queries with WHERE clauses on these fields
-- - Sorting by firstName, lastName, city, degree, or yearsOfExperience will be faster
-- - JSONB containment queries on specialties will use the GIN index instead of sequential scans
-- - Composite indexes help when multiple filters are used together

-- Trade-offs:
-- - Indexes add storage overhead (typically 20-30% of table size)
-- - INSERT/UPDATE operations will be slightly slower due to index maintenance
-- - For read-heavy workloads (like this advocate directory), the trade-off is worth it
