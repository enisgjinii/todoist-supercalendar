import { useQuery } from "@tanstack/react-query";

const defaultHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
  "X-Request-Id": Math.random().toString(36).substring(7),
});

async function fetchSections(token: string, projectId: string) {
  if (!token || !projectId) return [];

  const response = await fetch(
    `https://api.todoist.com/rest/v2/sections?project_id=${projectId}`,
    {
      method: "GET",
      headers: defaultHeaders(token),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch sections: ${response.statusText}`);
  }

  return response.json();
}

export function useSections(token: string, projectId: string) {
  return useQuery({
    queryKey: ["sections", token, projectId],
    queryFn: () => fetchSections(token, projectId),
    enabled: !!token && !!projectId,
    retry: 2,
    staleTime: 60000,
  });
}
