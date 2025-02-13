
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon } from "lucide-react";
import { TaskItem } from "./tasks/TaskItem";
import { getRelativeDate } from "./tasks/utils";

interface TaskListProps {
  date: Date;
  tasks: any[];
  isLoading: boolean;
  projects: any[];
  token: string;
}

export const TaskList = ({ date, tasks, isLoading, projects, token }: TaskListProps) => {
  // Filter out subtasks from the main list
  const mainTasks = tasks.filter(task => !task.parent_id);

  return (
    <Card className="flex-1 p-6 backdrop-blur-sm bg-white/90 dark:bg-zinc-900/90">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            {getRelativeDate(date)}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {format(date, "EEEE")} · {tasks.length} tasks
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <CalendarIcon size={14} className="mr-1" />
          {format(date, "MMMM yyyy")}
        </Badge>
      </div>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : mainTasks?.length ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {mainTasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task}
                project={projects.find((p) => p.id === task.project_id)}
                token={token}
                allTasks={tasks}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <p className="text-zinc-500 dark:text-zinc-400 mb-2">No tasks for this day</p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
              Time to relax or plan ahead!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
