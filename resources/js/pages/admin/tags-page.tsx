import type { Tag } from "@/@types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminLayout } from "@/layout/admin-layout";
import api from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { DataTable, type DataTableColumn } from "./components/data-table";

const tagSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    slug: z.string().min(1, "Slug é obrigatório"),
});

type TagFormData = z.infer<typeof tagSchema>;

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function TagsPage() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [tagToEdit, setTagToEdit] = useState<Tag | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const {
        register: registerCreate,
        handleSubmit: handleSubmitCreate,
        reset: resetCreate,
        setValue: setCreateValue,
        watch: watchCreate,
        formState: { errors: createErrors, isSubmitting: isCreating },
    } = useForm<TagFormData>({
        resolver: zodResolver(tagSchema),
        defaultValues: { name: "", slug: "" },
    });

    const {
        register: registerEdit,
        handleSubmit: handleSubmitEdit,
        reset: resetEdit,
        setValue: setEditValue,
        watch: watchEdit,
        formState: { errors: editErrors, isSubmitting: isEditing },
    } = useForm<TagFormData>({
        resolver: zodResolver(tagSchema),
        defaultValues: { name: "", slug: "" },
    });

    const createName = watchCreate("name");
    const editName = watchEdit("name");

    useEffect(() => {
        if (createName && createDialogOpen) {
            setCreateValue("slug", generateSlug(createName));
        }
    }, [createName, createDialogOpen, setCreateValue]);

    useEffect(() => {
        if (editName && editDialogOpen && tagToEdit) {
            setEditValue("slug", generateSlug(editName));
        }
    }, [editName, editDialogOpen, tagToEdit, setEditValue]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                setLoading(true);

                const params = new URLSearchParams();
                if (searchQuery) params.append("q", searchQuery);
                params.append("page", currentPage.toString());

                const response = await api.get<{
                    data: Tag[];
                    last_page: number;
                }>(`/admin/tags?${params.toString()}`);

                setTags(response.data.data || []);
                setTotalPages(response.data.last_page || 1);
            } catch {
                toast.error("Erro ao carregar tags");
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchTags();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, currentPage]);

    const onCreateTag = async (data: TagFormData) => {
        try {
            const response = await api.post<Tag>("/tags", data);
            setTags(prev => [...prev, response.data]);
            setCreateDialogOpen(false);
            resetCreate();
            toast.success("Tag criada com sucesso!");
        } catch {
            toast.error("Erro ao criar tag");
        }
    };

    const openEditDialog = (tag: Tag) => {
        setTagToEdit(tag);
        resetEdit({
            name: tag.name,
            slug: tag.slug,
        });
        setEditDialogOpen(true);
    };

    const onEditTag = async (data: TagFormData) => {
        if (!tagToEdit) return;

        try {
            const response = await api.put<Tag>(`/tags/${tagToEdit.uuid}`, data);
            setTags(prev =>
                prev.map(t => (t.uuid === tagToEdit.uuid ? response.data : t)),
            );
            setEditDialogOpen(false);
            setTagToEdit(null);
            toast.success("Tag atualizada com sucesso!");
        } catch {
            toast.error("Erro ao atualizar tag");
        }
    };

    const handleDeleteTag = async () => {
        if (!tagToDelete) return;

        try {
            setIsDeleting(true);
            await api.delete(`/tags/${tagToDelete.uuid}`);
            setTags(prev => prev.filter(t => t.uuid !== tagToDelete.uuid));
            setDeleteDialogOpen(false);
            setTagToDelete(null);
            toast.success("Tag excluída com sucesso!");
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            const message =
                err.response?.data?.message || "Erro ao excluir tag";
            toast.error(message);
        } finally {
            setIsDeleting(false);
        }
    };

    const columns: DataTableColumn<Tag>[] = [
        {
            key: "name",
            header: "Nome",
            cell: tag => <span className="font-medium">{tag.name}</span>,
        },
        {
            key: "slug",
            header: "Slug",
            cell: tag => (
                <span className="text-muted-foreground font-mono text-sm">
                    {tag.slug}
                </span>
            ),
            className: "hidden sm:table-cell",
        },
        {
            key: "posts_count",
            header: "Posts",
            cell: tag => (
                <Badge variant="secondary">{tag.posts_count ?? 0} posts</Badge>
            ),
            className: "hidden md:table-cell",
        },
        {
            key: "actions",
            header: "Ações",
            cell: tag => (
                <div className="flex items-center gap-1">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditDialog(tag)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                            setTagToDelete(tag);
                            setDeleteDialogOpen(true);
                        }}
                        disabled={(tag.posts_count ?? 0) > 0}
                    >
                        <Trash2 className="text-destructive h-4 w-4" />
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
                        <h1 className="text-3xl font-bold">Tags</h1>
                        <p className="text-muted-foreground mt-2">
                            Gerencie as tags do blog
                        </p>
                    </div>
                    <Button onClick={() => setCreateDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Tag
                    </Button>
                </div>

                <div className="relative max-w-md">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                        placeholder="Buscar tags..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <DataTable
                    data={tags}
                    columns={columns}
                    loading={loading}
                    emptyMessage="Nenhuma tag encontrada."
                />

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() =>
                                setCurrentPage(p => Math.max(1, p - 1))
                            }
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </Button>
                        <span className="text-muted-foreground text-sm">
                            Página {currentPage} de {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setCurrentPage(p => Math.min(totalPages, p + 1))
                            }
                            disabled={currentPage === totalPages}
                        >
                            Próxima
                        </Button>
                    </div>
                )}
            </div>

            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nova Tag</DialogTitle>
                        <DialogDescription>
                            Preencha os dados para criar uma nova tag
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={handleSubmitCreate(onCreateTag)}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="create-name">Nome</Label>
                            <Input
                                id="create-name"
                                placeholder="Nome da tag"
                                aria-invalid={!!createErrors.name}
                                {...registerCreate("name")}
                            />
                            {createErrors.name && (
                                <p className="text-destructive text-sm">
                                    {createErrors.name.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-slug">Slug</Label>
                            <Input
                                id="create-slug"
                                placeholder="slug-da-tag"
                                aria-invalid={!!createErrors.slug}
                                {...registerCreate("slug")}
                            />
                            {createErrors.slug && (
                                <p className="text-destructive text-sm">
                                    {createErrors.slug.message}
                                </p>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCreateDialogOpen(false)}
                                disabled={isCreating}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isCreating}>
                                {isCreating && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Criar
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Tag</DialogTitle>
                        <DialogDescription>
                            Atualize os dados da tag
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={handleSubmitEdit(onEditTag)}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Nome</Label>
                            <Input
                                id="edit-name"
                                aria-invalid={!!editErrors.name}
                                {...registerEdit("name")}
                            />
                            {editErrors.name && (
                                <p className="text-destructive text-sm">
                                    {editErrors.name.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-slug">Slug</Label>
                            <Input
                                id="edit-slug"
                                aria-invalid={!!editErrors.slug}
                                {...registerEdit("slug")}
                            />
                            {editErrors.slug && (
                                <p className="text-destructive text-sm">
                                    {editErrors.slug.message}
                                </p>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditDialogOpen(false)}
                                disabled={isEditing}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isEditing}>
                                {isEditing && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Salvar
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar exclusão</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir a tag &quot;
                            {tagToDelete?.name}
                            &quot;? Esta ação não pode ser desfeita.
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
                            onClick={handleDeleteTag}
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
