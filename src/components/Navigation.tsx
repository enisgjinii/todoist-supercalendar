
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Calendar as CalendarIcon,
  List,
  Kanban,
  Clock,
  Moon,
  Sun,
  User
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserProfile } from "@/hooks/useUserProfile";

interface NavigationProps {
  onLogout: () => void;
  view: string;
  onViewChange: (view: string) => void;
  todoistToken: string;
}

export const Navigation = ({ onLogout, view, onViewChange, todoistToken }: NavigationProps) => {
  const { setTheme, theme } = useTheme();
  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile(todoistToken);

  const handleLogout = () => {
    onLogout();
    toast.success("Logged out successfully");
  };

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 border-b bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
      <Tabs value={view} onValueChange={onViewChange} className="w-auto">
        <TabsList className="grid grid-cols-4 w-[400px] bg-zinc-100/50 dark:bg-zinc-800/50">
          <TabsTrigger value="month" className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Month
          </TabsTrigger>
          <TabsTrigger value="week">
            <Clock className="h-4 w-4 mr-2" />
            Week
          </TabsTrigger>
          <TabsTrigger value="list">
            <List className="h-4 w-4 mr-2" />
            List
          </TabsTrigger>
          <TabsTrigger value="board">
            <Kanban className="h-4 w-4 mr-2" />
            Board
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={userProfile?.avatar_url} alt={userProfile?.full_name} />
                <AvatarFallback>
                  {userProfile?.full_name?.charAt(0) || <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            {!isLoadingProfile && userProfile && (
              <div className="flex flex-col px-2 py-1.5 gap-1">
                <p className="text-sm font-medium">{userProfile.full_name}</p>
                <p className="text-xs text-muted-foreground">{userProfile.email}</p>
              </div>
            )}
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
