
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
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


const defaultHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
  'X-Request-Id': Math.random().toString(36).substring(7),
});

async function fetchTasks(token: string, date: Date, projectId: string | null) {
  if (!token) return [];
  
  const formattedDate = format(date, "yyyy-MM-dd");
  const filter = projectId 
    ? `due:${formattedDate} & #${projectId}`
    : `due:${formattedDate}`;
    
  try {
    const response = await fetch(`https://api.todoist.com/rest/v2/tasks?filter=${encodeURIComponent(filter)}`, {
      method: 'GET',
      headers: defaultHeaders(token),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.statusText}`);
    }
    
    return response.json() as Promise<TodoistTask[]>;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}

async function toggleTaskCompletion(token: string, taskId: string, completed: boolean) {
  const endpoint = completed 
    ? `https://api.todoist.com/rest/v2/tasks/${taskId}/close`
    : `https://api.todoist.com/rest/v2/tasks/${taskId}/reopen`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: defaultHeaders(token),
    });

    if (!response.ok) {
      throw new Error(`Failed to update task status: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error toggling task:', error);
    throw error;
  }
}

async function fetchTaskComments(token: string, taskId: string) {
  try {
    const response = await fetch(`https://api.todoist.com/rest/v2/comments?task_id=${taskId}`, {
      method: 'GET',
      headers: defaultHeaders(token),
      cache: 'no-cache', // Prevent caching issues
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch comments: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}

async function fetchLabels(token: string) {
  try {
    const response = await fetch("https://api.todoist.com/rest/v2/labels", {
      method: 'GET',
      headers: defaultHeaders(token),
      cache: 'no-cache', // Prevent caching issues
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch labels: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching labels:', error);
    throw error;
  }
}

export function useTasks(token: string, date: Date, projectId: string | null) {
  return useQuery({
    queryKey: ["tasks", token, format(date, "yyyy-MM-dd"), projectId],
    queryFn: () => fetchTasks(token, date, projectId),
    enabled: !!token,
    retry: 2,
    staleTime: 30000, // Data considered fresh for 30 seconds
  });
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

export function useLabels(token: string) {
  return useQuery({
    queryKey: ["labels", token],
    queryFn: () => fetchLabels(token),
    enabled: !!token,
    retry: 2,
    staleTime: 60000, // Labels can be cached longer
  });
}

export function useToggleTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ token, taskId, completed }: { token: string; taskId: string; completed: boolean }) =>
      toggleTaskCompletion(token, taskId, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task status updated");
    },
    onError: () => {
      toast.error("Failed to update task status");
    },
  });
}
