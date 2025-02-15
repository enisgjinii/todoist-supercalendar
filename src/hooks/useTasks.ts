// src/hooks/useTasks.ts
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface TodoistTask {
  id: string;
  content: string;
  description: string;
  project_id: string;
  section_id: string | null;
  parent_id: string | null;
  order: number;
  priority: 1 | 2 | 3 | 4;
  due: {
    date: string;
    string: string;
    datetime: string | null;
    timezone: string | null;
  } | null;
  url: string;
  comment_count: number;
  created_at: string;
  labels: string[];
  assignee_id: string | null;
  is_completed: boolean;
}

function defaultHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "X-Request-Id": Math.random().toString(36).substring(7),
  };
}

// Fetches all active tasks. If a projectId is specified, only tasks from that project are returned.
async function fetchTasks(token: string, projectId?: string | null): Promise<TodoistTask[]> {
  if (!token) return [];

  const baseUrl = "https://api.todoist.com/rest/v2/tasks";
  let url = baseUrl;
  if (projectId) {
    url += `?project_id=${projectId}`;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: defaultHeaders(token),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.statusText}`);
    }

    return response.json() as Promise<TodoistTask[]>;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    toast.error("Failed to fetch tasks.");
    throw error;
  }
}

// React Query hook
export function useTasks(token: string, projectId?: string | null) {
  return useQuery({
    queryKey: ["tasks", token, projectId],
    queryFn: () => fetchTasks(token, projectId),
    enabled: !!token,
    retry: 2,
    staleTime: 30000,
  });
}
