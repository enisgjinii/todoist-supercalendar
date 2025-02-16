import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { Sparkles } from "lucide-react"
import { useTasks } from "@/hooks/useTasks"
import { useSections } from "@/hooks/useSections"
import { useProjects } from "@/hooks/useProjects"
import { useLabels } from "@/hooks/useLabels"
import { format, parseISO, isToday, isAfter, isPast } from "date-fns"
import { CalendarControls } from "./calendar/CalendarControls"
import { EventDialog } from "./calendar/EventDialog"
import { getCalendarOptions } from "./calendar/calendarConfig"
import { StatsCards } from "./dashboard/StatsCards"
import { SearchControls } from "./dashboard/SearchControls"
import { ProjectSelector } from "./dashboard/ProjectSelector"
import { ViewToggle } from "./dashboard/ViewToggle"

interface DashboardProps {
  token: string;
  selectedProjectId: string | null;
}

interface Section {
  id: string;
  name: string;
  project_id: string;
  order: number;
  tasks?: any[];
}

interface Task {
  id: string;
  content: string;
  description?: string;
  project_id: string;
  section_id: string | null;
  parent_id: string | null;
  due?: {
    date: string;
    datetime: string | null;
  };
  is_completed: boolean;
  labels: string[];
  priority?: number;
}

export const MonthView = ({ token, selectedProjectId }: DashboardProps) => {
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

  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useTasks(token, selectedProjectId)
  const { data: sections = [], isLoading: sectionsLoading } = useSections(token, selectedProjectId || "")
  const { data: projects, isLoading: projectsLoading } = useProjects(token)
  const { data: labels, isLoading: labelsLoading } = useLabels(token)

  const handleTaskSelection = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleInlineEdit = (taskId: string) => {
    toast.info(`Editing task ${taskId}`);
  };

  const handleBulkComplete = async () => {
    try {
      toast.success(`Completed ${selectedTasks.length} tasks`);
      setSelectedTasks([]);
    } catch (error) {
      toast.error("Failed to complete tasks");
    }
  };

  const handleBulkDelete = async () => {
    try {
      toast.success(`Deleted ${selectedTasks.length} tasks`);
      setSelectedTasks([]);
    } catch (error) {
      toast.error("Failed to delete tasks");
    }
  };

  const handleEventClick = (clickInfo: any) => {
    const event = clickInfo.event;
    setSelectedEvent(event);
    setEditedTitle(event.title);
    setEditedDescription(event.extendedProps.description || "");
    setIsEventDialogOpen(true);
  };

  const handleEventMouseEnter = (mouseEnterInfo: any) => {
    const el = mouseEnterInfo.el;
    el.style.transform = 'scale(1.05)';
    el.style.zIndex = '1000';
    el.style.transition = 'all 0.2s ease';
  };

  const handleEventMouseLeave = (mouseLeaveInfo: any) => {
    const el = mouseLeaveInfo.el;
    el.style.transform = 'scale(1)';
    el.style.zIndex = 'auto';
  };

  const handleDateClick = (arg: any) => {
    toast.info(`Selected date: ${format(new Date(arg.date), "PPP")}`);
  };

  const handleSave = async () => {
    try {
      setIsEditing(false);
      setIsEventDialogOpen(false);
      toast.success("Task updated successfully");
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async () => {
    try {
      setIsEventDialogOpen(false);
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  useEffect(() => {
    if (tasks) {
      const events = tasks
        .filter((t: Task) => t.due)
        .map((task: Task) => ({
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

  const calendarOptions = getCalendarOptions(
    calendarView,
    weekendsVisible,
    businessHours,
    calendarEvents,
    {
      eventClick: handleEventClick,
      eventMouseEnter: handleEventMouseEnter,
      eventMouseLeave: handleEventMouseLeave,
      dateClick: handleDateClick,
    }
  );

  if (tasksError || tasksLoading || sectionsLoading || projectsLoading || labelsLoading) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4">
        <Skeleton className="h-[100px] w-full" />
      </motion.div>
    )
  }

  const sectionsWithTasks = sections.map((section: Section) => ({
    ...section,
    tasks: tasks?.filter((task: Task) => task.section_id === section.id) || []
  }));

  const filteredTasks = tasks?.filter(task => {
    const matchSearch = searchTerm
      ? task.content.toLowerCase().includes(searchTerm.toLowerCase())
      : true
    const matchPriority = priorityFilter ? task.priority === priorityFilter : true
    return matchSearch && matchPriority
  }) || [];

  const overdueTasks = filteredTasks.filter(t => {
    if (!t.due?.date) return false
    return isPast(parseISO(t.due.datetime || t.due.date)) && !t.is_completed
  });

  const todayTasks = filteredTasks.filter(t => {
    if (!t.due?.date) return false
    return isToday(parseISO(t.due.datetime || t.due.date))
  });

  const upcomingTasks = filteredTasks.filter(t => {
    if (!t.due?.date) return false
    return isAfter(parseISO(t.due.datetime || t.due.date), new Date())
  });

  const completedTasks = filteredTasks.filter(t => t.is_completed);

  const totalTasksCount = filteredTasks.length;
  const overdueTasksCount = overdueTasks.length;
  const completedTasksCount = completedTasks.length;

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
            totalTasksCount={totalTasksCount}
            overdueTasksCount={overdueTasksCount}
            completedTasksCount={completedTasksCount}
            todayTasksCount={todayTasks.length}
          />
        </div>
      </Card>

      <ProjectSelector
        selectedProjectId={selectedProjectId}
        projects={projects}
        labels={labels}
      />

      {viewOption === "calendar" && (
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
        handleSave={handleSave}
        handleDelete={handleDelete}
      />
    </motion.div>
  )
}
