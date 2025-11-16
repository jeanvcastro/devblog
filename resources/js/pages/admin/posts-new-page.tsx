import { AdminLayout } from "@/layout/admin-layout";
import { PostEditor, PostFormData } from "./components/post-editor";
import type { Tag } from "@/@types";
import api from "@/services/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function PostsNewPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleSave = async (data: PostFormData) => {
    try {
      setIsLoading(true);

      await api.post("/posts", {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        status: data.status,
        published_at: data.published_at,
        tags: data.tags,
        reading_time: data.reading_time,
      });

      toast.success("Post criado com sucesso!");
      navigate("/admin/posts");
    } catch (error) {
      console.error("Erro ao criar post:", error);
      toast.error("Erro ao criar post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/posts");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Criar Novo Post</h1>
          <p className="text-muted-foreground mt-2">
            Escreva e publique um novo artigo
          </p>
        </div>

        <PostEditor
          availableTags={tags}
          onSave={handleSave}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </AdminLayout>
  );
}
