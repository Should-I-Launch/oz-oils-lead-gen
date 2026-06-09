/**
 * Health API calls.
 * Example of how to structure API call functions.
 */

import { apiFetch } from "@/lib/api/client";

export type HealthResponse = {
  status: string;
  database?: string;
};

export type ServiceInfoResponse = {
  service: string;
  status: string;
};

export function fetchHealth(): Promise<HealthResponse> {
  return apiFetch<HealthResponse>("/health");
}

export function fetchServiceInfo(): Promise<ServiceInfoResponse> {
  return apiFetch<ServiceInfoResponse>("/");
}
