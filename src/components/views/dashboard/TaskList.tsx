
import { motion } from "framer-motion"
import { TaskItem } from "./TaskItem"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, Clock, Calendar } from "lucide-react"

interface TaskListProps {
  title: string
  icon: "overdue" | "today" | "upcoming"
  tasks: any[]
  projects: any[]
  labels: any[]
  onTaskClick: (task: any) => void
}

export const TaskList = ({ title, icon, tasks, projects, labels, onTaskClick }: TaskListProps) => {
  if (tasks.length === 0) return null

  const Icon = {
    overdue: AlertCircle,
    today: Clock,
    upcoming: Calendar
  }[icon]

  const iconColor = {
    overdue: "text-red-500 dark:text-red-400",
    today: "text-purple-500 dark:text-purple-400",
    upcoming: "text-blue-500 dark:text-blue-400"
  }[icon]

  return (
    <div>
      <h3 className={`font-semibold ${iconColor} mb-4 flex items-center gap-2`}>
        <Icon className="h-5 w-5" />
        {title}
      </h3>
      <ScrollArea className={icon === "upcoming" ? "h-[400px]" : undefined}>
        <div className="space-y-4 pr-4">
          {tasks.map((task) => (
            <div key={task.id} onClick={() => onTaskClick(task)} className="cursor-pointer">
              <TaskItem
                task={task}
                project={projects?.find((p) => p.id === task.project_id)}
                labels={labels}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
