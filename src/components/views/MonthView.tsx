
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useTasks } from "@/hooks/useTasks";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface MonthViewProps {
  token: string;
  selectedProjectId: string | null;
}

export const MonthView = ({ token, selectedProjectId }: MonthViewProps) => {
  const [selected, setSelected] = useState<Date>(new Date());
  const { data: tasks, isLoading, error } = useTasks(token, selected, selectedProjectId);
  const [events, setEvents] = useState<any[]>([]);

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
        },
        className: `priority-${task.priority}`,
      }));
      setEvents(calendarEvents);
    }
  }, [tasks]);

  const handleEventClick = (info: any) => {
    toast(info.event.title, {
      description: info.event.extendedProps.description || "No description available",
    });
  };

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load tasks. Please check your connection and try again.
          </AlertDescription>
        </Alert>
      </div>
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
        .fc {
          --fc-border-color: rgb(244 244 245);
          --fc-today-bg-color: rgb(244 244 245 / 0.5);
          --fc-event-border-color: transparent;
          --fc-event-text-color: rgb(24 24 27);
          height: 650px;
        }
        
        .dark .fc {
          --fc-border-color: rgb(39 39 42);
          --fc-today-bg-color: rgb(39 39 42 / 0.3);
          --fc-event-text-color: rgb(250 250 250);
          --fc-page-bg-color: transparent;
          color: rgb(250 250 250);
        }

        .fc .fc-button {
          @apply bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 border-none font-medium text-sm px-4 py-2 rounded-md transition-colors;
        }

        .fc .fc-button:hover {
          @apply bg-zinc-700 dark:bg-zinc-200;
        }

        .fc .fc-button-primary:not(:disabled).fc-button-active,
        .fc .fc-button-primary:not(:disabled):active {
          @apply bg-zinc-800 dark:bg-zinc-300;
        }

        .priority-4 {
          @apply bg-red-100 dark:bg-red-500/30 border-l-4 border-red-500;
        }
        
        .priority-3 {
          @apply bg-orange-100 dark:bg-orange-500/30 border-l-4 border-orange-500;
        }
        
        .priority-2 {
          @apply bg-yellow-100 dark:bg-yellow-500/30 border-l-4 border-yellow-500;
        }
        
        .priority-1 {
          @apply bg-blue-100 dark:bg-blue-500/30 border-l-4 border-blue-500;
        }

        .fc-event {
          @apply cursor-pointer rounded-md shadow-sm transition-transform hover:scale-[1.02];
        }

        .fc-daygrid-event {
          @apply py-1 px-2 mb-1;
        }

        .fc-toolbar-title {
          @apply font-heading;
        }
      `}</style>
      
      <Card className="p-6 backdrop-blur-sm bg-white/90 dark:bg-zinc-900/90">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[650px] w-full" />
          </div>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={handleEventClick}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
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
          />
        )}
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <Badge variant="outline" className="gap-2 border-red-500">
            <Clock className="h-3 w-3 text-red-500" />
            Priority 1
          </Badge>
          <Badge variant="outline" className="gap-2 border-orange-500">
            <Clock className="h-3 w-3 text-orange-500" />
            Priority 2
          </Badge>
          <Badge variant="outline" className="gap-2 border-yellow-500">
            <Clock className="h-3 w-3 text-yellow-500" />
            Priority 3
          </Badge>
          <Badge variant="outline" className="gap-2 border-blue-500">
            <Clock className="h-3 w-3 text-blue-500" />
            Priority 4
          </Badge>
        </div>
      </Card>
    </motion.div>
  );
};
