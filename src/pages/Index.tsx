
import React, { useState } from "react";
import { TokenInput } from "@/components/TokenInput";
import { Sidebar } from "@/components/Sidebar";
import { MonthView } from "@/components/views/MonthView";
import { Calendar } from "@/components/Calendar";
import { NotionDatabasesList } from "@/components/NotionDatabasesList";
import { useProjects } from "@/hooks/useProjects";
import { Menu, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Settings } from "./Settings";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-800">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <Card className="p-6 backdrop-blur-sm bg-white/90 dark:bg-zinc-900/90 border-none shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Welcome Back
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Enter your API tokens to continue
                  </p>
                </div>
              </div>
              <TokenInput onTokenSubmit={handleTokenSubmit} />
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-800">
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-30 w-[280px] glass-morphism border-r border-zinc-200 dark:border-zinc-700"
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
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSidebar}
          className="fixed left-4 top-4 z-50 p-3 rounded-lg bg-white dark:bg-zinc-800 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Menu className="h-5 w-5" />
        </motion.button>
      )}

      <main className={cn(
        "transition-all duration-300 min-h-screen",
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
