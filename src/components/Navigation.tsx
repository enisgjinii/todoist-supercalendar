
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
    <div className="flex items-center justify-between px-4 py-2 border-b bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
      <Tabs value={view} onValueChange={onViewChange} className="w-auto">
        <TabsList className="grid grid-cols-4 w-[400px]">
          <TabsTrigger value="month" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
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
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleLogout}
        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </div>
  );
};
