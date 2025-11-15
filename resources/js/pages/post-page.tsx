import type { Comment, Post } from "@/@types";
import { CommentSection } from "@/components/comment-section";
import { Layout } from "@/components/layout";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { PopularPosts } from "@/components/popular-posts";
import { ReadingTime } from "@/components/reading-time";
import { SEO } from "@/components/seo";
import { TagBadge } from "@/components/tag-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ViewCounter } from "@/components/view-counter";
import { formatDate } from "@/lib/date";
import api from "@/services/api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function PostPage() {
    const { uuid } = useParams<{ uuid: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [commentsLoading, setCommentsLoading] = useState(true);

    useEffect(() => {
        if (!uuid) return;

        const fetchPost = async () => {
            try {
                const [postRes, commentsRes] = await Promise.all([
                    api.get<Post>(`/posts/${uuid}`),
                    api.get<Comment[]>(`/posts/${uuid}/comments`),
                ]);

                setPost(postRes.data);
                setComments(commentsRes.data);

                // Track view
                await api.post(`/posts/${uuid}/track-view`).catch(() => {});

                // Fetch related posts (same tags)
                if (postRes.data.tags && postRes.data.tags.length > 0) {
                    const tagUuid = postRes.data.tags[0].uuid;
                    const relatedRes = await api.get<{ posts: Post[] }>(
                        `/tags/${tagUuid}`,
                    );
                    setRelatedPosts(
                        relatedRes.data.posts
                            .filter(p => p.uuid !== uuid)
                            .slice(0, 5),
                    );
                }
            } catch (error) {
                console.error("Erro ao carregar post:", error);
                navigate("/");
            } finally {
                setLoading(false);
                setCommentsLoading(false);
            }
        };

        fetchPost();
    }, [uuid, navigate]);

    const handleCommentSubmit = async (
        content: string,
        parentUuid?: string,
    ) => {
        if (!uuid) return;

        try {
            await api.post("/comments", {
                post_uuid: uuid,
                parent_uuid: parentUuid,
                content,
            });

            // Reload comments
            const commentsRes = await api.get<Comment[]>(
                `/posts/${uuid}/comments`,
            );
            setComments(commentsRes.data);
        } catch (error) {
            console.error("Erro ao enviar comentário:", error);
            throw error;
        }
    };

    if (loading || !post) {
        return (
            <Layout>
                <div className="container mx-auto max-w-4xl px-4 py-12">
                    <div className="space-y-4">
                        <div className="bg-muted h-12 animate-pulse rounded" />
                        <div className="bg-muted h-6 w-1/3 animate-pulse rounded" />
                        <div className="bg-muted h-96 animate-pulse rounded" />
                    </div>
                </div>
            </Layout>
        );
    }

    const publishedDate = formatDate(post.published_at || post.created_at);

    return (
        <Layout>
            <SEO
                title={post.title}
                description={post.excerpt}
                url={`/post/${post.uuid}`}
                type="article"
                author={post.author.name}
                publishedTime={post.published_at || post.created_at}
                tags={post.tags?.map(tag => tag.name)}
            />
            <article className="container mx-auto max-w-7xl px-4 pt-12 pb-6">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <header className="mb-8">
                            <h1 className="mb-4 text-4xl font-bold text-black md:text-5xl dark:text-white">
                                {post.title}
                            </h1>

                            <div className="text-muted-foreground mb-4 flex flex-wrap items-center gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-10 w-10 ring-2 ring-background">
                                        <AvatarImage
                                            src={
                                                post.author.avatar || undefined
                                            }
                                            alt={post.author.name}
                                        />
                                        <AvatarFallback>
                                            {post.author.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-foreground font-semibold">
                                            {post.author.name}
                                        </p>
                                        <p>{publishedDate}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <ViewCounter count={post.views_count} />
                                    <ReadingTime minutes={post.reading_time} />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {post.tags?.map(tag => (
                                    <TagBadge key={tag.uuid} tag={tag} />
                                ))}
                            </div>
                        </header>

                        <div className="mb-12">
                            <MarkdownRenderer content={post.content} />
                        </div>

                        <div className="border-border border-t pt-12">
                            <CommentSection
                                comments={comments}
                                postUuid={post.uuid}
                                onSubmit={handleCommentSubmit}
                                loading={commentsLoading}
                            />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {relatedPosts.length > 0 && (
                            <PopularPosts
                                posts={relatedPosts}
                                loading={false}
                            />
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle>Sobre o Autor</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-3 flex items-center gap-3">
                                    <Avatar className="h-12 w-12 ring-2 ring-background">
                                        <AvatarImage
                                            src={
                                                post.author.avatar || undefined
                                            }
                                            alt={post.author.name}
                                        />
                                        <AvatarFallback>
                                            {post.author.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">
                                            {post.author.name}
                                        </p>
                                        <p className="text-muted-foreground text-sm">
                                            Autor
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </aside>
                </div>
            </article>
        </Layout>
    );
}
