
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TaskSidebarProps {
  projects: any[];
  isLoading: boolean;
}

export const TaskSidebar = ({ projects, isLoading }: TaskSidebarProps) => {
  return (
    <div className="w-64 border-r border-zinc-200 bg-white/50 backdrop-blur-sm">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Projects</h2>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              {projects?.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-2 rounded-md hover:bg-zinc-100 cursor-pointer transition-colors"
                >
                  <span className="text-sm text-zinc-700">{project.name}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};
