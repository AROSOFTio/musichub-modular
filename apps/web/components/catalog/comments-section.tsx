"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getSongComments, addComment, deleteComment, Comment } from "@/lib/api-engagement";
import { Trash } from "lucide-react";

export function CommentsSection({ songId }: { songId: string }) {
  const { accessToken, user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [songId]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const data = await getSongComments(songId);
      setComments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const newComment = await addComment(accessToken ?? undefined, songId, content);
      setComments([newComment, ...comments]);
      setContent("");
    } catch (e: any) {
      alert(e.message || "Could not post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!accessToken) return;
    if (!confirm("Delete this comment?")) return;

    try {
      await deleteComment(accessToken ?? undefined, id);
      setComments(comments.filter((c) => c.id !== id));
    } catch (e: any) {
      alert(e.message || "Could not delete comment");
    }
  };

  if (isLoading) return <div className="mt-8 animate-pulse h-32 bg-slate-100 rounded-3xl" />;

  return (
    <div className="mt-12">
      <h3 className="text-xl font-semibold text-slate-950">Comments ({comments.length})</h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mt-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-2xl border border-borderSoft p-4 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            placeholder="Add a comment..."
            rows={3}
          />
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="button-primary px-6"
            >
              Post comment
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-6 rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">
          Please log in to add a comment.
        </div>
      )}

      <div className="mt-8 space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-violet-100">
              {comment.user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={comment.user.avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-medium text-violet-700">
                  {comment.user.displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-slate-950">{comment.user.displayName}</p>
                <span className="text-xs text-slate-400">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{comment.content}</p>
            </div>
            {(user?.id === comment.userId || user?.role === "ADMIN") && (
              <button
                onClick={() => handleDelete(comment.id)}
                className="self-start p-2 text-slate-400 hover:text-rose-600"
                title="Delete comment"
              >
                <Trash className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
