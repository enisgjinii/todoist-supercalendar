
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CalendarControlsProps {
  weekendsVisible: boolean;
  setWeekendsVisible: (visible: boolean) => void;
  businessHours: boolean;
  setBusinessHours: (visible: boolean) => void;
  calendarView: string;
  setCalendarView: (view: string) => void;
}

export const CalendarControls = ({
  weekendsVisible,
  setWeekendsVisible,
  businessHours,
  setBusinessHours,
  calendarView,
  setCalendarView,
}: CalendarControlsProps) => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWeekendsVisible(!weekendsVisible)}
            className={cn(
              "transition-colors",
              weekendsVisible && "bg-primary/10"
            )}
          >
            {weekendsVisible ? "Hide Weekends" : "Show Weekends"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBusinessHours(!businessHours)}
            className={cn(
              "transition-colors",
              businessHours && "bg-primary/10"
            )}
          >
            {businessHours ? "Hide Business Hours" : "Show Business Hours"}
          </Button>
        </div>
        <div className="flex gap-2">
          <select
            className="px-3 py-1 border rounded-md bg-background"
            value={calendarView}
            onChange={(e) => setCalendarView(e.target.value)}
          >
            <option value="dayGridMonth">Month</option>
            <option value="timeGridWeek">Week</option>
            <option value="timeGridDay">Day</option>
            <option value="listWeek">List</option>
          </select>
        </div>
      </div>
    </Card>
  )
}
