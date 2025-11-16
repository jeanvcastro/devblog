import type { Post } from "@/@types";
import { ReadingTime } from "./reading-time";
import { TagBadge } from "./tag-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { ViewCounter } from "./view-counter";
import { formatDate } from "@/lib/date";
import { useNavigate } from "react-router-dom";

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    const navigate = useNavigate();
    const publishedDate = formatDate(post.published_at || post.created_at);

    const handleCardClick = () => {
        navigate(`/post/${post.uuid}`);
    };

    return (
        <Card
            className="group cursor-pointer hover:border-primary/60"
            onClick={handleCardClick}
        >
            <CardHeader>
                <h2 className="group-hover:text-primary text-2xl font-bold">
                    {post.title}
                </h2>
                <p className="text-muted-foreground text-sm">{publishedDate}</p>
            </CardHeader>
            <CardContent>
                <p className="text-foreground/80 line-clamp-3">
                    {post.excerpt}
                </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-6">
                <div
                    className="flex w-full flex-wrap gap-2"
                    onClick={e => e.stopPropagation()}
                >
                    {post.tags?.map(tag => (
                        <TagBadge key={tag.uuid} tag={tag} />
                    ))}
                </div>
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage
                                src={post.author.avatar || undefined}
                                alt={post.author.name}
                            />
                            <AvatarFallback>
                                {post.author.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-muted-foreground text-sm">
                            {post.author.name}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <ViewCounter count={post.views_count} />
                        <ReadingTime minutes={post.reading_time} />
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
