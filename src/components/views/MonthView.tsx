import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { useTasks } from "@/hooks/useTasks";
import { format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Clock, 
  AlertCircle, 
  Calendar,
  Flag,
  CheckCircle,
  Plus,
  Filter,
  BarChart2
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface MonthViewProps {
  token: string;
  selectedProjectId: string | null;
}

export const MonthView = ({ token, selectedProjectId }: MonthViewProps) => {
  const [selected, setSelected] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [view, setView] = useState('dayGridMonth');
  const { data: tasks, isLoading, error } = useTasks(token, selected, selectedProjectId);
  const [events, setEvents] = useState<any[]>([]);

  const stats = {
    total: events.length,
    completed: events.filter(e => e.extendedProps.completed).length,
    highPriority: events.filter(e => e.extendedProps.priority === 4).length,
    upcoming: events.filter(e => new Date(e.start) > new Date()).length
  };

  useEffect(() => {
    if (tasks) {
      const calendarEvents = tasks.map(task => ({
        id: task.id,
        title: task.content,
        start: task.due?.datetime || task.due?.date,
        end: task.due?.datetime || task.due?.date,
        allDay: !task.due?.datetime,
        extendedProps: {
          description: task.description,
          priority: task.priority,
          project_id: task.project_id,
          completed: task.completed,
          labels: task.labels
        },
        className: `priority-${task.priority}${task.completed ? ' completed' : ''}`,
      }));
      setEvents(calendarEvents);
    }
  }, [tasks]);

  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event);
    setIsEventDialogOpen(true);
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4"
      >
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load tasks. Please check your connection and try again.
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="p-4 space-y-4"
    >
      <style>{`
        .fc .fc-toolbar {
          background-color: white;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.2s;
        }

        .fc-day-today {
          border: 2px solid #6b46c1;
          border-radius: 8px;
        }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 flex items-center gap-3">
          <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20">
            <Calendar className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Tasks</p>
            <h3 className="text-2xl font-bold">{stats.total}</h3>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Completed</p>
            <h3 className="text-2xl font-bold">{stats.completed}</h3>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20">
            <Flag className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">High Priority</p>
            <h3 className="text-2xl font-bold">{stats.highPriority}</h3>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Upcoming</p>
            <h3 className="text-2xl font-bold">{stats.upcoming}</h3>
          </div>
        </Card>
      </div>

      <Card className="p-6 backdrop-blur-sm bg-white/90 dark:bg-zinc-900/90 border-none shadow-xl">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[650px] w-full" />
          </div>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView={view}
            events={events}
            eventClick={handleEventClick}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            }}
            nowIndicator={true}
            dayMaxEvents={true}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false,
              hour12: false
            }}
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
            height="650px"
          />
        )}
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
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
          <Button variant="outline" onClick={() => {}}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </Card>

      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Due Date</p>
              <p className="font-medium">
                {selectedEvent?.start ? format(parseISO(selectedEvent.start), 'PPP') : 'No date set'}
              </p>
            </div>
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Priority</p>
              <div className="flex items-center gap-2">
                <Flag className={`h-4 w-4 ${
                  selectedEvent?.extendedProps.priority === 4 ? 'text-red-500' :
                  selectedEvent?.extendedProps.priority === 3 ? 'text-orange-500' :
                  selectedEvent?.extendedProps.priority === 2 ? 'text-yellow-500' :
                  'text-blue-500'
                }`} />
                <span>Priority {selectedEvent?.extendedProps.priority}</span>
              </div>
            </div>
            {selectedEvent?.extendedProps.description && (
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Description</p>
                <p>{selectedEvent.extendedProps.description}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};