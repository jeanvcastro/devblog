import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CommentForm } from "@/components/comment-form";
import { useState } from "react";
import type { Comment } from "@/@types";

interface CommentSectionProps {
    comments: Comment[];
    postUuid: string;
    onSubmit: (content: string, parentUuid?: string) => Promise<void>;
    loading?: boolean;
}

function CommentItem({ comment, postUuid, onSubmit }: { comment: Comment; postUuid: string; onSubmit: (content: string, parentUuid?: string) => Promise<void> }) {
    const [showReplyForm, setShowReplyForm] = useState(false);

    const handleReplySubmit = async (content: string) => {
        await onSubmit(content, comment.uuid);
        setShowReplyForm(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.user.avatar || undefined} alt={comment.user.name} />
                    <AvatarFallback>{comment.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{comment.user.name}</span>
                        <span className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString("pt-BR")}
                        </span>
                    </div>
                    <p className="text-sm text-foreground/80 whitespace-pre-wrap">{comment.content}</p>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-8 text-xs"
                        onClick={() => setShowReplyForm(!showReplyForm)}
                    >
                        Responder
                    </Button>

                    {showReplyForm && (
                        <div className="mt-4">
                            <CommentForm
                                postUuid={postUuid}
                                parentUuid={comment.uuid}
                                onSubmit={handleReplySubmit}
                                onCancel={() => setShowReplyForm(false)}
                            />
                        </div>
                    )}
                </div>
            </div>

            {comment.replies && comment.replies.length > 0 && (
                <div className="ml-14 space-y-4 border-l-2 border-border pl-4">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.uuid}
                            comment={reply}
                            postUuid={postUuid}
                            onSubmit={onSubmit}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function CommentSection({ comments, postUuid, onSubmit, loading }: CommentSectionProps) {
    const handleMainCommentSubmit = async (content: string) => {
        await onSubmit(content);
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-bold mb-6">
                    Comentários ({comments.length})
                </h3>

                <CommentForm postUuid={postUuid} onSubmit={handleMainCommentSubmit} />
            </div>

            {comments.length > 0 ? (
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.uuid}
                            comment={comment}
                            postUuid={postUuid}
                            onSubmit={onSubmit}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted-foreground py-8">
                    Seja o primeiro a comentar!
                </p>
            )}
        </div>
    );
}
