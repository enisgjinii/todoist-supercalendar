
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Folder, Hash, LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TaskSidebarProps {
  projects: any[];
  isLoading: boolean;
  onProjectSelect?: (projectId: string | null) => void;
  selectedProjectId?: string | null;
}

export const TaskSidebar = ({ 
  projects, 
  isLoading, 
  onProjectSelect,
  selectedProjectId 
}: TaskSidebarProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  return (
    <motion.div 
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 280, opacity: 1 }}
      className="border-r border-zinc-200 dark:border-zinc-800 glass-morphism flex flex-col h-screen"
    >
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold font-poppins">Projects</h2>
          <div className="flex gap-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === 'grid' ? "bg-zinc-100 dark:bg-zinc-800" : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
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
                viewMode === 'list' ? "bg-zinc-100 dark:bg-zinc-800" : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              )}
            >
              <List size={16} />
            </motion.button>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onProjectSelect?.(null)}
          className={cn(
            "w-full p-2 rounded-md text-left flex items-center gap-2 mb-2 transition-colors font-poppins",
            !selectedProjectId ? "bg-zinc-100 dark:bg-zinc-800" : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
          )}
        >
          <Hash size={16} />
          <span className="text-sm">All Tasks</span>
        </motion.button>
      </div>
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full dark:bg-zinc-800" />
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
                onClick={() => onProjectSelect?.(project.id)}
                className={cn(
                  "w-full p-3 rounded-lg border transition-all font-poppins",
                  selectedProjectId === project.id 
                    ? "border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800" 
                    : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                )}
              >
                <div className="flex items-start gap-3">
                  <Folder size={16} className="mt-0.5 text-zinc-500" />
                  <div className="flex-1 text-left">
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                      {project.name}
                    </h3>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {project.view_style || 'List'}
                      </Badge>
                      {project.is_favorite && (
                        <Badge variant="secondary" className="text-xs">
                          Favorite
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </ScrollArea>
    </motion.div>
  );
};
