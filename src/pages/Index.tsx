
import { useState } from "react";
import { Calendar } from "@/components/Calendar";
import { TokenInput } from "@/components/TokenInput";
import { TaskSidebar } from "@/components/TaskSidebar";
import { useProjects } from "@/hooks/useProjects";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Navigation } from "@/components/Navigation";
import { MonthView } from "@/components/views/MonthView";

const Index = () => {
  const [token, setToken] = useState(() => localStorage.getItem("todoistToken") || "");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { data: projects, isLoading: projectsLoading } = useProjects(token);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [view, setView] = useState("month");

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("todoistToken");
  };

  const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <h1 className="text-xl font-semibold font-heading">Todoist Calendar</h1>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800">
      <Navbar />
      
      {!token ? (
        <div className="container mx-auto px-4 pt-24 pb-16">
          <TokenInput onTokenSubmit={(newToken) => {
            setToken(newToken);
            localStorage.setItem("todoistToken", newToken);
          }} />
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
                    token={token}
                    selectedProjectId={selectedProjectId}
                  />
                ) : (
                  <Calendar 
                    token={token} 
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
