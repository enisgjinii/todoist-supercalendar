import React from "react";
import { useNotionDatabase } from "@/hooks/useNotionDatabases";
import { Database, AlertCircle } from "lucide-react";

interface NotionDatabasesListProps {
  notionToken: string;
}

export const NotionDatabasesList = ({ notionToken }: NotionDatabasesListProps) => {
  const { data, isLoading, error } = useNotionDatabase();

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 flex items-start gap-2 text-red-500 bg-red-50 rounded-lg border border-red-200">
        <AlertCircle className="w-5 h-5 mt-0.5" />
        <div>
          <h3 className="font-medium">Error loading Notion database</h3>
          <p className="text-sm mt-1">{error.toString()}</p>
          <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
        <Database className="w-5 h-5 text-blue-500 mt-1" />
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">
            {data?.title?.[0]?.plain_text || "Untitled Database"}
          </h3>
          <div className="mt-2 text-sm text-gray-500">
            Last edited: {new Date(data?.last_edited_time).toLocaleDateString()}
          </div>
          <div className="mt-4">
            <h4 className="font-medium mb-2">Properties:</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(data?.properties || {}).map(([key, value]) => (
                <div key={key} className="text-sm p-2 bg-gray-50 rounded">
                  <span className="font-medium">{key}:</span>{" "}
                  <span className="text-gray-600">{value.type}</span>
                </div>
              ))}
            </div>
          </div>
          {data?.url && (
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm text-blue-500 hover:text-blue-600"
            >
              Open in Notion →
            </a>
          )}
        </div>
      </div>
    </div>
  );
};