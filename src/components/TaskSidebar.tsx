//// filepath: /c:/Users/egjin/Desktop/todoist-supercalendar/src/components/TaskSidebar.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Hash, Folder, LayoutGrid, List, Database } from "lucide-react";
// ...other imports

interface TaskSidebarProps {
  projects: any[];
  isLoading: boolean;
  onProjectSelect?: (projectId: string | null) => void;
  selectedProjectId?: string | null;
  // New props for view switching
  onViewChange?: (view: string) => void;
  selectedView?: string;
}

export const TaskSidebar = ({ 
  projects, 
  isLoading, 
  onProjectSelect,
  selectedProjectId,
  onViewChange,
  selectedView
}: TaskSidebarProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  return (
    <motion.div 
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 280, opacity: 1 }}
      className="border-r border-zinc-200 bg-white/50 backdrop-blur-sm flex flex-col h-screen"
    >
      <div className="p-4 border-b border-zinc-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Projects</h2>
          <div className="flex gap-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === 'grid' ? "bg-zinc-100" : "hover:bg-zinc-50"
              )}
            >
              <LayoutGrid size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === 'list' ? "bg-zinc-100" : "hover:bg-zinc-50"
              )}
            >
              <List size={16} />
            </motion.button>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            onProjectSelect?.(null);
            onViewChange?.("tasks");
          }}
          className={cn(
            "w-full p-2 rounded-md text-left flex items-center gap-2 mb-2 transition-colors",
            !selectedProjectId && selectedView === "tasks" ? "bg-zinc-100" : "hover:bg-zinc-50"
          )}
        >
          <Hash size={16} />
          <span className="text-sm">All Tasks</span>
        </motion.button>
        {/* New Link for Notion Databases */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onViewChange?.("notion-databases")}
          className={cn(
            "w-full p-2 rounded-md text-left flex items-center gap-2 mb-2 transition-colors",
            selectedView === "notion-databases" ? "bg-zinc-100" : "hover:bg-zinc-50"
          )}
        >
          <Database size={16} />
          <span className="text-sm">Notion Databases</span>
        </motion.button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 w-full bg-zinc-200 rounded" />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "gap-3",
              viewMode === 'grid' ? "grid grid-cols-2" : "space-y-2"
            )}
          >
            {projects?.map((project) => (
              <motion.button
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onProjectSelect?.(project.id);
                  onViewChange?.("tasks");
                }}
                className={cn(
                  "w-full p-3 rounded-lg border transition-all",
                  selectedProjectId === project.id 
                    ? "border-zinc-300 bg-zinc-50" 
                    : "border-zinc-200 hover:border-zinc-300"
                )}
              >
                <div className="flex items-start gap-3">
                  <Folder size={16} className="mt-0.5 text-zinc-500" />
                  <div className="flex-1 text-left">
                    <h3 className="text-sm font-medium text-zinc-900 mb-1">
                      {project.name}
                    </h3>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};