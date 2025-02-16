import React from "react";
import { useNotionDatabases } from "@/hooks/useNotionDatabases";
import { Database, AlertCircle, ExternalLink, Clock, Grid } from "lucide-react";
import { motion } from "framer-motion";

interface NotionDatabasesListProps {
  notionToken: string;
}

export const NotionDatabasesList = ({ notionToken }: NotionDatabasesListProps) => {
  const { data, isLoading, error } = useNotionDatabases();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500" />
          <span className="mt-4 text-sm text-gray-500">Loading databases...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 flex items-start gap-3 text-red-500 bg-red-50 rounded-xl border border-red-200"
      >
        <AlertCircle className="w-6 h-6 mt-0.5" />
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Unable to Load Databases</h3>
          <p className="text-sm text-red-600">
            {error instanceof Error ? error.message : 'An unknown error occurred'}
          </p>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-4 text-xs bg-red-100 p-3 rounded-lg overflow-auto">
              {error instanceof Error ? error.stack : JSON.stringify(error, null, 2)}
            </pre>
          )}
        </div>
      </motion.div>
    );
  }

  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-500 space-y-4">
        <Database className="w-12 h-12 text-gray-400" />
        <p className="text-lg font-medium">No Notion databases found</p>
        <p className="text-sm">Connect a database to get started</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 p-6">
      {data.map((database, index) => (
        <motion.div
          key={database.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-all duration-300"
        >
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-blue-50 text-blue-500">
                <Database className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-xl text-gray-900 truncate">
                  {database.title?.[0]?.plain_text || "Untitled Database"}
                </h3>
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>
                    Updated {new Date(database.last_edited_time).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Grid className="w-4 h-4 text-gray-400" />
                <h4 className="font-medium text-gray-700">Properties</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(database.properties || {}).map(([key, value]) => (
                  <div 
                    key={key}
                    className="px-3 py-2 bg-gray-50 rounded-lg text-sm hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium text-gray-700">{key}</span>
                    <span className="block text-xs text-gray-500 mt-1">
                      {(value as any).type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {database.url && (
              <a
                href={database.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 transition-colors"
              >
                <span>Open in Notion</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};