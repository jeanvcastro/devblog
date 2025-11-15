import type { Post } from "@/@types";
import { ReadingTime } from "@/components/reading-time";
import { TagBadge } from "@/components/tag-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { ViewCounter } from "@/components/view-counter";
import { useNavigate } from "react-router-dom";

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    const navigate = useNavigate();

    const publishedDate = new Date(
        post.publishedAt || post.createdAt,
    ).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    const handleCardClick = () => {
        navigate(`/post/${post.uuid}`);
    };

    return (
        <Card
            className="hover:border-primary group cursor-pointer transition-colors duration-200"
            onClick={handleCardClick}
        >
            <CardHeader>
                <h2 className="group-hover:text-primary text-2xl font-bold transition-colors duration-200">
                    {post.title}
                </h2>
                <p className="text-muted-foreground text-sm">{publishedDate}</p>
            </CardHeader>
            <CardContent>
                <p className="text-foreground/80 line-clamp-3">
                    {post.excerpt}
                </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                    {post.tags.map(tag => (
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
                        <ViewCounter count={post.viewsCount} />
                        <ReadingTime minutes={post.readingTime} />
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
