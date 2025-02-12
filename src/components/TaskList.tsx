
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface TaskListProps {
  date: Date;
  tasks: any[];
  isLoading: boolean;
  projects: any[];
}

export const TaskList = ({ date, tasks, isLoading, projects }: TaskListProps) => {
  return (
    <Card className="flex-1 p-6 backdrop-blur-sm bg-white/90">
      <h2 className="text-xl font-semibold mb-4">
        Tasks for {format(date, "MMMM d, yyyy")}
      </h2>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : tasks?.length ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 rounded-lg border border-zinc-200 hover:border-zinc-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-zinc-900">{task.content}</h3>
                    <p className="text-sm text-zinc-500">
                      {projects.find((p) => p.id === task.project_id)?.name}
                    </p>
                  </div>
                  <span className="text-sm text-zinc-500">
                    {format(new Date(task.due?.date || date), "HH:mm")}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-zinc-500 text-center py-8">No tasks for this day</p>
        )}
      </AnimatePresence>
    </Card>
  );
};
