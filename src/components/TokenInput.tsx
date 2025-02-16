
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { KeyRound, NotebookPen, Sparkles, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface TokenInputProps {
  onTokenSubmit: (tokens: { todoistToken: string; notionToken: string }) => void;
}

export const TokenInput = ({ onTokenSubmit }: TokenInputProps) => {
  const [todoistToken, setTodoistToken] = useState("");
  const [notionToken, setNotionToken] = useState("");
  const [showTodoistToken, setShowTodoistToken] = useState(false);
  const [showNotionToken, setShowNotionToken] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!todoistToken || !notionToken) {
      toast.error("Both tokens are required");
      return;
    }
    onTokenSubmit({ todoistToken, notionToken });
    toast.success("Successfully logged in!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md px-4"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Welcome to SuperCalendar
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Connect your Todoist and Notion accounts to get started
          </p>
        </div>

        <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <KeyRound className="h-4 w-4 text-purple-500" />
                  <Label className="font-medium">Todoist API Token</Label>
                </div>
                <div className="relative">
                  <Input
                    type={showTodoistToken ? "text" : "password"}
                    value={todoistToken}
                    onChange={(e) => setTodoistToken(e.target.value)}
                    className="pr-10"
                    placeholder="Enter your Todoist API token"
                  />
                  <button
                    type="button"
                    onClick={() => setShowTodoistToken(!showTodoistToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  >
                    {showTodoistToken ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <NotebookPen className="h-4 w-4 text-blue-500" />
                  <Label className="font-medium">Notion API Token</Label>
                </div>
                <div className="relative">
                  <Input
                    type={showNotionToken ? "text" : "password"}
                    value={notionToken}
                    onChange={(e) => setNotionToken(e.target.value)}
                    className="pr-10"
                    placeholder="Enter your Notion API token"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNotionToken(!showNotionToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  >
                    {showNotionToken ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 rounded-lg transition-all duration-200 hover:shadow-lg"
            >
              Connect Accounts
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Need help finding your tokens?{" "}
              <a
                href="#"
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 underline"
              >
                View Guide
              </a>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
