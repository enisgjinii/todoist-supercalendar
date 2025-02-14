//// filepath: /c:/Users/egjin/Desktop/todoist-supercalendar/src/pages/Index.tsx
import { useState } from "react";
import { Calendar } from "@/components/Calendar";
import { TokenInput } from "@/components/TokenInput";
import { NotionDatabasesList } from "@/components/NotionDatabasesList";
import { TaskSidebar } from "@/components/TaskSidebar";
import { useProjects } from "@/hooks/useProjects";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Navigation } from "@/components/Navigation";
import { MonthView } from "@/components/views/MonthView";
import { toast } from "sonner";

const Index = () => {
  const [tokens, setTokens] = useState(() => ({
    todoistToken: localStorage.getItem("todoistToken") || "",
    notionToken: localStorage.getItem("notionToken") || ""
  }));
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { data: projects, isLoading: projectsLoading } = useProjects(tokens.todoistToken);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // Extend view state to include "notion-databases" and "tasks"
  const [view, setView] = useState("month");

  const handleLogout = () => {
    setTokens({ todoistToken: "", notionToken: "" });
    localStorage.removeItem("todoistToken");
    localStorage.removeItem("notionToken");
    toast.success("Logged out successfully");
  };

  const handleTokenSubmit = (newTokens: { todoistToken: string; notionToken: string }) => {
    setTokens(newTokens);
    localStorage.setItem("todoistToken", newTokens.todoistToken);
    localStorage.setItem("notionToken", newTokens.notionToken);
  };

  const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-zinc-200/50 dark:border-zinc-800/50">
      <div className="flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold font-heading bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
              SuperCalendar
            </h1>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              Beta
            </span>
          </div>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-200 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800">
      <Navbar />
      {!tokens.todoistToken || !tokens.notionToken ? (
        <div className="container mx-auto px-4 pt-24 pb-16">
          <TokenInput onTokenSubmit={handleTokenSubmit} />
          <NotionDatabasesList notionToken={tokens.notionToken} />
        </div>
      ) : (
        <div className="flex h-screen pt-16">
          <AnimatePresence mode="wait">
            {isSidebarOpen && (
              <motion.div
                initial={{ x: -280, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -280, opacity: 0 }}
                transition={{ 
                  type: "spring", 
                  damping: 20, 
                  stiffness: 300 
                }}
                className="fixed inset-y-16 left-0 z-30 w-[280px] glass-morphism border-r border-zinc-200/50 dark:border-zinc-800/50"
              >
                <ScrollArea className="h-full">
                  <TaskSidebar 
                    projects={projects || []} 
                    isLoading={projectsLoading}
                    onProjectSelect={setSelectedProjectId}
                    selectedProjectId={selectedProjectId}
                    onViewChange={setView}
                    selectedView={view}
                  />
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>
          
          <main className={cn(
            "flex-1 flex flex-col transition-all duration-300",
            isSidebarOpen ? "ml-[280px]" : "ml-0"
          )}>
            <Navigation 
              view={view}
              onViewChange={setView}
              onLogout={handleLogout}
            />
            <ScrollArea className="flex-1">
              <AnimatePresence mode="wait">
                {view === "month" ? (
                  <MonthView 
                    token={tokens.todoistToken}
                    selectedProjectId={selectedProjectId}
                  />
                ) : view === "notion-databases" ? (
                  <NotionDatabasesList notionToken={tokens.notionToken} />
                ) : (
                  <Calendar 
                    token={tokens.todoistToken} 
                    projects={projects || []} 
                    selectedProjectId={selectedProjectId}
                  />
                )}
              </AnimatePresence>
            </ScrollArea>
          </main>
        </div>
      )}
    </div>
  );
};

export default Index;