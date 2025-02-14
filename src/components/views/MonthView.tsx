
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface MonthViewProps {
  token: string;
  selectedProjectId: string | null;
}

export const MonthView = ({ token, selectedProjectId }: MonthViewProps) => {
  const [selected, setSelected] = useState<Date>(new Date());
  const [monthTasks, setMonthTasks] = useState<Record<string, any[]>>({});
  
  const { data: tasks, isLoading } = useTasks(token, selected, selectedProjectId);

  useEffect(() => {
    if (tasks) {
      const tasksByDate: Record<string, any[]> = {};
      tasks.forEach(task => {
        if (task.due?.date) {
          const date = task.due.date;
          if (!tasksByDate[date]) {
            tasksByDate[date] = [];
          }
          tasksByDate[date].push(task);
        }
      });
      setMonthTasks(tasksByDate);
    }
  }, [tasks]);

  const renderDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const dayTasks = monthTasks[dateStr] || [];
    
    if (dayTasks.length === 0) return null;
    
    return (
      <div className="absolute bottom-0 left-0 right-0">
        <Badge 
          variant="secondary" 
          className="text-xs w-full rounded-none rounded-b-md"
        >
          {dayTasks.length} tasks
        </Badge>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="p-4"
    >
      <div className="grid gap-4 md:grid-cols-[1fr,300px]">
        <Card className="p-4">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(date) => date && setSelected(date)}
            className="rounded-md border"
            components={{
              DayContent: (props) => (
                <div className="relative w-full h-full min-h-[70px] p-2">
                  <div>{props.date.getDate()}</div>
                  {isLoading ? (
                    <Skeleton className="h-4 w-16 absolute bottom-1" />
                  ) : (
                    renderDay(props.date)
                  )}
                </div>
              ),
            }}
          />
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold mb-4">
            {format(selected, "MMMM d, yyyy")}
          </h3>
          <ScrollArea className="h-[500px]">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : monthTasks[format(selected, "yyyy-MM-dd")]?.map((task) => (
              <div
                key={task.id}
                className="p-2 mb-2 rounded-md border bg-zinc-50 dark:bg-zinc-900"
              >
                <div className="text-sm font-medium">{task.content}</div>
                {task.due?.datetime && (
                  <div className="text-xs text-zinc-500 mt-1">
                    {format(new Date(task.due.datetime), "HH:mm")}
                  </div>
                )}
              </div>
            ))}
          </ScrollArea>
        </Card>
      </div>
    </motion.div>
  );
};
