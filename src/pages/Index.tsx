import React, { useState } from "react";
import { TokenInput } from "@/components/TokenInput";
import { Sidebar } from "@/components/Sidebar";
import { MonthView } from "@/components/views/MonthView";
import { Calendar } from "@/components/Calendar";
import { NotionDatabasesList } from "@/components/NotionDatabasesList";
import { useProjects } from "@/hooks/useProjects";
import { Menu } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Navigation } from "@/components/Navigation";
import { TaskSidebar } from "@/components/TaskSidebar";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index = () => {
  const [tokens, setTokens] = useState(() => ({
    todoistToken: localStorage.getItem("todoistToken") || "",
    notionToken: localStorage.getItem("notionToken") || ""
  }));
  const [view, setView] = useState("todoist-inbox");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { data: projects, isLoading: projectsLoading } = useProjects(tokens.todoistToken);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

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

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const renderView = () => {
    switch (view) {
      case "todoist-inbox":
      case "todoist-tasks":
        return <MonthView token={tokens.todoistToken} selectedProjectId={selectedProjectId} />;
      case "todoist-calendar":
        return (
          <Calendar
            token={tokens.todoistToken}
            projects={projects || []}
            selectedProjectId={selectedProjectId}
          />
        );
      case "todoist-board":
        return <div className="p-4">Board View Coming Soon</div>;
      case "todoist-priorities":
        return <div className="p-4">Priorities View Coming Soon</div>;
      case "todoist-upcoming":
        return <div className="p-4">Upcoming View Coming Soon</div>;
      case "todoist-labels":
        return <div className="p-4">Labels View Coming Soon</div>;
      case "todoist-filters":
        return <div className="p-4">Filters View Coming Soon</div>;
      case "notion-databases":
        return <NotionDatabasesList notionToken={tokens.notionToken} />;
      case "settings":
        return <div className="p-4">Settings Coming Soon</div>;
      default:
        return <div className="p-4">Select a view from the sidebar</div>;
    }
  };

  if (!tokens.todoistToken || !tokens.notionToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
        <div className="container mx-auto px-4 py-12">
          <TokenInput onTokenSubmit={handleTokenSubmit} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800">
      <Navigation 
        view={view}
        onViewChange={setView}
        onLogout={handleLogout}
        todoistToken={tokens.todoistToken}
      />
      
      {!tokens.todoistToken || !tokens.notionToken ? (
        <div className="container mx-auto px-4 pt-24 pb-16">
          <TokenInput onTokenSubmit={handleTokenSubmit} />
        </div>
      ) : (
        <div className="flex h-screen pt-16">
          <AnimatePresence mode="wait">
            {isSidebarOpen && (
              <motion.div
                initial={{ x: -280, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -280, opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="fixed inset-y-16 left-0 z-30 w-[280px] glass-morphism"
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
              todoistToken={tokens.todoistToken}
            />
            <ScrollArea className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={view}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6"
                >
                  {view === "month" ? (
                    <MonthView 
                      token={tokens.todoistToken}
                      selectedProjectId={selectedProjectId}
                    />
                  ) : (
                    <Calendar 
                      token={tokens.todoistToken} 
                      projects={projects || []} 
                      selectedProjectId={selectedProjectId}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </ScrollArea>
          </main>
        </div>
      )}
    </div>
  );
};

export default Index;
