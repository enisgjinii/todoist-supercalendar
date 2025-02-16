
import { Card } from "@/components/ui/card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Target, Clock, CheckCircle, StickyNote } from "lucide-react"

interface StatsCardsProps {
  totalTasksCount: number
  overdueTasksCount: number
  completedTasksCount: number
  todayTasksCount: number
}

export const StatsCards = ({
  totalTasksCount,
  overdueTasksCount,
  completedTasksCount,
  todayTasksCount,
}: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Card className="p-4 cursor-help transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Tasks</p>
                <p className="text-2xl font-bold">{totalTasksCount}</p>
              </div>
            </div>
          </Card>
        </HoverCardTrigger>
        <HoverCardContent>
          All tasks in your selected project view
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger asChild>
          <Card className="p-4 cursor-help transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Clock className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Overdue</p>
                <p className="text-2xl font-bold">{overdueTasksCount}</p>
              </div>
            </div>
          </Card>
        </HoverCardTrigger>
        <HoverCardContent>
          Tasks that are past their due date
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger asChild>
          <Card className="p-4 cursor-help transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Completed</p>
                <p className="text-2xl font-bold">{completedTasksCount}</p>
              </div>
            </div>
          </Card>
        </HoverCardTrigger>
        <HoverCardContent>
          Tasks you've completed
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger asChild>
          <Card className="p-4 cursor-help transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <StickyNote className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Today</p>
                <p className="text-2xl font-bold">{todayTasksCount}</p>
              </div>
            </div>
          </Card>
        </HoverCardTrigger>
        <HoverCardContent>
          Tasks due today
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}
