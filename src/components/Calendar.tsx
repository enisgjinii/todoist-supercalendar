import { useState, useEffect } from "react";
import { format, addMonths, subMonths } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, AlertCircle, List, Grid, Clock } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { useTasks } from "@/hooks/useTasks";
import { TaskList } from "./TaskList";
import { useToast } from "@/hooks/use-toast";

interface CalendarProps {
  token: string;
  projects: any[];
  selectedProjectId: string | null;
}

export const Calendar = ({ token, projects, selectedProjectId }: CalendarProps) => {
  const [selected, setSelected] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"list" | "grid" | "timeline">("list");
  const [month, setMonth] = useState<Date>(new Date());
  const { data: tasks, isLoading, error } = useTasks(token, selected, selectedProjectId);
  const { toast } = useToast();

  // Error handling effect
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading tasks",
        description: "There was a problem loading your tasks. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setSelected(prev => {
          const newDate = new Date(prev);
          newDate.setDate(prev.getDate() - 1);
          return newDate;
        });
      } else if (e.key === 'ArrowRight') {
        setSelected(prev => {
          const newDate = new Date(prev);
          newDate.setDate(prev.getDate() + 1);
          return newDate;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8"
      >
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load tasks. Please check your connection and try again.
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 space-y-8"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold">
            {format(selected, "MMMM d, yyyy")}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelected(new Date())}
          >
            Today
          </Button>
        </div>
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
          <TabsList>
            <TabsTrigger value="list">
              <List className="h-4 w-4 mr-2" />
              List
            </TabsTrigger>
            <TabsTrigger value="grid">
              <Grid className="h-4 w-4 mr-2" />
              Grid
            </TabsTrigger>
            <TabsTrigger value="timeline">
              <Clock className="h-4 w-4 mr-2" />
              Timeline
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-8 md:grid-cols-[350px,1fr]">
        <Card className="p-4 backdrop-blur-sm bg-white/90 dark:bg-zinc-900/90 shadow-xl border-none">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMonth(subMonths(month, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="font-medium">{format(month, "MMMM yyyy")}</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMonth(addMonths(month, 1))}
            >
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
              nav_button: cn(
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity hidden"
              ),
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
              day_selected: 
                "bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white focus:bg-zinc-900 focus:text-white dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50 dark:hover:text-zinc-900 dark:focus:bg-zinc-50 dark:focus:text-zinc-900",
              day_today: "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50",
              day_outside: "text-zinc-500 opacity-50 dark:text-zinc-400",
              day_disabled: "text-zinc-500 opacity-50 dark:text-zinc-400",
              day_range_middle: "aria-selected:bg-zinc-100 aria-selected:text-zinc-900 dark:aria-selected:bg-zinc-800 dark:aria-selected:text-zinc-50",
              day_hidden: "invisible",
            }}
          />
        </Card>

        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {viewMode === "list" && (
              <TaskList 
                date={selected} 
                tasks={tasks || []} 
                isLoading={isLoading} 
                projects={projects}
                token={token}
              />
            )}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Implement grid view */}
              </div>
            )}
            {viewMode === "timeline" && (
              <div className="relative min-h-[500px]">
                {/* Implement timeline view */}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};