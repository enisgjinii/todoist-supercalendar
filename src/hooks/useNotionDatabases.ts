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

const NOTION_DATABASE_ID = "2d2371ae2da34c13aff42cc14e006110";

const fetchNotionDatabase = async (): Promise<NotionDatabase> => {
  console.log("[Notion Client] Fetching database...");
  const response = await fetch(`http://localhost:3001/api/notion/database/${NOTION_DATABASE_ID}`);

  if (!response.ok) {
    const errorData = await response.json();
    console.error("[Notion Client] Error fetching database:", {
      status: response.status,
      statusText: response.statusText,
      errorData
    });
    throw new Error(`Failed to fetch database: ${response.statusText}`);
  }

  const data = await response.json();
  console.log("[Notion Client] Database fetched successfully:", data);
  return data;
};

export function useNotionDatabase() {
  return useQuery({
    queryKey: ["notionDatabase", NOTION_DATABASE_ID],
    queryFn: fetchNotionDatabase,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}