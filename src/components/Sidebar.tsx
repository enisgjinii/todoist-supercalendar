import React from "react";
import { Button } from "@/components/ui/button";
import { 
  X, CheckSquare, Calendar, Flag, Clock, Tags, 
  Filter, BarChart2, Database, LogOut, Settings,
  Star, List, Inbox, Layout
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  isOpen: boolean;
  view: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  toggleSidebar: () => void;
}

export const Sidebar = ({ isOpen, view, onViewChange, onLogout, toggleSidebar }: SidebarProps) => {
  return (
    <motion.aside
      initial={{ x: -260 }}
      animate={{ x: isOpen ? 0 : -260 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-zinc-900 shadow-lg flex flex-col"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-zinc-700">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            SuperCalendar
          </h2>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hover:bg-gray-100 dark:hover:bg-zinc-800">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        {/* Todoist Section */}
        <div className="mb-6 space-y-4">
          <div className="px-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 flex items-center">
              <Star className="h-4 w-4 mr-2 text-purple-500" />
              TODOIST
            </h3>
          </div>
          <div className="space-y-1 px-2">
            {/* Quick Access */}
            <Button
              variant={view === "todoist-inbox" ? "default" : "ghost"}
              className="w-full justify-start bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20"
              onClick={() => onViewChange("todoist-inbox")}
            >
              <Inbox className="mr-2 h-4 w-4 text-purple-600" />
              Inbox
            </Button>

            {/* Main Features */}
            <div className="space-y-1 mt-2">
              <Button
                variant={view === "todoist-tasks" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => onViewChange("todoist-tasks")}
              >
                <CheckSquare className="mr-2 h-4 w-4" />
                Tasks
              </Button>
              <Button
                variant={view === "todoist-calendar" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => onViewChange("todoist-calendar")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Calendar
              </Button>
              <Button
                variant={view === "todoist-board" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => onViewChange("todoist-board")}
              >
                <Layout className="mr-2 h-4 w-4" />
                Board View
              </Button>
            </div>

            <Separator className="my-2" />

            {/* Additional Features */}
            <div className="space-y-1">
              <Button
                variant={view === "todoist-priorities" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => onViewChange("todoist-priorities")}
              >
                <Flag className="mr-2 h-4 w-4" />
                Priorities
              </Button>
              <Button
                variant={view === "todoist-upcoming" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => onViewChange("todoist-upcoming")}
              >
                <Clock className="mr-2 h-4 w-4" />
                Upcoming
              </Button>
              <Button
                variant={view === "todoist-labels" ? "default" : "ghost"}
                className="w-full justify-start opacity-75 hover:opacity-100"
                onClick={() => onViewChange("todoist-labels")}
              >
                <Tags className="mr-2 h-4 w-4" />
                Labels
              </Button>
              <Button
                variant={view === "todoist-filters" ? "default" : "ghost"}
                className="w-full justify-start opacity-75 hover:opacity-100"
                onClick={() => onViewChange("todoist-filters")}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Notion Section */}
        <div className="mb-6 space-y-4">
          <div className="px-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 flex items-center">
              <Database className="h-4 w-4 mr-2 text-blue-500" />
              NOTION
            </h3>
          </div>
          <div className="space-y-1 px-2">
            <Button
              variant={view === "notion-databases" ? "default" : "ghost"}
              className="w-full justify-start bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
              onClick={() => onViewChange("notion-databases")}
            >
              <Database className="mr-2 h-4 w-4 text-blue-600" />
              Databases
            </Button>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-zinc-700 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 dark:text-gray-400"
          onClick={() => onViewChange("settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
        <Button 
          variant="destructive" 
          className="w-full justify-start bg-red-500/10 hover:bg-red-500/20 text-red-600"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </motion.aside>
  );
};