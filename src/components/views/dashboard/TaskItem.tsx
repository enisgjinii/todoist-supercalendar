
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Clock, Calendar, CheckCircle2, Circle, MessageSquare, Target, Link as LinkIcon } from "lucide-react"

interface TaskItemProps {
  task: any
  project: any
  labels: any[]
}

export const TaskItem = ({ task, project, labels }: TaskItemProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="mt-1">
          {task.is_completed ? (
            <CheckCircle2 size={20} className="text-green-500 dark:text-green-400" />
          ) : (
            <Circle size={20} className="text-zinc-300 dark:text-zinc-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <HoverCard>
            <HoverCardTrigger asChild>
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100 break-words cursor-help">
                {task.content}
              </h3>
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Created {format(new Date(task.created_at), "PPP")}</span>
                </div>
                {project && (
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    <span className="text-sm">Project: {project.name}</span>
                  </div>
                )}
              </div>
            </HoverCardContent>
          </HoverCard>

          {task.description && (
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {task.description}
            </p>
          )}

          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {project && (
              <Badge variant="secondary" className="text-xs">
                <Target size={12} className="mr-1" />
                {project.name}
              </Badge>
            )}
            {task.due && (
              <Badge variant="outline" className="text-xs">
                <Clock size={12} className="mr-1" />
                {format(new Date(task.due.datetime || task.due.date), "PPP")}
              </Badge>
            )}
            {task.labels?.map((labelId: string) => {
              const label = labels?.find((l: any) => l.name === labelId);
              return (
                <Badge key={labelId} variant="outline" className="text-xs">
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
          </div>

          {task.url && (
            <a 
              href={task.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-2 text-xs text-blue-500 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              <LinkIcon size={12} />
              View in Todoist
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}
