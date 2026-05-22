"use client";

import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { Pin, Trash2, MessageCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CommentInput } from "./CommentInput";
import {
  subscribeToComments,
  addReply,
  deleteComment,
  togglePinComment,
} from "@/lib/firestore";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useRole";
import { isFirebaseConfigured } from "@/lib/firebase";
import { getInitials, formatDateTime } from "@/lib/utils";
import type { Comment } from "@/types";

interface CommentThreadProps {
  eventId: string;
}

export function CommentThread({ eventId }: CommentThreadProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const { user, profile } = useAuth();
  const isAdmin = useIsAdmin();

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setComments([]);
      return;
    }
    const unsub = subscribeToComments(eventId, setComments);
    return () => unsub();
  }, [eventId]);

  const handleReply = async (commentId: string) => {
    if (!user || !replyText.trim()) return;
    await addReply(commentId, {
      userId: user.uid,
      userName: profile?.name || user.displayName || "User",
      message: replyText.trim(),
    });
    setReplyText("");
    setReplyTo(null);
  };

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <MessageCircle className="w-6 h-6 text-accent-primary" />
        Comments & Q&A
      </h2>

      {user ? (
        <CommentInput
          eventId={eventId}
          userId={user.uid}
          userName={profile?.name || user.displayName || "User"}
        />
      ) : (
        <p className="text-sm text-text-muted">
          <a href="/auth/login" className="text-accent-primary hover:underline">
            Sign in
          </a>{" "}
          to post a comment.
        </p>
      )}

      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-text-muted text-sm">No comments yet. Be the first!</p>
        )}
        {comments.map((comment) => (
          <GlassCard key={comment.id} className="relative">
            {comment.isPinned && (
              <Badge variant="accent" className="absolute top-4 right-4">
                <Pin className="w-3 h-3 mr-1" /> Pinned
              </Badge>
            )}
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-primary/20 flex items-center justify-center text-sm font-bold shrink-0">
                {getInitials(comment.userName)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm">{comment.userName}</span>
                  <span className="text-xs text-text-muted">
                    {comment.createdAt
                      ? formatDateTime(comment.createdAt)
                      : ""}
                  </span>
                </div>
                <p className="text-sm mt-1 text-text-primary/90">
                  {comment.message}
                </p>

                {comment.replies?.map((reply, i) => (
                  <div
                    key={i}
                    className="mt-3 ml-4 pl-4 border-l border-white/10"
                  >
                    <span className="font-medium text-xs">{reply.userName}</span>
                    <span className="text-xs text-text-muted ml-2">
                      {reply.createdAt instanceof Timestamp
                        ? formatDateTime(reply.createdAt)
                        : ""}
                    </span>
                    <p className="text-sm text-text-muted mt-0.5">
                      {reply.message}
                    </p>
                  </div>
                ))}

                <div className="flex items-center gap-2 mt-3">
                  {user && (
                    <button
                      onClick={() =>
                        setReplyTo(replyTo === comment.id ? null : comment.id)
                      }
                      className="text-xs text-accent-primary hover:underline"
                    >
                      Reply
                    </button>
                  )}
                  {isAdmin && (
                    <>
                      <button
                        onClick={() =>
                          togglePinComment(comment.id, !comment.isPinned)
                        }
                        className="text-xs text-text-muted hover:text-accent-secondary"
                      >
                        {comment.isPinned ? "Unpin" : "Pin"}
                      </button>
                      <button
                        onClick={() => deleteComment(comment.id)}
                        className="text-xs text-accent-highlight hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </>
                  )}
                </div>

                {replyTo === comment.id && user && (
                  <div className="flex gap-2 mt-3">
                    <input
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply…"
                      className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
                    />
                    <Button size="sm" onClick={() => handleReply(comment.id)}>
                      Reply
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
