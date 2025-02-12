
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Circle,
  MessageSquare,
  AlertCircle,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useTaskComments, useToggleTask } from "@/hooks/useTasks";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface TaskListProps {
  date: Date;
  tasks: any[];
  isLoading: boolean;
  projects: any[];
  token: string;
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

const TaskItem = ({ task, project, token }: { task: any; project: any; token: string }) => {
  const [expanded, setExpanded] = useState(false);
  const { data: comments, isLoading: commentsLoading } = useTaskComments(token, task.id);
  const toggleTask = useToggleTask();

  const handleToggle = () => {
    toggleTask.mutate({ token, taskId: task.id, completed: !task.is_completed });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "p-4 rounded-lg border transition-all hover:shadow-md",
        task.is_completed ? "bg-zinc-50 border-zinc-200" : "border-zinc-200 hover:border-zinc-300"
      )}
    >
      <div className="flex items-start gap-4">
        <button 
          className="mt-1"
          onClick={handleToggle}
          disabled={toggleTask.isPending}
        >
          {task.is_completed ? (
            <CheckCircle2 size={20} className="text-green-500" />
          ) : (
            <Circle size={20} className="text-zinc-300 hover:text-zinc-400" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className={cn(
                "font-medium break-words",
                task.is_completed ? "text-zinc-500 line-through" : "text-zinc-900"
              )}>
                {task.content}
              </h3>
              {task.description && (
                <p className="text-sm text-zinc-500 mt-1">{task.description}</p>
              )}
            </div>
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
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {project?.name}
            </Badge>
            {task.labels?.map((label: string) => (
              <Badge key={label} variant="outline" className="text-xs">
                {label}
              </Badge>
            ))}
            {task.comment_count > 0 && (
              <Badge variant="secondary" className="text-xs">
                <MessageSquare size={12} className="mr-1" />
                {task.comment_count}
              </Badge>
            )}
            {task.parent_id && (
              <Badge variant="secondary" className="text-xs">
                <AlertCircle size={12} className="mr-1" />
                Subtask
              </Badge>
            )}
          </div>
          {task.url && (
            <a 
              href={task.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline mt-2 inline-flex items-center gap-1"
            >
              <LinkIcon size={12} />
              View in Todoist
            </a>
          )}
          {task.comment_count > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4 mr-1" />
              ) : (
                <ChevronDown className="h-4 w-4 mr-1" />
              )}
              {expanded ? "Hide" : "Show"} Comments
            </Button>
          )}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <ScrollArea className="h-[200px] rounded-md border p-4">
                  {commentsLoading ? (
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : comments?.length ? (
                    <div className="space-y-4">
                      {comments.map((comment: any) => (
                        <div key={comment.id} className="text-sm">
                          <div className="font-medium">{comment.content}</div>
                          <div className="text-xs text-zinc-500 mt-1">
                            {format(new Date(comment.posted_at), "MMM d, yyyy HH:mm")}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-500">No comments yet</p>
                  )}
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export const TaskList = ({ date, tasks, isLoading, projects, token }: TaskListProps) => {
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
              <TaskItem 
                key={task.id} 
                task={task} 
                project={projects.find((p) => p.id === task.project_id)}
                token={token}
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
