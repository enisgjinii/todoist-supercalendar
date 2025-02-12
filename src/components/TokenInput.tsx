
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface TokenInputProps {
  onTokenSubmit: (token: string) => void;
}

export const TokenInput = ({ onTokenSubmit }: TokenInputProps) => {
  const [token, setToken] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-md mx-auto"
    >
      <Card className="p-6 backdrop-blur-sm bg-white/90 shadow-lg">
        <h1 className="text-2xl font-semibold mb-2 text-zinc-800">Welcome to SuperCalendar</h1>
        <p className="text-sm text-zinc-600 mb-6">
          To get started, please enter your Todoist API token. You can find this in Todoist's settings
          under Integrations.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (token.trim()) onTokenSubmit(token.trim());
          }}
          className="space-y-4"
        >
          <Input
            type="password"
            placeholder="Enter your Todoist API token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full"
          />
          <Button type="submit" className="w-full bg-zinc-800 hover:bg-zinc-700">
            Connect to Todoist
          </Button>
        </form>
      </Card>
    </motion.div>
  );
};
