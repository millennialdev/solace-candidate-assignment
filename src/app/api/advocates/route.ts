import { NextRequest } from "next/server";
import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";
import { like, or, sql, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";

  // Validate pagination parameters
  const validPage = Math.max(1, page);
  const validLimit = Math.min(Math.max(1, limit), 100); // Cap at 100
  const offset = (validPage - 1) * validLimit;

  try {
    // Try to use database if DATABASE_URL is set
    if (process.env.DATABASE_URL) {
      try {
        let query = db.select().from(advocates);

        // Apply search filter if provided
        if (search) {
          const searchLower = `%${search.toLowerCase()}%`;
          query = query.where(
            or(
              sql`LOWER(${advocates.firstName}) LIKE ${searchLower}`,
              sql`LOWER(${advocates.lastName}) LIKE ${searchLower}`,
              sql`LOWER(${advocates.city}) LIKE ${searchLower}`,
              sql`LOWER(${advocates.degree}) LIKE ${searchLower}`,
              sql`CAST(${advocates.yearsOfExperience} AS TEXT) LIKE ${searchLower}`
            )
          ) as typeof query;
        }

        // Get total count for pagination
        const totalQuery = db
          .select({ count: sql<number>`COUNT(*)` })
          .from(advocates);

        if (search) {
          const searchLower = `%${search.toLowerCase()}%`;
          totalQuery.where(
            or(
              sql`LOWER(${advocates.firstName}) LIKE ${searchLower}`,
              sql`LOWER(${advocates.lastName}) LIKE ${searchLower}`,
              sql`LOWER(${advocates.city}) LIKE ${searchLower}`,
              sql`LOWER(${advocates.degree}) LIKE ${searchLower}`,
              sql`CAST(${advocates.yearsOfExperience} AS TEXT) LIKE ${searchLower}`
            )
          );
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
        console.warn("Database error, falling back to mock data:", dbError);
      }
    }

    // Fallback to mock data
    let filteredData = advocateData;

    // Apply search filter to mock data
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = advocateData.filter((advocate) => {
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
    console.error("Error fetching advocates:", error);
    return Response.json(
      { error: "Failed to fetch advocates" },
      { status: 500 }
    );
  }
}
