
import { useState } from "react";
import { Calendar } from "@/components/Calendar";
import { TokenInput } from "@/components/TokenInput";
import { TaskSidebar } from "@/components/TaskSidebar";
import { useProjects } from "@/hooks/useProjects";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon, Monitor, Github } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index = () => {
  const [token, setToken] = useState(() => localStorage.getItem("todoistToken") || "");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { data: projects, isLoading: projectsLoading } = useProjects(token);
  const { setTheme, theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
          <h1 className="text-xl font-semibold font-inter">Todoist Calendar</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme("light")}
            className={cn(
              "rounded-full",
              theme === "light" && "bg-zinc-100 dark:bg-zinc-800"
            )}
          >
            <Sun className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme("dark")}
            className={cn(
              "rounded-full",
              theme === "dark" && "bg-zinc-100 dark:bg-zinc-800"
            )}
          >
            <Moon className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme("system")}
            className={cn(
              "rounded-full",
              theme === "system" && "bg-zinc-100 dark:bg-zinc-800"
            )}
          >
            <Monitor className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer className="fixed bottom-0 left-0 right-0 z-40 glass-morphism">
      <div className="flex items-center justify-between px-4 h-12">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Built with ❤️ using React & Todoist API
        </p>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <Github className="h-5 w-5" />
        </a>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 font-inter">
      <Navbar />
      
      {!token ? (
        <div className="container mx-auto px-4 pt-24 pb-16">
          <TokenInput onTokenSubmit={(newToken) => {
            setToken(newToken);
            localStorage.setItem("todoistToken", newToken);
          }} />
        </div>
      ) : (
        <div className="flex h-[calc(100vh-7rem)] pt-16 pb-12">
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
            "flex-1 transition-all duration-300 overflow-hidden",
            isSidebarOpen ? "ml-[280px]" : "ml-0"
          )}>
            <ScrollArea className="h-full">
              <Calendar 
                token={token} 
                projects={projects || []} 
                selectedProjectId={selectedProjectId}
              />
            </ScrollArea>
          </main>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Index;
