
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

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: defaultHeaders(token),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to update task status: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error toggling task:", error);
    throw error;
  }
}

interface ToggleTaskParams {
  token: string;
  taskId: string;
  completed: boolean; // whether we are closing or reopening the task
}

/**
 * Hook for toggling a task's completion status.
 */
export function useToggleTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ token, taskId, completed }: ToggleTaskParams) =>
      toggleTaskCompletion(token, taskId, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task status updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update task status");
      console.error("Task toggle error:", error);
    },
  });
}
