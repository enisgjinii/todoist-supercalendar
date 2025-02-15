
import { useQuery } from "@tanstack/react-query";

const defaultHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
  "X-Request-Id": Math.random().toString(36).substring(7),
});

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

export const useToggleTask = (token: string) => {
  return async (taskId: string) => {
    const response = await fetch(`https://api.todoist.com/rest/v2/tasks/${taskId}/close`, {
      method: "POST",
      headers: defaultHeaders(token),
    });
    return response.ok;
  };
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
