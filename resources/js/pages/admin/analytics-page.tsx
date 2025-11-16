import { AdminLayout } from "@/layout/admin-layout";
import { StatsCard } from "./components/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "./components/data-table";
import type { Post, Tag, Comment } from "@/@types";
import api from "@/services/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

type AnalyticsData = {
  total_posts: number;
  published_posts: number;
  draft_posts: number;
  total_views: number;
  total_comments: number;
  pending_comments: number;
  total_tags: number;
  avg_views_per_post: number;
};

export function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    total_posts: 0,
    published_posts: 0,
    draft_posts: 0,
    total_views: 0,
    total_comments: 0,
    pending_comments: 0,
    total_tags: 0,
    avg_views_per_post: 0,
  });
  const [mostViewedPosts, setMostViewedPosts] = useState<Post[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        const [postsRes, tagsRes, commentsRes, mostViewedRes, recentRes] =
          await Promise.all([
            api.get<{ data: Post[] }>("/posts?per_page=100"),
            api.get<Tag[]>("/tags"),
            api.get<Comment[]>("/admin/comments?filter=all"),
            api.get<Post[]>("/posts/most-viewed"),
            api.get<Post[]>("/posts/recent"),
          ]);

        const posts = postsRes.data.data;
        const comments = commentsRes.data;

        const totalViews = posts.reduce(
          (sum, post) => sum + post.views_count,
          0
        );
        const publishedPosts = posts.filter(
          (post) => post.status === "published"
        ).length;
        const pendingComments = comments.filter(
          (comment) => !comment.approved
        ).length;

        setAnalytics({
          total_posts: posts.length,
          published_posts: publishedPosts,
          draft_posts: posts.length - publishedPosts,
          total_views: totalViews,
          total_comments: comments.length,
          pending_comments: pendingComments,
          total_tags: tagsRes.data.length,
          avg_views_per_post:
            posts.length > 0 ? Math.round(totalViews / posts.length) : 0,
        });

        setMostViewedPosts(mostViewedRes.data);
        setRecentPosts(recentRes.data.slice(0, 5));
      } catch (error) {
        console.error("Erro ao carregar analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const mostViewedColumns: DataTableColumn<Post>[] = [
    {
      key: "title",
      header: "Post",
      cell: (post) => (
        <div className="group-hover:text-primary font-medium">
          {post.title}
        </div>
      ),
      className: "min-w-0",
    },
    {
      key: "views_count",
      header: "Visualizações",
      cell: (post) => post.views_count.toLocaleString("pt-BR"),
      className: "w-32 text-right",
    },
  ];

  const recentPostsColumns: DataTableColumn<Post>[] = [
    {
      key: "title",
      header: "Post",
      cell: (post) => (
        <div className="min-w-0 space-y-1">
          <div className="group-hover:text-primary font-medium">
            {post.title}
          </div>
          <div className="sm:hidden">
            <Badge
              className={
                post.status === "published"
                  ? "bg-green-600 text-white hover:bg-green-700 border-transparent"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 border-transparent"
              }
            >
              {post.status === "published" ? (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  Publicado
                </>
              ) : (
                <>
                  <Clock className="h-3 w-3" />
                  Rascunho
                </>
              )}
            </Badge>
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
          className={
            post.status === "published"
              ? "bg-green-600 text-white hover:bg-green-700 border-transparent"
              : "bg-muted text-muted-foreground hover:bg-muted/80 border-transparent"
          }
        >
          {post.status === "published" ? (
            <>
              <CheckCircle2 className="h-3 w-3" />
              Publicado
            </>
          ) : (
            <>
              <Clock className="h-3 w-3" />
              Rascunho
            </>
          )}
        </Badge>
      ),
      className: "hidden w-32 sm:table-cell",
    },
    {
      key: "published_at",
      header: "Data",
      cell: (post) =>
        post.published_at
          ? dayjs(post.published_at).format("DD/MM/YYYY")
          : "-",
      className: "w-32",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Estatísticas e métricas do seu blog
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total de Posts"
            value={loading ? "-" : analytics.total_posts}
            description={`${analytics.published_posts} publicados, ${analytics.draft_posts} rascunhos`}
          />
          <StatsCard
            title="Total de Visualizações"
            value={
              loading ? "-" : analytics.total_views.toLocaleString("pt-BR")
            }
            description={`Média de ${analytics.avg_views_per_post} por post`}
          />
          <StatsCard
            title="Total de Comentários"
            value={loading ? "-" : analytics.total_comments}
            description={`${analytics.pending_comments} pendentes`}
          />
          <StatsCard
            title="Total de Tags"
            value={loading ? "-" : analytics.total_tags}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Posts Mais Acessados</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={mostViewedPosts}
                columns={mostViewedColumns}
                loading={loading}
                emptyMessage="Nenhum post encontrado."
                actions={(post) => (
                  <Link to={`/admin/posts/${post.uuid}/edit`} className="absolute inset-0" />
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Posts Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={recentPosts}
                columns={recentPostsColumns}
                loading={loading}
                emptyMessage="Nenhum post encontrado."
                actions={(post) => (
                  <Link to={`/admin/posts/${post.uuid}/edit`} className="absolute inset-0" />
                )}
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Taxa de Publicação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Publicados
                  </span>
                  <span className="font-semibold">
                    {analytics.total_posts > 0
                      ? Math.round(
                          (analytics.published_posts / analytics.total_posts) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${
                        analytics.total_posts > 0
                          ? (analytics.published_posts / analytics.total_posts) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Moderação de Comentários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Aprovados
                  </span>
                  <span className="font-semibold">
                    {analytics.total_comments > 0
                      ? Math.round(
                          ((analytics.total_comments -
                            analytics.pending_comments) /
                            analytics.total_comments) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${
                        analytics.total_comments > 0
                          ? ((analytics.total_comments -
                              analytics.pending_comments) /
                              analytics.total_comments) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Engajamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Comentários por post
                  </span>
                  <span className="font-semibold">
                    {analytics.total_posts > 0
                      ? (
                          analytics.total_comments / analytics.total_posts
                        ).toFixed(1)
                      : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Views por post
                  </span>
                  <span className="font-semibold">
                    {analytics.avg_views_per_post}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
