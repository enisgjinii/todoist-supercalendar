import { useQuery } from "@tanstack/react-query";

const defaultHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
  "X-Request-Id": Math.random().toString(36).substring(7),
});

async function fetchProjects(token: string) {
  if (!token) return [];

  const response = await fetch("https://api.todoist.com/rest/v2/projects", {
    method: "GET",
    headers: defaultHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.statusText}`);
  }

  return response.json();
}

export function useProjects(token: string) {
  return useQuery({
    queryKey: ["projects", token],
    queryFn: () => fetchProjects(token),
    enabled: !!token,
    retry: 2,
    staleTime: 60000,
  });
}
