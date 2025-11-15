import type { Post } from "@/@types";
import { PostCard } from "@/components/post-card";

interface PostListProps {
    posts: Post[];
    loading?: boolean;
}

export function PostList({ posts, loading }: PostListProps) {
    if (loading) {
        return (
            <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-muted h-64 animate-pulse rounded-lg"
                    />
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
