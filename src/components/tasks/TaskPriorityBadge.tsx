
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const getPriorityColor = (priority: number) => {
  switch (priority) {
    case 4:
      return "text-red-500 dark:text-red-400";
    case 3:
      return "text-orange-500 dark:text-orange-400";
    case 2:
      return "text-yellow-500 dark:text-yellow-400";
    default:
      return "text-blue-500 dark:text-blue-400";
  }
};

export const TaskPriorityBadge = ({ priority }: { priority: number }) => (
  <Badge variant="outline" className={cn("text-xs", getPriorityColor(priority))}>
    P{priority}
  </Badge>
);
