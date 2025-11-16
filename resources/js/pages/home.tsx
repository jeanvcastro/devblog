import type { Post, Tag } from "@/@types";
import { Layout } from "@/components/layout";
import { PopularPosts } from "@/components/popular-posts";
import { PostList } from "@/components/post-list";
import { SEO } from "@/components/seo";
import { TagCloud } from "@/components/tag-cloud";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/services/api";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
    const [recentPosts, setRecentPosts] = useState<Post[]>([]);
    const [popularPosts, setPopularPosts] = useState<Post[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [recentRes, popularRes, tagsRes] = await Promise.all([
                    api.get<Post[]>("/posts/recent"),
                    api.get<Post[]>("/posts/most-viewed"),
                    api.get<Tag[]>("/tags"),
                ]);

                setRecentPosts(recentRes.data);
                setPopularPosts(popularRes.data);
                setTags(tagsRes.data);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <Layout>
            <SEO
                title="Home"
                description="Artigos técnicos sobre desenvolvimento de software, arquitetura de sistemas, design patterns, performance e boas práticas."
                url="/"
            />
            <div className="container mx-auto max-w-7xl px-4 py-8">
                {/* Hero Section */}
                <section className="mb-12 py-12 text-center">
                    <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
                        Bem-vindo ao{" "}
                        <span className="from-primary to-secondary bg-linear-to-r bg-clip-text text-transparent">
                            BroderLab
                        </span>
                    </h1>
                    <p className="text-foreground/80 mx-auto mt-6 max-w-2xl text-lg">
                        Artigos técnicos sobre desenvolvimento de software,
                        arquitetura, performance e muito mais.
                    </p>
                    <div className="mt-8">
                        <Link
                            to="/search"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-8 py-3"
                        >
                            <Search className="h-5 w-5" />
                            Buscar Artigos
                        </Link>
                    </div>
                </section>

                {/* Main Content */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main Column */}
                    <div className="space-y-12 lg:col-span-2">
                        {/* Most Viewed Section */}
                        <section>
                            <h2 className="mb-6 text-3xl font-bold">
                                Mais Acessados
                            </h2>
                            {loading ? (
                                <div className="space-y-6">
                                    {[...Array(3)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="bg-muted h-64 animate-pulse rounded-lg"
                                        />
                                    ))}
                                </div>
                            ) : (
                                <PostList posts={popularPosts.slice(0, 3)} />
                            )}
                        </section>

                        {/* Recent Posts Section */}
                        <section>
                            <h2 className="mb-6 text-3xl font-bold">
                                Artigos Recentes
                            </h2>
                            <PostList posts={recentPosts} loading={loading} />
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6 md:mt-15">
                        <PopularPosts posts={popularPosts} loading={loading} />

                        <Card>
                            <CardHeader>
                                <CardTitle>Tags</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <TagCloud tags={tags} loading={loading} />
                            </CardContent>
                        </Card>
                    </aside>
                </div>
            </div>
        </Layout>
    );
}
