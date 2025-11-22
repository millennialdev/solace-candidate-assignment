import { useEffect, useState, useCallback } from "react";
import { Advocate, AdvocatesResponse } from "@/types/advocate";
import { logger } from "@/utils/logger";

interface UseAdvocatesResult {
  advocates: Advocate[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAdvocates(): UseAdvocatesResult {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvocates = useCallback(() => {
    logger.debug("Fetching advocates from API");
    setLoading(true);
    setError(null);

    fetch("/api/advocates?limit=100")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch advocates");
        }
        return response.json();
      })
      .then((jsonResponse: AdvocatesResponse) => {
        setAdvocates(jsonResponse.data);
        setLoading(false);
      })
      .catch((err) => {
        logger.error("Error fetching advocates", { error: err });
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchAdvocates();
  }, [fetchAdvocates]);

  return {
    advocates,
    loading,
    error,
    refetch: fetchAdvocates,
  };
}
