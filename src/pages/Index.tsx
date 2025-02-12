
import { useState } from "react";
import { Calendar } from "@/components/Calendar";
import { TokenInput } from "@/components/TokenInput";
import { TaskSidebar } from "@/components/TaskSidebar";
import { useProjects } from "@/hooks/useProjects";
import { cn } from "@/lib/utils";

const Index = () => {
  const [token, setToken] = useState(() => localStorage.getItem("todoistToken") || "");
  const { projects, isLoading: projectsLoading } = useProjects(token);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800">
      {!token ? (
        <div className="container mx-auto px-4 py-20">
          <TokenInput onTokenSubmit={(newToken) => {
            setToken(newToken);
            localStorage.setItem("todoistToken", newToken);
          }} />
        </div>
      ) : (
        <div className="flex h-screen overflow-hidden">
          <TaskSidebar projects={projects} isLoading={projectsLoading} />
          <main className="flex-1 overflow-y-auto">
            <Calendar token={token} projects={projects} />
          </main>
        </div>
      )}
    </div>
  );
};

export default Index;
