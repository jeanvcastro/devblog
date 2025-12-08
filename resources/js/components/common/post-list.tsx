import type { Post } from "@/@types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { PostCard } from "./post-card";

interface PostListProps {
    posts: Post[];
    loading?: boolean;
}

function PostCardSkeleton() {
    return (
        <Card>
            <CardHeader>
                <div className="bg-muted h-7 w-3/4 animate-pulse rounded" />
                <div className="bg-muted h-4 w-24 animate-pulse rounded" />
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="bg-muted h-4 w-full animate-pulse rounded" />
                    <div className="bg-muted h-4 w-full animate-pulse rounded" />
                    <div className="bg-muted h-4 w-2/3 animate-pulse rounded" />
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-6">
                <div className="flex w-full gap-2">
                    <div className="bg-muted h-5 w-16 animate-pulse rounded-full" />
                    <div className="bg-muted h-5 w-20 animate-pulse rounded-full" />
                </div>
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-muted h-8 w-8 animate-pulse rounded-full" />
                        <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-muted h-4 w-12 animate-pulse rounded" />
                        <div className="bg-muted h-4 w-16 animate-pulse rounded" />
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}

export function PostList({ posts, loading }: PostListProps) {
    if (loading) {
        return (
            <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                    <PostCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="py-12 text-center">
                <p className="text-muted-foreground">Nenhum post encontrado.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {posts.map(post => (
                <PostCard key={post.uuid} post={post} />
            ))}
        </div>
    );
}
