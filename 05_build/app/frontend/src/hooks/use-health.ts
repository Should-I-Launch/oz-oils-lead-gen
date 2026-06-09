/**
 * Example TanStack Query hook for the health endpoint.
 *
 * Convention:
 * - Hooks live in `src/hooks/` and are prefixed with `use`
 * - Each hook wraps one or more API calls from `src/lib/api/`
 * - Return the full useQuery result for flexibility in components
 */

import { useQuery } from "@tanstack/react-query";

import { fetchHealth, type HealthResponse } from "@/lib/api/health";

export function useHealth() {
  return useQuery<HealthResponse, Error>({
    queryKey: ["health"],
    queryFn: fetchHealth,
  });
}
