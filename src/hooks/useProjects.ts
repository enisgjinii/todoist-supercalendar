
import { useQuery } from "@tanstack/react-query";

async function fetchProjects(token: string) {
  if (!token) return [];
  
  const response = await fetch("https://api.todoist.com/rest/v2/projects", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  
  return response.json();
}

export function useProjects(token: string) {
  return useQuery({
    queryKey: ["projects", token],
    queryFn: () => fetchProjects(token),
    enabled: !!token,
  });
}
