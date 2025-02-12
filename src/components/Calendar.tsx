
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTasks } from "@/hooks/useTasks";
import { TaskList } from "./TaskList";

interface CalendarProps {
  token: string;
  projects: any[];
}

export const Calendar = ({ token, projects }: CalendarProps) => {
  const [selected, setSelected] = useState<Date>(new Date());
  const { data: tasks, isLoading } = useTasks(token, selected);

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row gap-8">
        <Card className="p-4 backdrop-blur-sm bg-white/90">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(date) => date && setSelected(date)}
            className="p-3"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: cn(
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              ),
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-zinc-500 rounded-md w-9 font-normal text-[0.8rem] dark:text-zinc-400",
              row: "flex w-full mt-2",
              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-zinc-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 dark:[&:has([aria-selected])]:bg-zinc-800",
              day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
              day_selected: "bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white focus:bg-zinc-900 focus:text-white dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50 dark:hover:text-zinc-900 dark:focus:bg-zinc-50 dark:focus:text-zinc-900",
              day_today: "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50",
              day_outside: "text-zinc-500 opacity-50 dark:text-zinc-400",
              day_disabled: "text-zinc-500 opacity-50 dark:text-zinc-400",
              day_range_middle: "aria-selected:bg-zinc-100 aria-selected:text-zinc-900 dark:aria-selected:bg-zinc-800 dark:aria-selected:text-zinc-50",
              day_hidden: "invisible",
            }}
            components={{
              IconLeft: ({ ...props }) => <CalendarIcon className="h-4 w-4" />,
              IconRight: ({ ...props }) => <CalendarIcon className="h-4 w-4" />,
            }}
          />
        </Card>
        <TaskList date={selected} tasks={tasks || []} isLoading={isLoading} projects={projects} />
      </div>
    </div>
  );
};
