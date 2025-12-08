import { AdminLayout } from "@/layout/admin-layout";
import { PostEditor, PostFormData } from "./components/post-editor";
import type { Post, Tag } from "@/@types";
import { useAuth } from "@/contexts/auth-context";
import api from "@/services/api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export function PostsEditPage() {
    const { isAdmin, isSuperAdmin } = useAuth();
    const { uuid } = useParams<{ uuid: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const navigate = useNavigate();
    const canPublish = isAdmin || isSuperAdmin;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsFetching(true);

                const [postRes, tagsRes] = await Promise.all([
                    api.get<Post>(`/posts/${uuid}`),
                    api.get<Tag[]>("/tags"),
                ]);

                setPost(postRes.data);
                setTags(tagsRes.data);
            } catch (error) {
                console.error("Erro ao carregar post:", error);
                navigate("/admin/posts");
            } finally {
                setIsFetching(false);
            }
        };

        if (uuid) {
            fetchData();
        }
    }, [uuid, navigate]);

    const handleSave = async (data: PostFormData) => {
        if (!uuid) return;

        try {
            setIsLoading(true);

            await api.put(`/posts/${uuid}`, {
                title: data.title,
                slug: data.slug,
                excerpt: data.excerpt,
                content: data.content,
                status: data.status,
                published_at: data.published_at,
                tags: data.tags,
                reading_time: data.reading_time,
            });

            toast.success("Post atualizado com sucesso!");
            navigate("/admin/posts");
        } catch (error) {
            console.error("Erro ao atualizar post:", error);
            toast.error("Erro ao atualizar post");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate("/admin/posts");
    };

    if (isFetching) {
        return (
            <AdminLayout>
                <div className="flex h-96 items-center justify-center">
                    <p className="text-muted-foreground">Carregando post...</p>
                </div>
            </AdminLayout>
        );
    }

    if (!post) {
        return (
            <AdminLayout>
                <div className="flex h-96 items-center justify-center">
                    <p className="text-muted-foreground">
                        Post não encontrado.
                    </p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Editar Post</h1>
                    <p className="text-muted-foreground mt-2">
                        Edite e atualize o artigo
                    </p>
                </div>

                <PostEditor
                    initialData={{
                        title: post.title,
                        slug: post.slug,
                        excerpt: post.excerpt,
                        content: post.content,
                        status: post.status,
                        published_at: post.published_at,
                        tags: post.tags?.map(tag => tag.uuid) || [],
                        reading_time: post.reading_time,
                    }}
                    availableTags={tags}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isLoading={isLoading}
                    canPublish={canPublish}
                />
            </div>
        </AdminLayout>
    );
}
