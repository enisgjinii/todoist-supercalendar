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

const Index = () => {
  const [tokens, setTokens] = useState(() => ({
    todoistToken: localStorage.getItem("todoistToken") || "",
    notionToken: localStorage.getItem("notionToken") || ""
  }));
  const [view, setView] = useState("todoist-inbox");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { data: projects } = useProjects(tokens.todoistToken);

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
        return <MonthView token={tokens.todoistToken} selectedProjectId={null} />;
      case "todoist-calendar":
        return (
          <Calendar
            token={tokens.todoistToken}
            projects={projects || []}
            selectedProjectId={null}
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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-900 flex">
      <Sidebar
        isOpen={isSidebarOpen}
        view={view}
        onViewChange={setView}
        onLogout={handleLogout}
        toggleSidebar={toggleSidebar}
      />
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed left-4 top-4 z-50 p-3 rounded-lg bg-white dark:bg-zinc-800 shadow-lg hover:shadow-xl transition-shadow"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}
      <div className={cn("transition-all duration-300 flex-1", isSidebarOpen ? "ml-64" : "ml-0")}>
        <header className="p-4 border-b bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-between">
          <div className="flex items-center">
            <button className="md:hidden p-2 mr-2" onClick={toggleSidebar}>
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>
        </header>
        <main className="p-4">{renderView()}</main>
      </div>
    </div>
  );
};

export default Index;