import { useCallback, useEffect, useState } from "react";
import { getStats } from "../api/stats.service";
import { DashboardStats } from "../types/dashboard.types";

/**
 * Fetches the role-aware dashboard counts from `GET /api/stats` using the
 * shared REST client (`api/client.ts`), which already handles the access token
 * and the 401 -> refresh -> retry flow.
 */
export const useStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // useCallback keeps the identity stable so it is safe to use both as the
  // effect dependency and as the `refetch` handler passed down to the UI.
  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getStats();
      setStats(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to load dashboard stats")
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
};
