
import { Button } from "@/components/ui/button"
import { Search, CircleSlash2, BellRing } from "lucide-react"

interface SearchControlsProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  priorityFilter: number | null
  setPriorityFilter: (priority: number | null) => void
  showOverdue: boolean
  setShowOverdue: (show: boolean) => void
}

export const SearchControls = ({
  searchTerm,
  setSearchTerm,
  priorityFilter,
  setPriorityFilter,
  showOverdue,
  setShowOverdue,
}: SearchControlsProps) => {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="relative w-full max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search tasks..."
          className="pl-10 pr-4 py-2 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <select
        className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
        value={priorityFilter || ""}
        onChange={(e) => setPriorityFilter(e.target.value ? parseInt(e.target.value) : null)}
      >
        <option value="">All Priorities</option>
        <option value="1">Priority 1</option>
        <option value="2">Priority 2</option>
        <option value="3">Priority 3</option>
        <option value="4">Priority 4</option>
      </select>
      <Button 
        variant="outline" 
        onClick={() => setShowOverdue(!showOverdue)}
        className="gap-2"
      >
        {showOverdue ? <CircleSlash2 className="h-4 w-4" /> : <BellRing className="h-4 w-4" />}
        {showOverdue ? "Hide Overdue" : "Show Overdue"}
      </Button>
    </div>
  )
}
