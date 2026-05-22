"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { getAllComments, deleteComment } from "@/lib/firestore";
import { formatDateTime } from "@/lib/utils";
import type { Comment } from "@/types";

export default function DashboardCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);

  const load = () =>
    getAllComments(50).then(setComments).catch(() => setComments([]));

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this comment?")) return;
    await deleteComment(id);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Comments moderation</h1>
      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-text-muted text-center py-12 glass rounded-2xl">
            No comments yet.
          </p>
        )}
        {comments.map((comment) => (
          <GlassCard key={comment.id} className="flex justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">{comment.userName}</span>
                <span className="text-xs text-text-muted">
                  {comment.createdAt
                    ? formatDateTime(comment.createdAt)
                    : ""}
                </span>
              </div>
              <p className="text-sm text-text-muted truncate">
                Event: {comment.eventId}
              </p>
              <p className="text-sm mt-2">{comment.message}</p>
              {comment.replies?.length > 0 && (
                <p className="text-xs text-text-muted mt-2">
                  {comment.replies.length} repl{comment.replies.length === 1 ? "y" : "ies"}
                </p>
              )}
            </div>
            <button
              onClick={() => handleDelete(comment.id)}
              className="shrink-0 p-2 rounded-lg hover:bg-accent-highlight/20 text-accent-highlight"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
