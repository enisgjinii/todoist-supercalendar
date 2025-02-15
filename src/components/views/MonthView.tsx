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
import { Edit, Search } from "lucide-react"
import { toast } from "sonner"
import { CalendarControls } from "./calendar/CalendarControls"
import { EventDialog } from "./calendar/EventDialog"
import { calendarStyles } from "./calendar/styles"
import { getCalendarOptions } from "./calendar/calendarConfig"

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

  const completedTasks = filteredTasks.filter(t => t.is_completed)

  useEffect(() => {
    if (tasks) {
      const events = tasks
        .filter(t => t.due)
        .map(task => ({
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

  const totalTasks = filteredTasks.length
  const overdueCount = overdueTasks.length
  const completedCount = completedTasks.length

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 space-y-6">
      <Card className="p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-2xl font-bold">Ultimate Todoist Dashboard</h2>
          <div className="flex gap-2">
            <Button variant={viewOption === "dashboard" ? "secondary" : "outline"} onClick={() => setViewOption("dashboard")}>
              Dashboard View
            </Button>
            <Button variant={viewOption === "calendar" ? "secondary" : "outline"} onClick={() => setViewOption("calendar")}>
              Calendar View
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="pl-8 pr-2 py-1 border rounded w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="border rounded px-2 py-1"
            value={priorityFilter || ""}
            onChange={(e) => {
              const val = e.target.value
              setPriorityFilter(val ? parseInt(val) : null)
            }}
          >
            <option value="">All Priorities</option>
            <option value="1">Priority 1</option>
            <option value="2">Priority 2</option>
            <option value="3">Priority 3</option>
            <option value="4">Priority 4</option>
          </select>
          <Button variant="outline" onClick={() => setShowOverdue(!showOverdue)}>
            {showOverdue ? "Hide Overdue" : "Show Overdue"}
          </Button>
        </div>
        <div className="flex gap-4 flex-wrap">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Total Tasks</span>
            <span className="font-bold text-xl">{totalTasks}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Overdue</span>
            <span className="font-bold text-xl">{overdueCount}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Completed</span>
            <span className="font-bold text-xl">{completedCount}</span>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="w-full">
            <h3 className="text-lg font-bold mb-2">Projects</h3>
            <ScrollArea className="h-20">
              <div className="flex gap-4">
                <Button variant={selectedProjectId === null ? "secondary" : "outline"} onClick={() => setSelectedProjectId(null)}>
                  All Projects
                </Button>
                {projects && projects.map((p: any) => (
                  <Button
                    key={p.id}
                    variant={selectedProjectId === p.id ? "secondary" : "outline"}
                    onClick={() => setSelectedProjectId(p.id)}
                  >
                    {p.name}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
          {labels && labels.length > 0 && (
            <div className="w-full">
              <h3 className="text-lg font-bold mb-2">Labels</h3>
              <div className="flex gap-2 flex-wrap">
                {labels.map((label: any) => (
                  <Badge key={label.id} variant="outline">{label.name}</Badge>
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
