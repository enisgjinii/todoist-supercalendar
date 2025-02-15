
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const defaultHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
  "X-Request-Id": Math.random().toString(36).substring(7),
});

export const useTasks = (token: string, projectId: string | null = null) => {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      const url = projectId
        ? `https://api.todoist.com/rest/v2/tasks?project_id=${projectId}`
        : "https://api.todoist.com/rest/v2/tasks";
      
      const response = await fetch(url, {
        headers: defaultHeaders(token),
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      
      return response.json();
    },
    enabled: !!token,
  });
};

export const useTaskComments = (token: string, taskId: string) => {
  return useQuery({
    queryKey: ["taskComments", taskId],
    queryFn: async () => {
      const response = await fetch(`https://api.todoist.com/rest/v2/comments?task_id=${taskId}`, {
        headers: defaultHeaders(token),
      });
      return response.json();
    },
    enabled: !!token && !!taskId,
  });
};

export const useToggleTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ token, taskId, completed }: { token: string; taskId: string; completed: boolean }) => {
      const endpoint = completed
        ? `https://api.todoist.com/rest/v2/tasks/${taskId}/close`
        : `https://api.todoist.com/rest/v2/tasks/${taskId}/reopen`;
        
      const response = await fetch(endpoint, {
        method: "POST",
        headers: defaultHeaders(token),
      });
      
      if (!response.ok) {
        throw new Error("Failed to toggle task");
      }
      
      return response.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useLabels = (token: string) => {
  return useQuery({
    queryKey: ["labels", token],
    queryFn: async () => {
      const response = await fetch("https://api.todoist.com/rest/v2/labels", {
        headers: defaultHeaders(token),
      });
      return response.json();
    },
    enabled: !!token,
  });
};
