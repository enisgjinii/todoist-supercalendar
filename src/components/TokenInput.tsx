
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface TokenInputProps {
  onTokenSubmit: (tokens: { todoistToken: string; notionToken: string }) => void;
}

export const TokenInput = ({ onTokenSubmit }: TokenInputProps) => {
  const [todoistToken, setTodoistToken] = useState("");
  const [notionToken, setNotionToken] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (todoistToken.trim() && notionToken.trim()) {
      onTokenSubmit({ todoistToken: todoistToken.trim(), notionToken: notionToken.trim() });
      toast.success("Connected successfully!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-md mx-auto"
    >
      <Card className="p-6 backdrop-blur-sm bg-white/90 dark:bg-zinc-900/90 shadow-lg border-zinc-200/50 dark:border-zinc-800/50">
        <h1 className="text-2xl font-heading mb-2 text-zinc-800 dark:text-zinc-100">Welcome to SuperCalendar</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
          Connect your Todoist and Notion accounts to get started. You can find your API tokens in their respective settings pages.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="todoist" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block mb-1">
              Todoist API Token
            </label>
            <Input
              id="todoist"
              type="password"
              placeholder="Enter your Todoist API token"
              value={todoistToken}
              onChange={(e) => setTodoistToken(e.target.value)}
              className="w-full bg-white/50 dark:bg-zinc-800/50"
            />
          </div>
          <div>
            <label htmlFor="notion" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block mb-1">
              Notion API Token
            </label>
            <Input
              id="notion"
              type="password"
              placeholder="Enter your Notion API token"
              value={notionToken}
              onChange={(e) => setNotionToken(e.target.value)}
              className="w-full bg-white/50 dark:bg-zinc-800/50"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
          >
            Connect Accounts
          </Button>
        </form>
        <div className="mt-4 text-xs text-zinc-500 dark:text-zinc-400 space-y-2">
          <p>
            🔑 Find your Todoist API token in{" "}
            <a 
              href="https://todoist.com/app/settings/integrations" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-zinc-900 dark:text-zinc-50 underline hover:no-underline"
            >
              Todoist Settings → Integrations
            </a>
          </p>
          <p>
            🔑 Create your Notion integration at{" "}
            <a 
              href="https://www.notion.so/my-integrations" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-zinc-900 dark:text-zinc-50 underline hover:no-underline"
            >
              Notion → My Integrations
            </a>
          </p>
        </div>
      </Card>
    </motion.div>
  );
};
