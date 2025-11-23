import { useEffect, useState, useCallback } from "react";
import { Advocate, AdvocatesResponse, PaginationInfo } from "@/types/advocate";
import { logger } from "@/utils/logger";

interface UseAdvocatesParams {
  page?: number;
  limit?: number;
  search?: string;
  cities?: string[];
  degrees?: string[];
  specialties?: string[];
  minExperience?: number;
  maxExperience?: number;
  sortField?: string;
  sortDirection?: "asc" | "desc";
}

interface UseAdvocatesResult {
  advocates: Advocate[];
  pagination: PaginationInfo | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAdvocates(params: UseAdvocatesParams = {}): UseAdvocatesResult {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvocates = useCallback(() => {
    // Build query string from params
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.cities && params.cities.length > 0) {
      queryParams.append("cities", params.cities.join(","));
    }
    if (params.degrees && params.degrees.length > 0) {
      queryParams.append("degrees", params.degrees.join(","));
    }
    if (params.specialties && params.specialties.length > 0) {
      queryParams.append("specialties", params.specialties.join(","));
    }
    if (params.minExperience !== undefined) {
      queryParams.append("minExperience", params.minExperience.toString());
    }
    if (params.maxExperience !== undefined) {
      queryParams.append("maxExperience", params.maxExperience.toString());
    }
    if (params.sortField) queryParams.append("sortField", params.sortField);
    if (params.sortDirection) queryParams.append("sortDirection", params.sortDirection);

    const url = `/api/advocates?${queryParams.toString()}`;
    logger.debug("Fetching advocates from API", { url });

    setLoading(true);
    setError(null);

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch advocates");
        }
        return response.json();
      })
      .then((jsonResponse: AdvocatesResponse) => {
        setAdvocates(jsonResponse.data);
        setPagination(jsonResponse.pagination ?? null);
        setLoading(false);
      })
      .catch((err) => {
        logger.error("Error fetching advocates", { error: err });
        setError(err.message);
        setLoading(false);
      });
  }, [
    params.page,
    params.limit,
    params.search,
    params.cities,
    params.degrees,
    params.specialties,
    params.minExperience,
    params.maxExperience,
    params.sortField,
    params.sortDirection,
  ]);

  useEffect(() => {
    fetchAdvocates();
  }, [fetchAdvocates]);

  return {
    advocates,
    pagination,
    loading,
    error,
    refetch: fetchAdvocates,
  };
}
