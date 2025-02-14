import { useQuery } from "@tanstack/react-query";

const defaultHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
  "X-Request-Id": Math.random().toString(36).substring(7),
});

async function fetchLabels(token: string) {
  if (!token) return [];

  const response = await fetch("https://api.todoist.com/rest/v2/labels", {
    method: "GET",
    headers: defaultHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch labels: ${response.statusText}`);
  }

  return response.json();
}

export function useLabels(token: string) {
  return useQuery({
    queryKey: ["labels", token],
    queryFn: () => fetchLabels(token),
    enabled: !!token,
    retry: 2,
    staleTime: 60000, // Cache labels for 60 seconds
  });
}
