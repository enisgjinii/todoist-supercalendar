
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

async function fetchTasks(token: string, date: Date, projectId: string | null) {
  if (!token) return [];
  
  const formattedDate = format(date, "yyyy-MM-dd");
  const filter = projectId 
    ? `due:${formattedDate} & #${projectId}`
    : `due:${formattedDate}`;
    
  const response = await fetch(`https://api.todoist.com/rest/v2/tasks?filter=${encodeURIComponent(filter)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  
  return response.json() as Promise<TodoistTask[]>;
}

async function toggleTaskCompletion(token: string, taskId: string, completed: boolean) {
  const endpoint = completed 
    ? `https://api.todoist.com/rest/v2/tasks/${taskId}/close`
    : `https://api.todoist.com/rest/v2/tasks/${taskId}/reopen`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to update task status");
  }
}

async function fetchTaskComments(token: string, taskId: string) {
  const response = await fetch(`https://api.todoist.com/rest/v2/comments?task_id=${taskId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }

  return response.json();
}

async function fetchLabels(token: string) {
  const response = await fetch("https://api.todoist.com/rest/v2/labels", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch labels");
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

export function useTaskComments(token: string, taskId: string) {
  return useQuery({
    queryKey: ["comments", taskId],
    queryFn: () => fetchTaskComments(token, taskId),
    enabled: !!token && !!taskId,
  });
}

export function useLabels(token: string) {
  return useQuery({
    queryKey: ["labels", token],
    queryFn: () => fetchLabels(token),
    enabled: !!token,
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
