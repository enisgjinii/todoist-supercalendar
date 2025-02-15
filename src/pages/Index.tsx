
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
import { Settings } from "./Settings";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

const Index = () => {
  const [tokens, setTokens] = useState(() => ({
    todoistToken: localStorage.getItem("todoistToken") || "",
    notionToken: localStorage.getItem("notionToken") || ""
  }));
  const [view, setView] = useState("todoist-inbox");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { data: projects, isLoading: projectsLoading } = useProjects(tokens.todoistToken);

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
      case "settings":
        return <Settings todoistToken={tokens.todoistToken} />;
      case "month":
        return <MonthView token={tokens.todoistToken} selectedProjectId={selectedProjectId} />;
      case "todoist-calendar":
        return (
          <Calendar
            token={tokens.todoistToken}
            projects={projects || []}
            selectedProjectId={selectedProjectId}
          />
        );
      case "notion-databases":
        return <NotionDatabasesList notionToken={tokens.notionToken} />;
      default:
        return <MonthView token={tokens.todoistToken} selectedProjectId={selectedProjectId} />;
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
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-30 w-[280px] glass-morphism"
          >
            <ScrollArea className="h-full">
              <Sidebar
                view={view}
                onViewChange={setView}
                onLogout={handleLogout}
                toggleSidebar={toggleSidebar}
                isOpen={isSidebarOpen}
                todoistToken={tokens.todoistToken}
                projects={projects || []}
                isLoading={projectsLoading}
                selectedProjectId={selectedProjectId}
                onProjectSelect={setSelectedProjectId}
              />
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed left-4 top-4 z-50 p-3 rounded-lg bg-white dark:bg-zinc-800 shadow-lg hover:shadow-xl transition-shadow"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      <main className={cn(
        "transition-all duration-300",
        isSidebarOpen ? "ml-[280px]" : "ml-0"
      )}>
        <ScrollArea className="h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-6"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </ScrollArea>
      </main>
    </div>
  );
};

export default Index;
