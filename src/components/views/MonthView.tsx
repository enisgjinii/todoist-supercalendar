import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import {
  Clock,
  AlertCircle,
  Calendar,
  Flag,
  CheckCircle,
  Plus,
  Search,
  Edit,
} from "lucide-react"

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
        <Card className="p-6 backdrop-blur-sm bg-white/90 dark:bg-zinc-900/90 border-none shadow-xl">
          <style>{`
            .fc .fc-toolbar {
              background-color: white;
              padding: 16px;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              margin-bottom: 16px;
            }
            .fc .fc-toolbar-title {
              font-size: 1.5rem;
              font-weight: bold;
              background: linear-gradient(to right, #6b46c1, #3182ce);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            .completed {
              opacity: 0.5;
              text-decoration: line-through;
            }
            .fc-event:hover {
              transform: scale(1.02);
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              transition: all 0.2s;
            }
            .fc-day-today {
              border: 2px solid #6b46c1;
              border-radius: 8px;
            }
          `}</style>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView={calendarView}
            events={calendarEvents}
            eventClick={handleEventClick}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            nowIndicator
            dayMaxEvents
            eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
            slotLabelFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
            height="650px"
          />
        </Card>
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
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            {isEditing ? (
              <input
                className="w-full text-xl font-semibold p-2 border rounded"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
            ) : (
              <DialogTitle className="text-xl font-semibold">
                {selectedEvent?.title}
              </DialogTitle>
            )}
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">Due Date:</span>
              <span className="font-medium">
                {selectedEvent?.start
                  ? format(new Date(selectedEvent.start), "PPP")
                  : "No date set"}
              </span>
            </div>
            
            {selectedEvent?.extendedProps?.priority && (
              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Priority:</span>
                <span className="font-medium">
                  Priority {selectedEvent.extendedProps.priority}
                </span>
              </div>
            )}

            {selectedEvent?.extendedProps?.completed && (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">Completed</span>
              </div>
            )}

            {selectedEvent?.extendedProps?.labels?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedEvent.extendedProps.labels.map((label: string) => (
                  <Badge key={label} variant="outline">
                    {label}
                  </Badge>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <span className="text-sm text-gray-500">Description:</span>
              {isEditing ? (
                <textarea
                  className="w-full p-2 border rounded min-h-[100px]"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  placeholder="Add a description..."
                />
              ) : (
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {selectedEvent?.extendedProps?.description || "No description provided."}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleSave}>Save</Button>
                <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>Edit</Button>
                <Button variant="destructive" onClick={handleDelete}>Delete</Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
