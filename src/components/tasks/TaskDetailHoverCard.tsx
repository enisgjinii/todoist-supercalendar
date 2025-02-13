
import { format } from "date-fns";
import { Calendar, List, Star } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

interface TaskDetailHoverCardProps {
  task: any;
  project: any;
  isCompleted: boolean;
}

export const TaskDetailHoverCard = ({ task, project, isCompleted }: TaskDetailHoverCardProps) => (
  <HoverCard>
    <HoverCardTrigger asChild>
      <h3 className={cn(
        "font-medium break-words cursor-help",
        isCompleted ? "text-zinc-500 dark:text-zinc-400 line-through" : "text-zinc-900 dark:text-zinc-100"
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
);
