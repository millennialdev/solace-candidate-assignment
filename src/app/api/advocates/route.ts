import { NextRequest } from "next/server";
import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";
import { or, sql, and, asc, desc, inArray } from "drizzle-orm";
import { logger } from "../../../utils/logger";
import {
  validatePagination,
  validateSearchQuery,
  validateArray,
  validateYearsRange,
  validateSortField,
  validateSortDirection,
} from "../../../utils/validation";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Validate and sanitize inputs
  const { page: validPage, limit: validLimit } = validatePagination({
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
  });
  const search = validateSearchQuery(searchParams.get("search"));
  const offset = (validPage - 1) * validLimit;

  // Validate filter parameters
  const cities = validateArray(searchParams.get("cities"));
  const degrees = validateArray(searchParams.get("degrees"));
  const specialties = validateArray(searchParams.get("specialties"));
  const minExperience = validateYearsRange(searchParams.get("minExperience")) ?? 0;
  const maxExperience = validateYearsRange(searchParams.get("maxExperience")) ?? 100;

  // Validate sort parameters
  const sortField = validateSortField(searchParams.get("sortField"));
  const sortDirection = validateSortDirection(searchParams.get("sortDirection"));

  try {
    // Try to use database if DATABASE_URL is set
    if (process.env.DATABASE_URL) {
      try {
        // Build WHERE conditions
        const conditions = [];

        // Apply search filter if provided
        if (search) {
          const searchLower = `%${search.toLowerCase()}%`;
          conditions.push(
            or(
              sql`LOWER(${advocates.firstName}) LIKE ${searchLower}`,
              sql`LOWER(${advocates.lastName}) LIKE ${searchLower}`,
              sql`LOWER(${advocates.city}) LIKE ${searchLower}`,
              sql`LOWER(${advocates.degree}) LIKE ${searchLower}`,
              sql`CAST(${advocates.yearsOfExperience} AS TEXT) LIKE ${searchLower}`
            )!
          );
        }

        // Apply city filter
        if (cities.length > 0) {
          conditions.push(inArray(advocates.city, cities));
        }

        // Apply degree filter
        if (degrees.length > 0) {
          conditions.push(inArray(advocates.degree, degrees));
        }

        // Apply experience range filter
        conditions.push(
          sql`${advocates.yearsOfExperience} >= ${minExperience} AND ${advocates.yearsOfExperience} <= ${maxExperience}`
        );

        // Apply specialty filter (JSONB array contains)
        if (specialties.length > 0) {
          const specialtyConditions = specialties.map((specialty) =>
            sql`${advocates.specialties}::jsonb @> ${JSON.stringify([specialty])}::jsonb`
          );
          conditions.push(or(...specialtyConditions)!);
        }

        // Build the main query
        let query = db.select().from(advocates);
        if (conditions.length > 0) {
          query = query.where(and(...conditions)!) as typeof query;
        }

        // Apply sorting
        const sortColumn = advocates[sortField];
        query = query.orderBy(
          sortDirection === "asc" ? asc(sortColumn) : desc(sortColumn)
        ) as typeof query;

        // Get total count with same filters
        let totalQuery = db
          .select({ count: sql<number>`COUNT(*)` })
          .from(advocates);
        if (conditions.length > 0) {
          totalQuery = totalQuery.where(and(...conditions)!) as typeof totalQuery;
        }

        const [countResult] = await totalQuery;
        const total = Number(countResult.count);

        // Apply pagination
        const data = await query.limit(validLimit).offset(offset);

        return Response.json(
          {
            data,
            pagination: {
              page: validPage,
              limit: validLimit,
              total,
              totalPages: Math.ceil(total / validLimit),
            },
          },
          {
            headers: {
              "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
            },
          }
        );
      } catch (dbError) {
        // Database error - fall back to mock data
        logger.warn("Database error, falling back to mock data", { error: dbError });
      }
    }

    // Fallback to mock data
    let filteredData = advocateData;

    // Apply search filter to mock data
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = filteredData.filter((advocate) => {
        return (
          advocate.firstName.toLowerCase().includes(searchLower) ||
          advocate.lastName.toLowerCase().includes(searchLower) ||
          advocate.city.toLowerCase().includes(searchLower) ||
          advocate.degree.toLowerCase().includes(searchLower) ||
          advocate.specialties.some((specialty) =>
            specialty.toLowerCase().includes(searchLower)
          ) ||
          advocate.yearsOfExperience.toString().includes(searchLower)
        );
      });
    }

    // Apply city filter
    if (cities.length > 0) {
      filteredData = filteredData.filter((advocate) =>
        cities.includes(advocate.city)
      );
    }

    // Apply degree filter
    if (degrees.length > 0) {
      filteredData = filteredData.filter((advocate) =>
        degrees.includes(advocate.degree)
      );
    }

    // Apply specialty filter
    if (specialties.length > 0) {
      filteredData = filteredData.filter((advocate) =>
        advocate.specialties.some((specialty) => specialties.includes(specialty))
      );
    }

    // Apply experience range filter
    filteredData = filteredData.filter(
      (advocate) =>
        advocate.yearsOfExperience >= minExperience &&
        advocate.yearsOfExperience <= maxExperience
    );

    // Apply sorting
    filteredData.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    const total = filteredData.length;
    const paginatedData = filteredData.slice(offset, offset + validLimit);

    return Response.json(
      {
        data: paginatedData,
        pagination: {
          page: validPage,
          limit: validLimit,
          total,
          totalPages: Math.ceil(total / validLimit),
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        },
      }
    );
  } catch (error) {
    logger.error("Error fetching advocates", { error });
    return Response.json(
      { error: "Failed to fetch advocates" },
      { status: 500 }
    );
  }
}
