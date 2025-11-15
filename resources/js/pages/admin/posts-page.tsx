import { AdminLayout } from "@/components/layout/admin-layout";
import { DataTable, type DataTableColumn } from "@/components/data-table";
import type { Post, Tag } from "@/@types";
import api from "@/services/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Search, CheckCircle2, Clock } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

export function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get<Tag[]>("/tags");
        setTags(response.data);
      } catch (error) {
        console.error("Erro ao carregar tags:", error);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, tagFilter]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        params.append("include_drafts", "true");
        if (searchQuery) params.append("q", searchQuery);
        if (statusFilter !== "all") params.append("status", statusFilter);
        if (tagFilter !== "all") params.append("tags", tagFilter);
        params.append("page", currentPage.toString());

        const response = await api.get<{ data: Post[]; last_page: number }>(
          `/posts/search?${params.toString()}`
        );

        setPosts(response.data.data || []);
        setTotalPages(response.data.last_page || 1);
      } catch (error) {
        console.error("Erro ao carregar posts:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchPosts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, statusFilter, tagFilter, currentPage]);

  const handleDeletePost = async () => {
    if (!postToDelete) return;

    try {
      setIsDeleting(true);
      await api.delete(`/posts/${postToDelete.uuid}`);
      setPosts((prev) => prev.filter((p) => p.uuid !== postToDelete.uuid));
      setDeleteDialogOpen(false);
      setPostToDelete(null);
      toast.success("Post excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar post:", error);
      toast.error("Erro ao excluir post");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: DataTableColumn<Post>[] = [
    {
      key: "title",
      header: "Título",
      cell: (post) => (
        <div className="min-w-0 space-y-1">
          <div className="font-medium">{post.title}</div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.map((tag) => (
                <Badge key={tag.uuid} variant="default" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 sm:hidden">
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
    {
      key: "actions",
      header: "Ações",
      cell: (post) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" asChild>
            <Link to={`/admin/posts/${post.uuid}/edit`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setPostToDelete(post);
              setDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
      className: "w-24 text-right",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Posts</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie os posts do seu blog
            </p>
          </div>
          <Button asChild>
            <Link to="/admin/posts/new">
              <Plus className="mr-2 h-4 w-4" />
              Criar Novo Post
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="published">Publicado</SelectItem>
              <SelectItem value="draft">Rascunho</SelectItem>
            </SelectContent>
          </Select>
          <Select value={tagFilter} onValueChange={setTagFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as tags</SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag.uuid} value={tag.slug}>
                  {tag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DataTable
          data={posts}
          columns={columns}
          loading={loading}
          emptyMessage="Nenhum post encontrado."
        />

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Próxima
            </Button>
          </div>
        )}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o post &quot;{postToDelete?.title}&quot;?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeletePost}
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
