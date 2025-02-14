"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { X, Calendar, Inbox, CheckSquare, Database, LogOut, Settings, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  isOpen: boolean;
  view: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  toggleSidebar: () => void;
}

export const Sidebar = ({
  isOpen,
  view,
  onViewChange,
  onLogout,
  toggleSidebar
}: SidebarProps) => {
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
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hover:bg-gray-100 dark:hover:bg-zinc-800"
        >
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
            <Button
              variant={view === "todoist-inbox" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onViewChange("todoist-inbox")}
            >
              <Inbox className="mr-2 h-4 w-4" />
              Inbox
            </Button>

            <Button
              variant={view === "todoist-tasks" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onViewChange("todoist-tasks")}
            >
              <CheckSquare className="mr-2 h-4 w-4" />
              Tasks
            </Button>
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
              className="w-full justify-start"
              onClick={() => onViewChange("notion-databases")}
            >
              <Database className="mr-2 h-4 w-4" />
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
