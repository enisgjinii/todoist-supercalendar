
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
    <Card className="flex-1 p-8 backdrop-blur-xl bg-white/95 dark:bg-zinc-900/95 border-none shadow-xl rounded-xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-50 dark:to-zinc-300 bg-clip-text text-transparent">
            {getRelativeDate(date)}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {format(date, "EEEE")} · {tasks.length} tasks
          </p>
        </div>
        <Badge variant="secondary" className="text-sm px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
          <CalendarIcon size={14} className="mr-2" />
          {format(date, "MMMM yyyy")}
        </Badge>
      </div>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
        ) : mainTasks?.length ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
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
            className="text-center py-16"
          >
            <div className="bg-gradient-to-b from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 p-8 rounded-2xl shadow-inner">
              <p className="text-zinc-600 dark:text-zinc-300 mb-3 text-lg">No tasks for this day</p>
              <p className="text-sm text-zinc-400 dark:text-zinc-500">
                Time to relax or plan ahead!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
