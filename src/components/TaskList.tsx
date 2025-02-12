
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar as CalendarIcon, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskListProps {
  date: Date;
  tasks: any[];
  isLoading: boolean;
  projects: any[];
}

const getPriorityColor = (priority: number) => {
  switch (priority) {
    case 4:
      return "text-red-500";
    case 3:
      return "text-orange-500";
    case 2:
      return "text-yellow-500";
    default:
      return "text-blue-500";
  }
};

const getRelativeDate = (date: Date) => {
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d, yyyy");
};

export const TaskList = ({ date, tasks, isLoading, projects }: TaskListProps) => {
  return (
    <Card className="flex-1 p-6 backdrop-blur-sm bg-white/90">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900">
            {getRelativeDate(date)}
          </h2>
          <p className="text-sm text-zinc-500">
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
                className={cn(
                  "p-4 rounded-lg border transition-all hover:shadow-md",
                  task.completed ? "bg-zinc-50 border-zinc-200" : "border-zinc-200 hover:border-zinc-300"
                )}
              >
                <div className="flex items-start gap-4">
                  <button className="mt-1">
                    {task.completed ? (
                      <CheckCircle2 size={20} className="text-green-500" />
                    ) : (
                      <Circle size={20} className="text-zinc-300 hover:text-zinc-400" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className={cn(
                        "font-medium break-words",
                        task.completed ? "text-zinc-500 line-through" : "text-zinc-900"
                      )}>
                        {task.content}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="outline" className={cn(
                          "text-xs",
                          getPriorityColor(task.priority)
                        )}>
                          P{task.priority}
                        </Badge>
                        {task.due?.datetime && (
                          <Badge variant="secondary" className="text-xs">
                            <Clock size={12} className="mr-1" />
                            {format(new Date(task.due.datetime), "HH:mm")}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {projects.find((p) => p.id === task.project_id)?.name}
                      </Badge>
                      {task.labels?.map((label: string) => (
                        <Badge key={label} variant="outline" className="text-xs">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <p className="text-zinc-500 mb-2">No tasks for this day</p>
            <p className="text-sm text-zinc-400">
              Time to relax or plan ahead!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
