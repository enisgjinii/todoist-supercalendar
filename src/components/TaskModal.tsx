
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Clock, 
  Calendar,
  CheckCircle2,
  Circle,
  MessageSquare,
  AlertCircle,
  Link as LinkIcon,
  Flag,
  Tag,
  Bookmark,
  Star,
} from "lucide-react"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"

interface TaskModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  task: any
  project?: any
  labels?: any[]
  onComplete?: () => void
}

export const TaskModal = ({
  isOpen,
  onOpenChange,
  task,
  project,
  labels,
  onComplete,
}: TaskModalProps) => {
  if (!task) return null

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 4: return "text-red-500 dark:text-red-400"
      case 3: return "text-orange-500 dark:text-orange-400"
      case 2: return "text-yellow-500 dark:text-yellow-400"
      default: return "text-blue-500 dark:text-blue-400"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 bg-white dark:bg-zinc-900">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start gap-4">
            <button onClick={onComplete}>
              {task.is_completed ? (
                <CheckCircle2 size={24} className="text-green-500 dark:text-green-400" />
              ) : (
                <Circle size={24} className="text-zinc-300 dark:text-zinc-600 hover:text-zinc-400 dark:hover:text-zinc-500" />
              )}
            </button>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold mb-2">
                {task.content}
              </DialogTitle>
              {task.description && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {task.description}
                </p>
              )}
            </div>
            <Badge className={getPriorityColor(task.priority)}>
              P{task.priority}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="p-6 h-[400px]">
          <div className="space-y-6">
            <div className="grid gap-4">
              {project && (
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm font-medium">Project:</span>
                  <Badge variant="secondary">{project.name}</Badge>
                </div>
              )}

              {task.due && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm font-medium">Due:</span>
                  <span className="text-sm">
                    {format(new Date(task.due.datetime || task.due.date), "PPP")}
                    {task.due.datetime && (
                      <span className="ml-2">
                        at {format(new Date(task.due.datetime), "HH:mm")}
                      </span>
                    )}
                  </span>
                </div>
              )}

              {task.labels?.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm font-medium">Labels:</span>
                  <div className="flex flex-wrap gap-2">
                    {task.labels.map((labelId: string) => {
                      const label = labels?.find((l: any) => l.name === labelId)
                      return (
                        <Badge key={labelId} variant="outline">
                          {label?.name || labelId}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )}

              {task.comment_count > 0 && (
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm font-medium">Comments:</span>
                  <Badge variant="secondary">{task.comment_count}</Badge>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium">Created:</span>
                <span className="text-sm">
                  {format(new Date(task.created_at), "PPP")}
                </span>
              </div>
            </div>

            {task.url && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(task.url, "_blank")}
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                Open in Todoist
              </Button>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
