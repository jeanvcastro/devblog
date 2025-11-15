import { Layout } from "@/components/layout";
import { PostList } from "@/components/post-list";
import { SEO } from "@/components/seo";
import api from "@/services/api";
import type { Post, Tag } from "@/@types";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function TagPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [tag, setTag] = useState<Tag | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;

        const fetchTagPosts = async () => {
            try {
                // Find tag by slug
                const tagsRes = await api.get<Tag[]>("/tags");
                const foundTag = tagsRes.data.find((t) => t.slug === slug);

                if (!foundTag) {
                    navigate("/");
                    return;
                }

                setTag(foundTag);

                // Fetch posts for this tag
                const postsRes = await api.get<{ posts: Post[] }>(`/tags/${foundTag.uuid}`);
                setPosts(postsRes.data.posts);
            } catch (error) {
                console.error("Erro ao carregar tag:", error);
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        fetchTagPosts();
    }, [slug, navigate]);

    if (loading) {
        return (
            <Layout>
                <div className="container mx-auto max-w-4xl px-4 py-12">
                    <div className="h-12 bg-muted animate-pulse rounded mb-8" />
                    <div className="space-y-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
                        ))}
                    </div>
                </div>
            </Layout>
        );
    }

    if (!tag) {
        return null;
    }

    return (
        <Layout>
            <SEO
                title={tag.name}
                description={`Artigos sobre ${tag.name}. ${posts.length} post${posts.length !== 1 ? "s" : ""} disponível${posts.length !== 1 ? "is" : ""}.`}
                url={`/tag/${tag.slug}`}
            />
            <div className="container mx-auto max-w-4xl px-4 py-12">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                    <Link to="/" className="hover:text-primary transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                    <span>Tags</span>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-foreground font-semibold">{tag.name}</span>
                </nav>

                {/* Header */}
                <header className="mb-12">
                    <h1 className="text-4xl font-bold mb-2">{tag.name}</h1>
                    <p className="text-muted-foreground">
                        {posts.length} post{posts.length !== 1 ? "s" : ""} com esta tag
                    </p>
                </header>

                {/* Posts */}
                <PostList posts={posts} loading={loading} />
            </div>
        </Layout>
    );
}
