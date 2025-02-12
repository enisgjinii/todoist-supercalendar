
import { useState } from "react";
import { Calendar } from "@/components/Calendar";
import { TokenInput } from "@/components/TokenInput";
import { TaskSidebar } from "@/components/TaskSidebar";
import { useProjects } from "@/hooks/useProjects";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor } from "lucide-react";

const Index = () => {
  const [token, setToken] = useState(() => localStorage.getItem("todoistToken") || "");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { data: projects, isLoading: projectsLoading } = useProjects(token);
  const { setTheme, theme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800">
      <div className="fixed top-4 right-4 flex gap-2 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme("light")}
          className={cn(
            "rounded-full",
            theme === "light" && "bg-zinc-200 dark:bg-zinc-700"
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
            theme === "dark" && "bg-zinc-200 dark:bg-zinc-700"
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
            theme === "system" && "bg-zinc-200 dark:bg-zinc-700"
          )}
        >
          <Monitor className="h-5 w-5" />
        </Button>
      </div>
      
      {!token ? (
        <div className="container mx-auto px-4 py-20">
          <TokenInput onTokenSubmit={(newToken) => {
            setToken(newToken);
            localStorage.setItem("todoistToken", newToken);
          }} />
        </div>
      ) : (
        <div className="flex h-screen overflow-hidden font-poppins">
          <TaskSidebar 
            projects={projects || []} 
            isLoading={projectsLoading}
            onProjectSelect={setSelectedProjectId}
            selectedProjectId={selectedProjectId}
          />
          <main className="flex-1 overflow-y-auto">
            <Calendar 
              token={token} 
              projects={projects || []} 
              selectedProjectId={selectedProjectId}
            />
          </main>
        </div>
      )}
    </div>
  );
};

export default Index;
