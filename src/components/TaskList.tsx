
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
  ChevronUp,
  Tag,
  Calendar,
  Star,
  Bookmark,
  Flag,
  MoreHorizontal,
  ArrowRight,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useTaskComments, useToggleTask, useLabels } from "@/hooks/useTasks";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      return "text-red-500 dark:text-red-400";
    case 3:
      return "text-orange-500 dark:text-orange-400";
    case 2:
      return "text-yellow-500 dark:text-yellow-400";
    default:
      return "text-blue-500 dark:text-blue-400";
  }
};

const getRelativeDate = (date: Date) => {
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d, yyyy");
};

interface SubTaskListProps {
  parentId: string;
  project: any;
  token: string;
  tasks: any[];
}

const SubTaskList = ({ tasks, parentId, project, token }: SubTaskListProps) => {
  const subtasks = tasks.filter(task => task.parent_id === parentId);
  
  if (!subtasks.length) return null;
  
  return (
    <div className="ml-8 mt-4 space-y-4 border-l-2 border-zinc-200 dark:border-zinc-700 pl-4">
      {subtasks.map(task => (
        <TaskItem 
          key={task.id} 
          task={task} 
          project={project}
          token={token}
          isSubtask
          tasks={tasks}
        />
      ))}
    </div>
  );
};

interface TaskItemProps {
  task: any;
  project: any;
  token: string;
  isSubtask?: boolean;
  tasks: any[];
}

const TaskItem = ({ task, project, token, isSubtask = false, tasks }: TaskItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const { data: comments, isLoading: commentsLoading } = useTaskComments(token, task.id);
  const { data: labels } = useLabels(token);
  const toggleTaskMutation = useToggleTask();

  const handleToggle = () => {
    toggleTaskMutation.mutate({ 
      token, 
      taskId: task.id, 
      completed: !task.is_completed 
    });
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
          disabled={toggleTaskMutation.isPending}
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
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <h3 className={cn(
                      "font-medium break-words cursor-help",
                      task.is_completed ? "text-zinc-500 dark:text-zinc-400 line-through" : "text-zinc-900 dark:text-zinc-100"
                    )}>
                      {task.content}
                    </h3>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">Created {format(new Date(task.created_at), "PPP")}</span>
                      </div>
                      {project && (
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          <span className="text-sm">Project: {project.name}</span>
                        </div>
                      )}
                      {task.description && (
                        <div className="flex items-center gap-2">
                          <List className="h-4 w-4" />
                          <span className="text-sm">Has description</span>
                        </div>
                      )}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
              {task.description && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{task.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Flag className="h-4 w-4 mr-2" />
                    Set Priority
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bookmark className="h-4 w-4 mr-2" />
                    Add to Favorites
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Copy Link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                          <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                            {format(new Date(comment.posted_at), "PPP p")}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">No comments yet</p>
                  )}
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>
          {!isSubtask && (
            <SubTaskList 
              tasks={tasks}
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
                tasks={tasks}
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
