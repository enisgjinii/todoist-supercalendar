import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const defaultHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
  "X-Request-Id": Math.random().toString(36).substring(7),
});

/**
 * Toggle task completion (close or reopen).
 */
async function toggleTaskCompletion(token: string, taskId: string, completed: boolean) {
  // If "completed" is true, we call the close endpoint.
  // Otherwise, we call reopen.
  const endpoint = completed
    ? `https://api.todoist.com/rest/v2/tasks/${taskId}/close`
    : `https://api.todoist.com/rest/v2/tasks/${taskId}/reopen`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: defaultHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`Failed to update task status: ${response.statusText}`);
  }
}

interface ToggleTaskParams {
  token: string;
  taskId: string;
  completed: boolean; // whether we are closing or reopening the task
}

/**
 * Hook for toggling a task’s completion status.
 */
export function useToggleTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ token, taskId, completed }: ToggleTaskParams) =>
      toggleTaskCompletion(token, taskId, completed),
    onSuccess: () => {
      // Refresh the tasks query so the UI updates
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task status updated.");
    },
    onError: () => {
      toast.error("Failed to update task status.");
    },
  });
}
