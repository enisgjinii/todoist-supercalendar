import React, { useState, useEffect, useMemo, useCallback } from "react";
import { format, addMonths, subMonths, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, AlertCircle, Search, Download, List, Grid, Clock } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

// Types
interface Task {
  id: string;
  content: string;
  description: string;
  due: { date: string; datetime?: string };
  priority: number;
  project_id: string;
  labels: string[];
}

interface Project {
  id: string;
  name: string;
  color: string;
}

interface CalendarProps {
  token: string;
  projects: Project[];
  selectedProjectId: string | null;
}

// Subcomponents
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
  </div>
);

const CalendarHeader = ({ 
  selected, 
  setSelected, 
  searchTerm, 
  setSearchTerm,
  priority,
  setPriority,
  handleExport,
  viewMode,
  setViewMode 
}: any) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
    <div className="flex items-center gap-4">
      <h2 className="text-2xl font-semibold tracking-tight">{format(selected, "MMMM d, yyyy")}</h2>
      <Button variant="outline" size="sm" onClick={() => setSelected(new Date())}>Today</Button>
    </div>
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-64"
          />
        </div>
        <Select value={priority.toString()} onValueChange={(v) => setPriority(Number(v))}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">All</SelectItem>
            <SelectItem value="4">P1</SelectItem>
            <SelectItem value="3">P2</SelectItem>
            <SelectItem value="2">P3</SelectItem>
            <SelectItem value="1">P4</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="w-full md:w-auto">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            <span className="hidden md:inline">List</span>
          </TabsTrigger>
          <TabsTrigger value="grid" className="flex items-center gap-2">
            <Grid className="h-4 w-4" />
            <span className="hidden md:inline">Grid</span>
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden md:inline">Timeline</span>
          </TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  </div>
);

