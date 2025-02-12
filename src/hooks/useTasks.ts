
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

async function fetchTasks(token: string, date: Date) {
  if (!token) return [];
  
  const formattedDate = format(date, "yyyy-MM-dd");
  const response = await fetch(`https://api.todoist.com/rest/v2/tasks?filter=due:${formattedDate}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  
  return response.json();
}

export function useTasks(token: string, date: Date) {
  return useQuery({
    queryKey: ["tasks", token, format(date, "yyyy-MM-dd")],
    queryFn: () => fetchTasks(token, date),
    enabled: !!token,
  });
}
