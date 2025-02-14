import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Project {
  id: string;
  name: string;
  color: string;
  view_style: string;
  parent_id: string | null;
  child_order: number;
  collapsed: boolean;
}

export function useProjects(token: string) {
  return useQuery({
    queryKey: ["projects", token],
    queryFn: async (): Promise<Project[]> => {
      const response = await axios.get("https://api.todoist.com/rest/v2/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!token,
  });
}