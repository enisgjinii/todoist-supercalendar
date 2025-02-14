import { useQuery } from "@tanstack/react-query";

const defaultHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
  "X-Request-Id": Math.random().toString(36).substring(7),
});

async function fetchTaskComments(token: string, taskId: string) {
  const response = await fetch(
    `https://api.todoist.com/rest/v2/comments?task_id=${taskId}`,
    {
      method: "GET",
      headers: defaultHeaders(token),
      cache: "no-cache",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch comments: ${response.statusText}`);
  }

  return response.json();
}

export function useTaskComments(token: string, taskId: string) {
  return useQuery({
    queryKey: ["comments", taskId],
    queryFn: () => fetchTaskComments(token, taskId),
    enabled: !!token && !!taskId,
    retry: 2,
    staleTime: 30000,
  });
}
