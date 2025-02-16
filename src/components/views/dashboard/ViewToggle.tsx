
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Calendar } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ViewToggleProps {
  viewOption: "dashboard" | "calendar"
  setViewOption: (view: "dashboard" | "calendar") => void
}

export const ViewToggle = ({ viewOption, setViewOption }: ViewToggleProps) => {
  return (
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
  )
}
