"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createComment } from "@/lib/firestore";

interface CommentInputProps {
  eventId: string;
  userId: string;
  userName: string;
}

export function CommentInput({ eventId, userId, userName }: CommentInputProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    try {
      await createComment({ eventId, userId, userName, message: message.trim() });
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask a question or leave a comment…"
        className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-accent-primary/50"
      />
      <Button type="submit" size="sm" disabled={loading || !message.trim()}>
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
}