const TaskCard = ({ task, projects }: { task: Task; projects: Project[] }) => {
  const project = projects.find(p => p.id === task.project_id);
  const priorityColor = {
    4: "destructive",
    3: "warning",
    2: "default",
    1: "secondary"
  }[task.priority] || "default";

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-medium line-clamp-2">{task.content}</h3>
          {task.description && (
            <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>
        {task.due?.datetime && (
          <time className="text-xs text-zinc-500">
            {format(new Date(task.due.datetime), "HH:mm")}
          </time>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <Badge variant={priorityColor as any}>P{task.priority}</Badge>
        {project && (
          <Badge style={{ backgroundColor: project.color }} className="text-white">
            {project.name}
          </Badge>
        )}
        {task.labels?.map(label => (
          <Badge key={label} variant="outline" className="text-xs">
            {label}
          </Badge>
        ))}
      </div>
    </Card>
  );
};

// Main Component
export const Calendar = ({ token, projects, selectedProjectId }: CalendarProps) => {
  // State
  const [selected, setSelected] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"list" | "grid" | "timeline" | "week">("list");
  const [month, setMonth] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [priority, setPriority] = useState<number>(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [weekView, setWeekView] = useState<Date[]>([]);
  const { toast } = useToast();

  // API Call
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://api.todoist.com/rest/v2/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error("Failed to fetch tasks");
      
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      toast({
        title: "Error loading tasks",
        description: "Failed to load tasks from Todoist",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [token, toast]);

  // Effects
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, selected, selectedProjectId]);

  useEffect(() => {
    if (viewMode === "week") {
      const start = startOfWeek(selected);
      const end = endOfWeek(selected);
      setWeekView(eachDayOfInterval({ start, end }));
    }
  }, [selected, viewMode]);

  // Memoized Values
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (!task.due?.date) return false;
      
      const matchesDate = isSameDay(new Date(task.due.date), selected);
      const matchesProject = !selectedProjectId || task.project_id === selectedProjectId;
      const matchesSearch = task.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = priority === 0 || task.priority === priority;
      
      return matchesDate && matchesProject && matchesSearch && matchesPriority;
    });
  }, [tasks, selected, selectedProjectId, searchTerm, priority]);

  // Handlers
  const handleExport = useCallback(() => {
    const exportData = filteredTasks.map(task => ({
      content: task.content,
      due: task.due,
      priority: task.priority,
      project: projects.find(p => p.id === task.project_id)?.name
    }));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `todoist-tasks-${format(selected, "yyyy-MM-dd")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredTasks, projects, selected]);

  if (error) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load Todoist tasks. Please check your connection and try again.</AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto"
    >
      <CalendarHeader
        selected={selected}
        setSelected={setSelected}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        priority={priority}
        setPriority={setPriority}
        handleExport={handleExport}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <div className="grid gap-8 lg:grid-cols-[350px,1fr]">
        <Card className="p-4 backdrop-blur-sm bg-white/90 dark:bg-zinc-900/90 shadow-xl border-none h-fit">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" onClick={() => setMonth(subMonths(month, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="font-medium">{format(month, "MMMM yyyy")}</h3>
            <Button variant="ghost" size="icon" onClick={() => setMonth(addMonths(month, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(date) => date && setSelected(date)}
            month={month}
            onMonthChange={setMonth}
            className="p-3"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "font-heading text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: cn("h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity hidden"),
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-zinc-500 rounded-md w-9 font-normal text-[0.8rem] dark:text-zinc-400",
              row: "flex w-full mt-2",
              cell: "relative text-center text-sm p-0 [&:has([aria-selected])]:bg-zinc-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 dark:[&:has([aria-selected])]:bg-zinc-800",
              day: cn(
                "h-9 w-9 p-0 font-normal",
                "hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500 focus:ring-opacity-50 rounded-md"
              ),
              day_selected: "bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white focus:bg-zinc-900 focus:text-white dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50 dark:hover:text-zinc-900 dark:focus:bg-zinc-50 dark:focus:text-zinc-900",
              day_today: "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50",
              day_outside: "text-zinc-500 opacity-50 dark:text-zinc-400",
              day_disabled: "text-zinc-500 opacity-50 dark:text-zinc-400",
              day_range_middle: "aria-selected:bg-zinc-100 aria-selected:text-zinc-900 dark:aria-selected:bg-zinc-800 dark:aria-selected:text-zinc-50",
              day_hidden: "invisible",
            }}
          />
        </Card>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {viewMode === "list" && (
                  <div className="space-y-2">
                    {filteredTasks.map(task => (
                      <TaskCard key={task.id} task={task} projects={projects} />
                    ))}
                    {filteredTasks.length === 0 && (
                      <div className="text-center py-12 text-zinc-500">
                        <p className="text-lg font-medium">No tasks for this day</p>
                        <p className="text-sm">Select a different date or adjust your filters</p>
                      </div>
                    )}
                  </div>
                )}

                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTasks.map(task => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TaskCard task={task} projects={projects} />
                      </motion.div>
                    ))}
                    {filteredTasks.length === 0 && (
                      <div className="col-span-full text-center py-12 text-zinc-500">
                        <p className="text-lg font-medium">No tasks to display</p>
                        <p className="text-sm">Try adjusting your filters or selecting a different date</p>
                      </div>
                    )}
                  </div>
                )}

                {viewMode === "timeline" && (
                  <div className="space-y-4">
                    <div className="sticky top-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm p-4 rounded-lg z-10">
                      <div className="grid grid-cols-[100px,1fr] gap-4 text-sm font-medium text-zinc-500">
                        <div>Time</div>
                        <div>Task</div>
                      </div>
                    </div>
                    {filteredTasks
                      .sort((a, b) => {
                        const timeA = a.due?.datetime || `${a.due?.date}T00:00:00`;
                        const timeB = b.due?.datetime || `${b.due?.date}T00:00:00`;
                        return new Date(timeA).getTime() - new Date(timeB).getTime();
                      })
                      .map((task, index) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="grid grid-cols-[100px,1fr] gap-4 items-start"
                        >
                          <div className="text-sm text-zinc-500 pt-4">
                            {task.due?.datetime 
                              ? format(new Date(task.due.datetime), "HH:mm")
                              : "All day"}
                          </div>
                          <TaskCard task={task} projects={projects} />
                        </motion.div>
                      ))}
                    {filteredTasks.length === 0 && (
                      <div className="text-center py-12 text-zinc-500">
                        <p className="text-lg font-medium">No scheduled tasks</p>
                        <p className="text-sm">Select a different date to view tasks</p>
                      </div>
                    )}
                  </div>
                )}

                {viewMode === "week" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-7 gap-4">
                      {weekView.map(date => (
                        <motion.div
                          key={date.toISOString()}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="relative"
                        >
                          <Card className="p-4 h-full min-h-[300px]">
                            <div className="sticky top-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm pb-4 z-10">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium">{format(date, "EEE")}</h3>
                                <span className={cn(
                                  "text-sm",
                                  isSameDay(date, new Date()) && "text-blue-500 font-medium"
                                )}>
                                  {format(date, "dd")}
                                </span>
                              </div>
                              <div className="h-px bg-zinc-200 dark:bg-zinc-800" />
                            </div>
                            <div className="space-y-2 mt-2">
                              {tasks
                                .filter(task => task.due?.date && isSameDay(new Date(task.due.date), date))
                                .sort((a, b) => {
                                  const timeA = a.due?.datetime || `${a.due?.date}T00:00:00`;
                                  const timeB = b.due?.datetime || `${b.due?.date}T00:00:00`;
                                  return new Date(timeA).getTime() - new Date(timeB).getTime();
                                })
                                .map(task => (
                                  <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="group"
                                  >
                                    <div className="p-2 rounded-md bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                                      <div className="flex items-start gap-2">
                                        <div className="w-2 h-2 rounded-full mt-1.5" style={{
                                          backgroundColor: projects.find(p => p.id === task.project_id)?.color
                                        }} />
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium truncate">{task.content}</p>
                                          {task.due?.datetime && (
                                            <p className="text-xs text-zinc-500">
                                              {format(new Date(task.due.datetime), "HH:mm")}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
};