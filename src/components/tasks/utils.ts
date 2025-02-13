
import { format, isToday, isTomorrow, isYesterday } from "date-fns";

export const getRelativeDate = (date: Date) => {
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d, yyyy");
};
