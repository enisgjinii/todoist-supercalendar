
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { Sparkles } from "lucide-react"
import { useTasks } from "@/hooks/useTasks"
import { useSections } from "@/hooks/useSections"
import { useProjects } from "@/hooks/useProjects"
import { useLabels } from "@/hooks/useLabels"
import { parseISO, isToday, isAfter, isPast } from "date-fns"
import { CalendarControls } from "./calendar/CalendarControls"
import { EventDialog } from "./calendar/EventDialog"
import { getCalendarOptions } from "./calendar/calendarConfig"
import { StatsCards } from "./dashboard/StatsCards"
import { SearchControls } from "./dashboard/SearchControls"
import { ProjectSelector } from "./dashboard/ProjectSelector"
import { ViewToggle } from "./dashboard/ViewToggle"
import { TaskList } from "./dashboard/TaskList"
import { TaskModal } from "@/components/TaskModal"
import FullCalendar from '@fullcalendar/react'
import { calendarStyles } from "./calendar/styles"

interface DashboardProps {
  token: string
  selectedProjectId: string | null
}

export const MonthView = ({ token, selectedProjectId: initialProjectId }: DashboardProps) => {
  const [viewOption, setViewOption] = useState<"dashboard" | "calendar">("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<number | null>(null)
  const [showOverdue, setShowOverdue] = useState(true)
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [calendarEvents, setCalendarEvents] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState("")
  const [editedDescription, setEditedDescription] = useState("")
  const [calendarView, setCalendarView] = useState("dayGridMonth")
  const [weekendsVisible, setWeekendsVisible] = useState(true)
  const [businessHours, setBusinessHours] = useState(true)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(initialProjectId)
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  const { data: tasks, isLoading: tasksLoading } = useTasks(token, selectedProjectId)
  const { data: sections = [], isLoading: isLoadingSections } = useSections(token, selectedProjectId || "")
  const { data: projects = [], isLoading: isLoadingProjects } = useProjects(token)
  const { data: labels = [], isLoading: isLoadingLabels } = useLabels(token)

  const handleProjectSelect = (projectId: string | null) => {
    setSelectedProjectId(projectId)
  }

  const handleLabelSelect = (labelId: string) => {
    setSelectedLabels(prev => 
      prev.includes(labelId)
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId]
    )
  }

  const handleTaskClick = (task: any) => {
    setSelectedTask(task)
    setIsTaskModalOpen(true)
  }

  const filteredTasks = tasks?.filter(task => {
    const matchSearch = searchTerm
      ? task.content.toLowerCase().includes(searchTerm.toLowerCase())
      : true
    const matchPriority = priorityFilter 
      ? task.priority === priorityFilter 
      : true
    const matchLabels = selectedLabels.length > 0
      ? task.labels?.some(label => selectedLabels.includes(label))
      : true
    return matchSearch && matchPriority && matchLabels
  }) || []

  const overdueTasks = filteredTasks.filter(t => {
    if (!t.due?.date) return false
    return isPast(parseISO(t.due.datetime || t.due.date)) && !t.is_completed
  })

  const todayTasks = filteredTasks.filter(t => {
    if (!t.due?.date) return false
    return isToday(parseISO(t.due.datetime || t.due.date))
  })

  const upcomingTasks = filteredTasks.filter(t => {
    if (!t.due?.date) return false
    return isAfter(parseISO(t.due.datetime || t.due.date), new Date())
  })

  useEffect(() => {
    if (tasks) {
      const events = tasks
        .filter((t: any) => t.due)
        .map((task: any) => ({
          id: task.id,
          title: task.content,
          start: task.due?.datetime || task.due?.date,
          end: task.due?.datetime || task.due?.date,
          allDay: !task.due?.datetime,
          extendedProps: {
            description: task.description,
            priority: task.priority,
            project_id: task.project_id,
            completed: task.is_completed,
            labels: task.labels,
          },
          className: `priority-${task.priority}${task.is_completed ? " completed" : ""}`
        }))
      setCalendarEvents(events)
    }
  }, [tasks])

  if (tasksLoading || isLoadingSections || isLoadingProjects || isLoadingLabels) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4">
        <Skeleton className="h-[100px] w-full" />
      </motion.div>
    )
  }

  const calendarOptions = getCalendarOptions(
    calendarView,
    weekendsVisible,
    businessHours,
    calendarEvents,
    {
      eventClick: (info) => setSelectedEvent(info.event),
      eventMouseEnter: (info) => {
        info.el.style.transform = 'scale(1.05)'
        info.el.style.zIndex = '1000'
        info.el.style.transition = 'all 0.2s ease'
      },
      eventMouseLeave: (info) => {
        info.el.style.transform = 'scale(1)'
        info.el.style.zIndex = 'auto'
      },
      dateClick: (info) => {
        // Handle date click event
        console.log('Date clicked:', info.date)
      }
    }
  )

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0 }} 
      className="p-4 space-y-6"
    >
      <Card className="p-6 glass-morphism">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Ultimate Todoist Dashboard
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Organize and track your tasks efficiently
              </p>
            </div>
          </div>
          <ViewToggle viewOption={viewOption} setViewOption={setViewOption} />
        </div>

        <div className="mt-6">
          <SearchControls
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            showOverdue={showOverdue}
            setShowOverdue={setShowOverdue}
          />
        </div>

        <div className="mt-6">
          <StatsCards
            totalTasksCount={filteredTasks.length}
            overdueTasksCount={overdueTasks.length}
            completedTasksCount={filteredTasks.filter(t => t.is_completed).length}
            todayTasksCount={todayTasks.length}
          />
        </div>
      </Card>

      <ProjectSelector
        selectedProjectId={selectedProjectId}
        projects={projects}
        labels={labels}
        onProjectSelect={handleProjectSelect}
        selectedLabels={selectedLabels}
        onLabelSelect={handleLabelSelect}
      />

      {viewOption === "dashboard" ? (
        <Card className="p-6">
          <div className="space-y-6">
            {showOverdue && (
              <TaskList
                title="Overdue Tasks"
                icon="overdue"
                tasks={overdueTasks}
                projects={projects}
                labels={labels}
                onTaskClick={handleTaskClick}
              />
            )}

            <TaskList
              title="Today's Tasks"
              icon="today"
              tasks={todayTasks}
              projects={projects}
              labels={labels}
              onTaskClick={handleTaskClick}
            />

            <TaskList
              title="Upcoming Tasks"
              icon="upcoming"
              tasks={upcomingTasks}
              projects={projects}
              labels={labels}
              onTaskClick={handleTaskClick}
            />

            {!overdueTasks.length && !todayTasks.length && !upcomingTasks.length && (
              <div className="text-center py-12">
                <p className="text-zinc-500 dark:text-zinc-400">No tasks found</p>
                <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-2">
                  Try adjusting your filters or create new tasks
                </p>
              </div>
            )}
          </div>
        </Card>
      ) : (
        <>
          <CalendarControls
            weekendsVisible={weekendsVisible}
            setWeekendsVisible={setWeekendsVisible}
            businessHours={businessHours}
            setBusinessHours={setBusinessHours}
            calendarView={calendarView}
            setCalendarView={setCalendarView}
          />

          <Card className="p-6 backdrop-blur-sm bg-white/90 dark:bg-zinc-900/90 border-none shadow-xl">
            <style>{calendarStyles}</style>
            <FullCalendar {...calendarOptions} />
          </Card>
        </>
      )}

      <EventDialog
        isOpen={isEventDialogOpen}
        onOpenChange={setIsEventDialogOpen}
        selectedEvent={selectedEvent}
        isEditing={isEditing}
        editedTitle={editedTitle}
        setEditedTitle={setEditedTitle}
        editedDescription={editedDescription}
        setEditedDescription={setEditedDescription}
        setIsEditing={setIsEditing}
        handleSave={() => {
          setIsEditing(false)
          setIsEventDialogOpen(false)
        }}
        handleDelete={() => setIsEventDialogOpen(false)}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onOpenChange={setIsTaskModalOpen}
        task={selectedTask}
        project={projects?.find((p) => p.id === selectedTask?.project_id)}
        labels={labels}
      />
    </motion.div>
  )
}
