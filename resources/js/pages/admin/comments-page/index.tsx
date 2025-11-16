import { AdminLayout } from "@/layout/admin-layout";
import { CommentModerator } from "./components/comment-moderator";
import type { Comment } from "@/@types";
import api from "@/services/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
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
import { Button } from "@/components/ui/button";

interface CommentWithPost extends Comment {
  post?: {
    uuid: string;
    title: string;
  };
}

export function CommentsPage() {
  const [comments, setComments] = useState<CommentWithPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("pending");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);

        const response = await api.get<CommentWithPost[]>("/admin/comments", {
          params: {
            filter,
          },
        });

        setComments(response.data);
      } catch (error) {
        console.error("Erro ao carregar comentários:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [filter]);

  const handleApprove = async (uuid: string) => {
    try {
      await api.put(`/comments/${uuid}/approve`);

      if (filter === "pending") {
        setComments((prev) => prev.filter((comment) => comment.uuid !== uuid));
      } else {
        setComments((prev) =>
          prev.map((comment) =>
            comment.uuid === uuid ? { ...comment, approved: true } : comment
          )
        );
      }

      toast.success("Comentário aprovado com sucesso!");
    } catch (error) {
      console.error("Erro ao aprovar comentário:", error);
      toast.error("Erro ao aprovar comentário");
    }
  };

  const handleReject = async (uuid: string) => {
    try {
      await api.put(`/comments/${uuid}/reject`);

      if (filter === "approved" || filter === "pending") {
        setComments((prev) => prev.filter((comment) => comment.uuid !== uuid));
      } else {
        setComments((prev) =>
          prev.map((comment) =>
            comment.uuid === uuid ? { ...comment, approved: false } : comment
          )
        );
      }

      toast.success("Comentário reprovado com sucesso!");
    } catch (error) {
      console.error("Erro ao rejeitar comentário:", error);
      toast.error("Erro ao reprovar comentário");
    }
  };

  const handleDelete = (uuid: string) => {
    setCommentToDelete(uuid);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!commentToDelete) return;

    try {
      setIsDeleting(true);
      await api.delete(`/comments/${commentToDelete}`);
      setComments((prev) =>
        prev.filter((comment) => comment.uuid !== commentToDelete)
      );
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
      toast.success("Comentário excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir comentário:", error);
      toast.error("Erro ao excluir comentário");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Moderação de Comentários</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie e modere os comentários do blog
            </p>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="approved">Aprovados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">Carregando comentários...</p>
          </div>
        ) : (
          <CommentModerator
            comments={comments}
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete}
            isLoading={isDeleting}
          />
        )}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este comentário? Esta ação não
              pode ser desfeita.
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
              onClick={confirmDelete}
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
