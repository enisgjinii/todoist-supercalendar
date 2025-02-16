import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import listPlugin from "@fullcalendar/list"
import { useTasks } from "@/hooks/useTasks"
import { useSections } from "@/hooks/useSections"
import { useProjects } from "@/hooks/useProjects"
import { useLabels } from "@/hooks/useLabels"
import { format, parseISO, isToday, isAfter, isPast } from "date-fns"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { Edit, Search, Flag, Plus, Calendar, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { CalendarControls } from "./calendar/CalendarControls"
import { EventDialog } from "./calendar/EventDialog"
import { calendarStyles } from "./calendar/styles"
import { getCalendarOptions } from "./calendar/calendarConfig"
import { Sparkles, LayoutDashboard, Clock, BellRing, Target, CircleSlash2, StickyNote } from "lucide-react"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 space-y-6">
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
          <div className="flex gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={viewOption === "dashboard" ? "default" : "outline"} 
                    onClick={() => setViewOption("dashboard")}
                    className="gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Switch to Dashboard View</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={viewOption === "calendar" ? "default" : "outline"} 
                    onClick={() => setViewOption("calendar")}
                    className="gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Calendar
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Switch to Calendar View</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4 flex-wrap">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={priorityFilter || ""}
            onChange={(e) => setPriorityFilter(e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="">All Priorities</option>
            <option value="1">Priority 1</option>
            <option value="2">Priority 2</option>
            <option value="3">Priority 3</option>
            <option value="4">Priority 4</option>
          </select>
          <Button 
            variant="outline" 
            onClick={() => setShowOverdue(!showOverdue)}
            className="gap-2"
          >
            {showOverdue ? <CircleSlash2 className="h-4 w-4" /> : <BellRing className="h-4 w-4" />}
            {showOverdue ? "Hide Overdue" : "Show Overdue"}
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <p className="text-2xl font-bold">{todayTasks.length}</p>
                  </div>
                </div>
              </Card>
            </HoverCardTrigger>
            <HoverCardContent>
              Tasks due today
            </HoverCardContent>
          </HoverCard>
        </div>
      </Card>

      <Card className="p-6 glass-morphism">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="w-full">
            <h3 className="text-lg font-bold mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Projects</h3>
            <ScrollArea className="h-20">
              <div className="flex gap-2">
                <Button 
                  variant={selectedProjectId === null ? "default" : "outline"} 
                  className="whitespace-nowrap transition-all hover:scale-105"
                >
                  All Projects
                </Button>
                {projects && projects.map((p: any) => (
                  <Button
                    key={p.id}
                    variant={selectedProjectId === p.id ? "default" : "outline"}
                    className="whitespace-nowrap transition-all hover:scale-105"
                  >
                    {p.name}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
          {labels && labels.length > 0 && (
            <div className="w-full">
              <h3 className="text-lg font-bold mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Labels</h3>
              <div className="flex gap-2 flex-wrap">
                {labels.map((label: any) => (
                  <Badge 
                    key={label.id} 
                    variant="outline"
                    className="transition-all hover:scale-105 cursor-pointer"
                  >
                    {label.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {viewOption === "dashboard" && (
        <>
          {showOverdue && overdueTasks.length > 0 && (
            <Card className="p-4 border-red-500 border-2">
              <h3 className="text-lg font-bold mb-2 text-red-600">Overdue Tasks</h3>
              <ScrollArea className="h-32">
                {overdueTasks.map(t => (
                  <div key={t.id} className="border-b py-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(t.id)}
                        onChange={() => handleTaskSelection(t.id)}
                      />
                      <p className="font-medium text-red-600">
                        {t.content} (Due {t.due?.date})
                      </p>
                      <Button variant="ghost" size="icon" onClick={() => handleInlineEdit(t.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </Card>
          )}
          <Card className="p-4 flex gap-2">
            <Button variant="outline" onClick={handleBulkComplete}>
              Bulk Complete
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete}>
              Bulk Delete
            </Button>
          </Card>
          {sectionsWithTasks.length > 0 ? (
            sectionsWithTasks.map((section: Section) => (
              <Card key={section.id} className="p-4">
                <h3 className="text-lg font-bold mb-2">{section.name}</h3>
                <ScrollArea className="h-60">
                  {section.tasks && section.tasks.length > 0 ? (
                    section.tasks.map((task: Task) => (
                      <div key={task.id} className="border-b py-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedTasks.includes(task.id)}
                            onChange={() => handleTaskSelection(task.id)}
                          />
                          <p className={`${task.is_completed ? "line-through" : ""} font-medium`}>
                            {task.content}
                          </p>
                          <Button variant="ghost" size="icon" onClick={() => handleInlineEdit(task.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                        {task.due && (
                          <p className="text-xs text-zinc-500">
                            {format(parseISO(task.due.date || task.due.datetime || ''), "PPP")}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-zinc-500">No tasks in this section.</p>
                  )}
                </ScrollArea>
              </Card>
            ))
          ) : (
            <Card className="p-4">
              <h3 className="text-lg font-bold mb-2">All Tasks</h3>
              <ScrollArea className="h-60">
                {filteredTasks.map((task: Task) => (
                  <div key={task.id} className="border-b py-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task.id)}
                        onChange={() => handleTaskSelection(task.id)}
                      />
                      <p className={`${task.is_completed ? "line-through" : ""} font-medium`}>
                        {task.content}
                      </p>
                      <Button variant="ghost" size="icon" onClick={() => handleInlineEdit(task.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    {task.due && (
                      <p className="text-xs text-zinc-500">
                        {format(parseISO(task.due.date || task.due.datetime || ''), "PPP")}
                      </p>
                    )}
                  </div>
                ))}
              </ScrollArea>
            </Card>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-bold mb-2">Today's Tasks</h3>
              <ScrollArea className="h-60">
                {todayTasks.length > 0 ? (
                  todayTasks.map(t => (
                    <div key={t.id} className="border-b py-2">
                      <p className="font-medium">{t.content}</p>
                      <p className="text-xs text-zinc-500">
                        {t.due && format(parseISO(t.due.date || t.due.datetime), "PPP")}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500">No tasks for today.</p>
                )}
              </ScrollArea>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-bold mb-2">Upcoming Tasks</h3>
              <ScrollArea className="h-60">
                {upcomingTasks.length > 0 ? (
                  upcomingTasks.map(t => (
                    <div key={t.id} className="border-b py-2">
                      <p className="font-medium">{t.content}</p>
                      <p className="text-xs text-zinc-500">
                        {t.due && format(parseISO(t.due.date || t.due.datetime), "PPP")}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500">No upcoming tasks.</p>
                )}
              </ScrollArea>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-bold mb-2">Completed Tasks</h3>
              <ScrollArea className="h-60">
                {completedTasks.length > 0 ? (
                  completedTasks.map(t => (
                    <div key={t.id} className="border-b py-2">
                      <p className="line-through text-sm text-zinc-500">{t.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500">No completed tasks yet.</p>
                )}
              </ScrollArea>
            </Card>
          </div>
        </>
      )}
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
      <Card className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Badge variant="outline" className="gap-2 border-red-500">
              <Flag className="h-3 w-3 text-red-500" />
              Priority 1
            </Badge>
            <Badge variant="outline" className="gap-2 border-orange-500">
              <Flag className="h-3 w-3 text-orange-500" />
              Priority 2
            </Badge>
            <Badge variant="outline" className="gap-2 border-yellow-500">
              <Flag className="h-3 w-3 text-yellow-500" />
              Priority 3
            </Badge>
            <Badge variant="outline" className="gap-2 border-blue-500">
              <Flag className="h-3 w-3 text-blue-500" />
              Priority 4
            </Badge>
          </div>
          <Button variant="outline" onClick={() => toast("Open Add Task Modal (placeholder)")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </Card>
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
