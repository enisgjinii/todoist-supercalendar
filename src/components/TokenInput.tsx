import React, { useState } from "react";

interface TokenInputProps {
  onTokenSubmit: (tokens: { todoistToken: string; notionToken: string }) => void;
}

export const TokenInput = ({ onTokenSubmit }: TokenInputProps) => {
  const [todoistToken, setTodoistToken] = useState("");
  const [notionToken, setNotionToken] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!todoistToken || !notionToken) {
      alert("Both tokens are required");
      return;
    }
    onTokenSubmit({ todoistToken, notionToken });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Enter API Tokens</h2>
      <div className="mb-4">
        <label className="block font-medium mb-1">Todoist Token</label>
        <input
          type="text"
          value={todoistToken}
          onChange={(e) => setTodoistToken(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter Todoist API Token"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Notion Token</label>
        <input
          type="text"
          value={notionToken}
          onChange={(e) => setNotionToken(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter Notion API Token"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-150"
      >
        Save Tokens
      </button>
    </form>
  );
};