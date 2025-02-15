
import { useQuery } from "@tanstack/react-query";

export function useUserProfile(token: string) {
  return useQuery({
    queryKey: ["userProfile", token],
    queryFn: async () => {
      const response = await fetch("https://api.todoist.com/rest/v2/user", {
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
