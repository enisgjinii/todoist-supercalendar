import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, Calendar as CalendarIcon, List, Kanban, Clock } from "lucide-react";
import { toast } from "sonner";

interface NavigationProps {
  onLogout: () => void;
  view: string;
  onViewChange: (view: string) => void;
}

export const Navigation = ({ onLogout, view, onViewChange }: NavigationProps) => {
  const handleLogout = () => {
    onLogout();
    toast.success("Logged out successfully");
  };

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 border-b bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
      <Tabs value={view} onValueChange={onViewChange} className="w-auto">
        <TabsList className="grid grid-cols-4 w-[400px] bg-zinc-100/50 dark:bg-zinc-800/50">
          <TabsTrigger 
            value="month" 
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 flex items-center gap-2"
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Month
          </TabsTrigger>
          <TabsTrigger value="week" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Week
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            List
          </TabsTrigger>
          <TabsTrigger value="board" className="flex items-center gap-2">
            <Kanban className="h-4 w-4" />
            Board
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};
