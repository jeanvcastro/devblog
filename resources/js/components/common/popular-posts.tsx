import type { Post } from "@/@types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ViewCounter } from "./view-counter";
import { Link } from "react-router-dom";

interface PopularPostsProps {
    posts: Post[];
    loading?: boolean;
}

export function PopularPosts({ posts, loading }: PopularPostsProps) {
    if (loading) {
        return (
            <Card className="border-border border">
                <CardHeader>
                    <CardTitle>Posts Populares</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-muted h-16 animate-pulse rounded"
                        />
                    ))}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Posts Populares</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {posts.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                        Nenhum post disponível.
                    </p>
                ) : (
                    posts.map((post, index) => (
                        <div key={post.uuid} className="flex gap-3">
                            <span className="text-primary text-2xl font-bold">
                                {index + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                                <Link
                                    to={`/post/${post.uuid}`}
                                    className="hover:text-primary"
                                >
                                    <h4 className="mb-1 line-clamp-2 text-sm font-semibold">
                                        {post.title}
                                    </h4>
                                </Link>
                                <ViewCounter count={post.views_count} />
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
