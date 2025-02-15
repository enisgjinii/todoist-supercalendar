
import React from "react";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  X,
  Calendar,
  Database,
  LogOut,
  Settings,
  User,
  Star,
  CircleUserRound
} from "lucide-react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  isOpen: boolean;
  view: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  toggleSidebar: () => void;
  todoistToken: string;
  projects: any[];
  isLoading: boolean;
  selectedProjectId: string | null;
  onProjectSelect: (id: string | null) => void;
}

export const Sidebar = ({
  isOpen,
  view,
  onViewChange,
  onLogout,
  toggleSidebar,
  todoistToken,
  projects,
  isLoading,
  selectedProjectId,
  onProjectSelect
}: SidebarProps) => {
  const { data: user } = useUserProfile(todoistToken);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
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
          className="hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar_url || undefined} />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.full_name}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <div className="mb-6 space-y-4">
          <div className="px-3">
            <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 flex items-center">
              <Star className="h-4 w-4 mr-2 text-purple-500" />
              VIEWS
            </h3>
          </div>
          <div className="space-y-1 px-2">
            <Button
              variant={view === "month" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onViewChange("month")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </Button>
          </div>
        </div>

        <div className="mb-6 space-y-4">
          <div className="px-3">
            <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 flex items-center">
              <Database className="h-4 w-4 mr-2 text-blue-500" />
              INTEGRATIONS
            </h3>
          </div>
          <div className="space-y-1 px-2">
            <Button
              variant={view === "notion-databases" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onViewChange("notion-databases")}
            >
              <Database className="mr-2 h-4 w-4" />
              Notion Databases
            </Button>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-1 px-2">
          <Button
            variant={view === "settings" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onViewChange("settings")}
          >
            <CircleUserRound className="mr-2 h-4 w-4" />
            Profile & Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </nav>
    </div>
  );
};
