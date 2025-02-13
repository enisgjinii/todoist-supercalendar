
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTaskComments, useToggleTask, useLabels } from "@/hooks/useTasks";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { 
  CheckCircle2, 
  Circle,
  MessageSquare,
  AlertCircle,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
  Tag,
  Star,
  Clock,
  ArrowRight,
} from "lucide-react";
import { TaskPriorityBadge } from "./TaskPriorityBadge";
import { TaskDetailHoverCard } from "./TaskDetailHoverCard";
import { TaskActionsDropdown } from "./TaskActionsDropdown";
import { TaskComments } from "./TaskComments";
import { SubTaskList } from "./SubTaskList";

interface TaskItemProps {
  task: any;
  project: any;
  token: string;
  isSubtask?: boolean;
  allTasks: any[];
}

export const TaskItem = ({ task, project, token, isSubtask = false, allTasks }: TaskItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const { data: comments, isLoading: commentsLoading } = useTaskComments(token, task.id);
  const { data: labels } = useLabels(token);
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
        "p-4 rounded-lg border transition-all hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/20",
        task.is_completed ? "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700" : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
      )}
    >
      <div className="flex items-start gap-4">
        <button 
          className="mt-1"
          onClick={handleToggle}
          disabled={toggleTask.isPending}
        >
          {task.is_completed ? (
            <CheckCircle2 size={20} className="text-green-500 dark:text-green-400" />
          ) : (
            <Circle size={20} className="text-zinc-300 dark:text-zinc-600 hover:text-zinc-400 dark:hover:text-zinc-500" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {isSubtask && (
                  <ArrowRight size={16} className="text-zinc-400 dark:text-zinc-500" />
                )}
                <TaskDetailHoverCard 
                  task={task} 
                  project={project}
                  isCompleted={task.is_completed}
                />
              </div>
              {task.description && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{task.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <TaskPriorityBadge priority={task.priority} />
              {task.due?.datetime && (
                <Badge variant="secondary" className="text-xs">
                  <Clock size={12} className="mr-1" />
                  {format(new Date(task.due.datetime), "HH:mm")}
                </Badge>
              )}
              <TaskActionsDropdown />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {project && (
              <Badge variant="secondary" className="text-xs">
                <Star size={12} className="mr-1" />
                {project.name}
              </Badge>
            )}
            {task.labels?.map((labelId: string) => {
              const label = labels?.find((l: any) => l.name === labelId);
              return (
                <Badge key={labelId} variant="outline" className="text-xs flex items-center gap-1">
                  <Tag size={10} />
                  {label?.name || labelId}
                </Badge>
              );
            })}
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
              className="text-xs text-blue-500 dark:text-blue-400 hover:underline mt-2 inline-flex items-center gap-1"
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
          <TaskComments 
            comments={comments || []}
            isLoading={commentsLoading}
            expanded={expanded}
          />
          {!isSubtask && (
            <SubTaskList 
              tasks={allTasks}
              parentId={task.id}
              project={project}
              token={token}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};
