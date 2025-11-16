import { Comment } from "@/@types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";
import { Check, Trash2, X } from "lucide-react";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

interface CommentModeratorProps {
    comments: Comment[];
    onApprove: (uuid: string) => void;
    onReject: (uuid: string) => void;
    onDelete: (uuid: string) => void;
    isLoading?: boolean;
}

interface CommentWithPost extends Comment {
    post?: {
        uuid: string;
        title: string;
    };
}

export function CommentModerator({
    comments,
    onApprove,
    onReject,
    onDelete,
    isLoading = false,
}: CommentModeratorProps) {
    if (comments.length === 0) {
        return (
            <Card>
                <CardContent className="flex h-64 items-center justify-center">
                    <p className="text-muted-foreground">
                        Nenhum comentário encontrado.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {comments.map(comment => {
                const commentWithPost = comment as CommentWithPost;
                const firstLetter = comment.user.name.charAt(0).toUpperCase();

                return (
                    <Card key={comment.uuid}>
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={
                                                comment.user.avatar || undefined
                                            }
                                        />
                                        <AvatarFallback>
                                            {firstLetter}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold">
                                                {comment.user.name}
                                            </p>
                                            <Badge
                                                variant={
                                                    comment.approved
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {comment.approved
                                                    ? "Aprovado"
                                                    : "Pendente"}
                                            </Badge>
                                        </div>
                                        <p className="text-muted-foreground text-xs">
                                            {dayjs(
                                                comment.created_at,
                                            ).fromNow()}
                                        </p>
                                        {commentWithPost.post && (
                                            <p className="text-muted-foreground text-xs">
                                                Post:{" "}
                                                {commentWithPost.post.title}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {!comment.approved && (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() =>
                                                    onApprove(comment.uuid)
                                                }
                                                disabled={isLoading}
                                                title="Aprovar comentário"
                                            >
                                                <Check className="h-4 w-4 text-green-600" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() =>
                                                    onReject(comment.uuid)
                                                }
                                                disabled={isLoading}
                                                title="Rejeitar comentário"
                                            >
                                                <X className="h-4 w-4 text-orange-600" />
                                            </Button>
                                        </>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => onDelete(comment.uuid)}
                                        disabled={isLoading}
                                        title="Excluir comentário"
                                    >
                                        <Trash2 className="text-destructive h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">{comment.content}</p>
                            {comment.replies && comment.replies.length > 0 && (
                                <div className="mt-4 space-y-3 border-l pl-4">
                                    {comment.replies.map(reply => {
                                        const replyFirstLetter = reply.user.name
                                            .charAt(0)
                                            .toUpperCase();
                                        return (
                                            <div
                                                key={reply.uuid}
                                                className="flex gap-3"
                                            >
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage
                                                        src={
                                                            reply.user.avatar ||
                                                            undefined
                                                        }
                                                    />
                                                    <AvatarFallback>
                                                        {replyFirstLetter}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-xs font-semibold">
                                                            {reply.user.name}
                                                        </p>
                                                        <p className="text-muted-foreground text-xs">
                                                            {dayjs(
                                                                reply.created_at,
                                                            ).fromNow()}
                                                        </p>
                                                    </div>
                                                    <p className="text-xs">
                                                        {reply.content}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
