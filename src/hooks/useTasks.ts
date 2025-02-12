
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

async function fetchTasks(token: string, date: Date, projectId: string | null) {
  if (!token) return [];
  
  const formattedDate = format(date, "yyyy-MM-dd");
  const filter = projectId 
    ? `due:${formattedDate} & project_id=${projectId}`
    : `due:${formattedDate}`;
    
  const response = await fetch(`https://api.todoist.com/rest/v2/tasks?filter=${encodeURIComponent(filter)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  
  return response.json();
}

export function useTasks(token: string, date: Date, projectId: string | null) {
  return useQuery({
    queryKey: ["tasks", token, format(date, "yyyy-MM-dd"), projectId],
    queryFn: () => fetchTasks(token, date, projectId),
    enabled: !!token,
  });
}
