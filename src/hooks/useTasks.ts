
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

async function fetchTasks(token: string, projectId?: string | null): Promise<TodoistTask[]> {
  if (!token) {
    throw new Error("Authentication token is required");
  }

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
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as TodoistTask[];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    if (error instanceof Error && error.message.includes("401")) {
      toast.error("Authentication failed. Please check your API token.");
    } else if (error instanceof Error && error.message.includes("429")) {
      toast.error("Too many requests. Please try again later.");
    } else {
      toast.error("Failed to fetch tasks. Please try again.");
    }
    throw error;
  }
}

export function useTasks(token: string, projectId?: string | null) {
  return useQuery({
    queryKey: ["tasks", token, projectId],
    queryFn: () => fetchTasks(token, projectId),
    enabled: !!token,
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error instanceof Error && error.message.includes("401")) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    staleTime: 30000,
    meta: {
      onSettled: (_data: TodoistTask[] | undefined, error: Error | null) => {
        if (error) {
          if (error.message.includes("Network") || error.message.includes("ECONNREFUSED")) {
            toast.error("Network error. Please check your internet connection.");
          }
          console.error("Tasks query error:", error);
        }
      }
    }
  });
}
