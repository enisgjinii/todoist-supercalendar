import { useQuery } from "@tanstack/react-query";

interface NotionDatabase {
  id: string;
  title: Array<{
    type: string;
    text: {
      content: string;
      link: null | string;
    };
    plain_text: string;
  }>;
  properties: Record<string, any>;
  created_time: string;
  last_edited_time: string;
  url: string;
  object: 'database';
}

const fetchNotionDatabases = async (): Promise<NotionDatabase[]> => {
  try {
    console.log("[Notion Client] Fetching databases...");
    const response = await fetch(`http://localhost:3001/api/notion/search`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data || !data.results) {
      throw new Error('Invalid response format from server');
    }

    // Filter only database objects
    const databases = data.results.filter((item: any) => item.object === 'database');
    console.log("[Notion Client] Databases fetched successfully:", databases);
    return databases;
  } catch (error) {
    console.error("[Notion Client] Error:", error);
    throw error;
  }
};

export function useNotionDatabases() {
  return useQuery({
    queryKey: ["notionDatabases"],
    queryFn: fetchNotionDatabases,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}