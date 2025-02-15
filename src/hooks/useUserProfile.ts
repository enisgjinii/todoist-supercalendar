
import { useQuery } from "@tanstack/react-query";

interface TodoistUser {
  email: string;
  full_name: string;
  avatar_url: string | null;
  is_premium: boolean;
  timezone: string;
  join_date: string;
}

export function useUserProfile(token: string) {
  return useQuery({
    queryKey: ["userProfile", token],
    queryFn: async (): Promise<TodoistUser> => {
      const response = await fetch("https://api.todoist.com/sync/v9/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch user profile");
      return response.json();
    },
    enabled: !!token,
  });
}
