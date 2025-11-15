import { AdminLayout } from "@/components/layout/admin-layout";
import { StatsCard } from "@/components/stats-card";
import { DataTable, type DataTableColumn } from "@/components/data-table";
import type { Post, Tag } from "@/@types";
import api from "@/services/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

type DashboardStats = {
    total_posts: number;
    total_tags: number;
    total_views: number;
    published_posts: number;
};

export function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        total_posts: 0,
        total_tags: 0,
        total_views: 0,
        published_posts: 0,
    });
    const [recentPosts, setRecentPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                const [postsRes, tagsRes, recentRes] = await Promise.all([
                    api.get<{ data: Post[] }>("/posts?per_page=100"),
                    api.get<Tag[]>("/tags"),
                    api.get<Post[]>("/posts/recent"),
                ]);

                const posts = postsRes.data.data;
                const totalViews = posts.reduce(
                    (sum, post) => sum + post.views_count,
                    0
                );
                const publishedPosts = posts.filter(
                    (post) => post.status === "published"
                ).length;

                setStats({
                    total_posts: posts.length,
                    total_tags: tagsRes.data.length,
                    total_views: totalViews,
                    published_posts: publishedPosts,
                });

                setRecentPosts(recentRes.data.slice(0, 10));
            } catch (error) {
                console.error("Erro ao carregar dados do dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const columns: DataTableColumn<Post>[] = [
        {
            key: "title",
            header: "Título",
            cell: (post) => (
                <div className="min-w-0 space-y-1">
                    <div className="group-hover:text-primary font-medium">
                        {post.title}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:hidden">
                        <Badge
                            variant={
                                post.status === "published"
                                    ? "default"
                                    : "secondary"
                            }
                        >
                            {post.status === "published"
                                ? "Publicado"
                                : "Rascunho"}
                        </Badge>
                        <span className="text-muted-foreground text-xs">
                            {post.views_count} views
                        </span>
                    </div>
                </div>
            ),
            className: "min-w-0",
        },
        {
            key: "status",
            header: "Status",
            cell: (post) => (
                <Badge
                    variant={
                        post.status === "published" ? "default" : "secondary"
                    }
                >
                    {post.status === "published" ? "Publicado" : "Rascunho"}
                </Badge>
            ),
            className: "hidden w-32 sm:table-cell",
        },
        {
            key: "views_count",
            header: "Views",
            cell: (post) => post.views_count.toLocaleString("pt-BR"),
            className: "hidden w-24 text-right sm:table-cell",
        },
        {
            key: "published_at",
            header: "Data",
            cell: (post) =>
                post.published_at
                    ? dayjs(post.published_at).format("DD/MM/YYYY")
                    : "-",
            className: "hidden w-32 sm:table-cell",
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground mt-2">
                        Visão geral do seu blog
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total de Posts"
                        value={loading ? "-" : stats.total_posts}
                        description={`${stats.published_posts} publicados`}
                    />
                    <StatsCard
                        title="Total de Tags"
                        value={loading ? "-" : stats.total_tags}
                    />
                    <StatsCard
                        title="Total de Visualizações"
                        value={
                            loading ? "-" : stats.total_views.toLocaleString("pt-BR")
                        }
                    />
                    <StatsCard
                        title="Posts Publicados"
                        value={loading ? "-" : stats.published_posts}
                        description={`${stats.total_posts - stats.published_posts} rascunhos`}
                    />
                </div>

                <div>
                    <h2 className="mb-4 text-xl font-semibold">
                        Posts Recentes
                    </h2>
                    <DataTable
                        data={recentPosts}
                        columns={columns}
                        loading={loading}
                        emptyMessage="Nenhum post encontrado."
                        actions={(post) => (
                            <Link to={`/admin/posts/${post.uuid}/edit`} className="absolute inset-0" />
                        )}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
