import type { Role, User } from "@/@types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-context";
import { AdminLayout } from "@/layout/admin-layout";
import api from "@/services/api";
import { getAvatarUrl } from "@/utils/avatar";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { Key, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { DataTable, type DataTableColumn } from "./components/data-table";

dayjs.locale("pt-br");

const roleBadgeColors: Record<string, string> = {
    reader: "bg-gray-500",
    editor: "bg-blue-500",
    admin: "bg-orange-500",
    superadmin: "bg-red-500",
};

const roleLabels: Record<string, string> = {
    reader: "Leitor",
    editor: "Editor",
    admin: "Admin",
    superadmin: "Super Admin",
};

type CreateUserForm = {
    name: string;
    email: string;
    password: string;
    role: Exclude<Role, "superadmin">;
};

type EditUserForm = {
    name: string;
    email: string;
    role: Exclude<Role, "superadmin">;
};

export function UsersPage() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [createForm, setCreateForm] = useState<CreateUserForm>({
        name: "",
        email: "",
        password: "",
        role: "reader",
    });
    const [isCreating, setIsCreating] = useState(false);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [editForm, setEditForm] = useState<EditUserForm>({
        name: "",
        email: "",
        role: "reader",
    });
    const [isEditing, setIsEditing] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [resetPasswordDialogOpen, setResetPasswordDialogOpen] =
        useState(false);
    const [userToResetPassword, setUserToResetPassword] = useState<User | null>(
        null,
    );
    const [newPassword, setNewPassword] = useState("");
    const [isResettingPassword, setIsResettingPassword] = useState(false);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, roleFilter]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                if (searchQuery) params.append("q", searchQuery);
                if (roleFilter !== "all") params.append("role", roleFilter);
                params.append("page", currentPage.toString());

                const response = await api.get<{
                    data: User[];
                    meta: { last_page: number };
                }>(`/admin/users?${params.toString()}`);
                setUsers(response.data.data);
                setTotalPages(response.data.meta.last_page);
            } catch {
                toast.error("Erro ao carregar usuários");
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchUsers();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, roleFilter, currentPage]);

    const handleCreateUser = async (e: FormEvent) => {
        e.preventDefault();

        if (!createForm.name || !createForm.email || !createForm.password) {
            toast.error("Preencha todos os campos");
            return;
        }

        if (createForm.password.length < 8) {
            toast.error("A senha deve ter pelo menos 8 caracteres");
            return;
        }

        try {
            setIsCreating(true);
            const response = await api.post<{ data: User }>(
                "/admin/users",
                createForm,
            );
            setUsers(prev => [...prev, response.data.data]);
            setCreateDialogOpen(false);
            setCreateForm({
                name: "",
                email: "",
                password: "",
                role: "reader",
            });
            toast.success("Usuário criado com sucesso!");
        } catch {
            toast.error("Erro ao criar usuário");
        } finally {
            setIsCreating(false);
        }
    };

    const openEditDialog = (user: User) => {
        setUserToEdit(user);
        setEditForm({
            name: user.name,
            email: user.email,
            role: user.role === "superadmin" ? "admin" : user.role,
        });
        setEditDialogOpen(true);
    };

    const handleEditUser = async (e: FormEvent) => {
        e.preventDefault();
        if (!userToEdit) return;

        if (!editForm.name || !editForm.email) {
            toast.error("Preencha todos os campos");
            return;
        }

        try {
            setIsEditing(true);
            const response = await api.put<{ data: User }>(
                `/admin/users/${userToEdit.uuid}`,
                editForm,
            );
            setUsers(prev =>
                prev.map(u =>
                    u.uuid === userToEdit.uuid ? response.data.data : u,
                ),
            );
            setEditDialogOpen(false);
            setUserToEdit(null);
            toast.success("Usuário atualizado com sucesso!");
        } catch {
            toast.error("Erro ao atualizar usuário");
        } finally {
            setIsEditing(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            setIsDeleting(true);
            await api.delete(`/admin/users/${userToDelete.uuid}`);
            setUsers(prev => prev.filter(u => u.uuid !== userToDelete.uuid));
            setDeleteDialogOpen(false);
            setUserToDelete(null);
            toast.success("Usuário excluído com sucesso!");
        } catch {
            toast.error("Erro ao excluir usuário");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleResetPassword = async (e: FormEvent) => {
        e.preventDefault();
        if (!userToResetPassword) return;

        if (!newPassword || newPassword.length < 8) {
            toast.error("A senha deve ter pelo menos 8 caracteres");
            return;
        }

        try {
            setIsResettingPassword(true);
            await api.put(`/admin/users/${userToResetPassword.uuid}/password`, {
                password: newPassword,
            });
            setResetPasswordDialogOpen(false);
            setUserToResetPassword(null);
            setNewPassword("");
            toast.success("Senha resetada com sucesso!");
        } catch {
            toast.error("Erro ao resetar senha");
        } finally {
            setIsResettingPassword(false);
        }
    };

    const columns: DataTableColumn<User>[] = [
        {
            key: "avatar",
            header: "",
            cell: user => (
                <Avatar className="h-10 w-10">
                    <AvatarImage
                        src={getAvatarUrl(user.name, user.avatar)}
                        alt={user.name}
                    />
                    <AvatarFallback>
                        {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            ),
            className: "w-14",
        },
        {
            key: "name",
            header: "Nome",
            cell: user => (
                <div className="min-w-0">
                    <p className="truncate font-medium">{user.name}</p>
                    <p className="text-muted-foreground truncate text-sm">
                        {user.email}
                    </p>
                </div>
            ),
            className: "max-w-[100px]",
        },
        {
            key: "role",
            header: "Role",
            cell: user => (
                <Badge className={`text-white ${roleBadgeColors[user.role]}`}>
                    {roleLabels[user.role]}
                </Badge>
            ),
            className: "hidden sm:table-cell",
        },
        {
            key: "created_at",
            header: "Criado em",
            cell: user =>
                user.created_at
                    ? dayjs(user.created_at).format("DD/MM/YYYY")
                    : "-",
            className: "hidden md:table-cell",
        },
        {
            key: "actions",
            header: "Ações",
            cell: user => (
                <div className="flex items-center gap-1">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditDialog(user)}
                        disabled={user.role === "superadmin"}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                            setUserToResetPassword(user);
                            setResetPasswordDialogOpen(true);
                        }}
                        disabled={user.role === "superadmin"}
                    >
                        <Key className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                            setUserToDelete(user);
                            setDeleteDialogOpen(true);
                        }}
                        disabled={
                            user.uuid === currentUser?.uuid ||
                            user.role === "superadmin"
                        }
                    >
                        <Trash2 className="text-destructive h-4 w-4" />
                    </Button>
                </div>
            ),
            className: "w-32 text-right",
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Usuários</h1>
                        <p className="text-muted-foreground mt-2">
                            Gerencie os usuários do sistema
                        </p>
                    </div>
                    <Button onClick={() => setCreateDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Usuário
                    </Button>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                            placeholder="Buscar usuários..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas as roles</SelectItem>
                            <SelectItem value="reader">Leitor</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="superadmin">
                                Super Admin
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <DataTable
                    data={users}
                    columns={columns}
                    loading={loading}
                    emptyMessage="Nenhum usuário encontrado."
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
                        <DialogTitle>Novo Usuário</DialogTitle>
                        <DialogDescription>
                            Preencha os dados para criar um novo usuário
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateUser} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="create-name">Nome</Label>
                            <Input
                                id="create-name"
                                value={createForm.name}
                                onChange={e =>
                                    setCreateForm({
                                        ...createForm,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="Nome do usuário"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-email">Email</Label>
                            <Input
                                id="create-email"
                                type="email"
                                value={createForm.email}
                                onChange={e =>
                                    setCreateForm({
                                        ...createForm,
                                        email: e.target.value,
                                    })
                                }
                                placeholder="email@exemplo.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-password">Senha</Label>
                            <Input
                                id="create-password"
                                type="password"
                                value={createForm.password}
                                onChange={e =>
                                    setCreateForm({
                                        ...createForm,
                                        password: e.target.value,
                                    })
                                }
                                placeholder="Mínimo 8 caracteres"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-role">Role</Label>
                            <Select
                                value={createForm.role}
                                onValueChange={(
                                    value: Exclude<Role, "superadmin">,
                                ) =>
                                    setCreateForm({
                                        ...createForm,
                                        role: value,
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="reader">
                                        Leitor
                                    </SelectItem>
                                    <SelectItem value="editor">
                                        Editor
                                    </SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
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
                        <DialogTitle>Editar Usuário</DialogTitle>
                        <DialogDescription>
                            Atualize os dados do usuário
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditUser} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Nome</Label>
                            <Input
                                id="edit-name"
                                value={editForm.name}
                                onChange={e =>
                                    setEditForm({
                                        ...editForm,
                                        name: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-email">Email</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={editForm.email}
                                onChange={e =>
                                    setEditForm({
                                        ...editForm,
                                        email: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-role">Role</Label>
                            <Select
                                value={editForm.role}
                                onValueChange={(
                                    value: Exclude<Role, "superadmin">,
                                ) => setEditForm({ ...editForm, role: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="reader">
                                        Leitor
                                    </SelectItem>
                                    <SelectItem value="editor">
                                        Editor
                                    </SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
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
                            Tem certeza que deseja excluir o usuário &quot;
                            {userToDelete?.name}
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
                            onClick={handleDeleteUser}
                            disabled={isDeleting}
                        >
                            {isDeleting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Excluir
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={resetPasswordDialogOpen}
                onOpenChange={setResetPasswordDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Resetar Senha</DialogTitle>
                        <DialogDescription>
                            Digite a nova senha para o usuário &quot;
                            {userToResetPassword?.name}
                            &quot;
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-password">Nova Senha</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                placeholder="Mínimo 8 caracteres"
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setResetPasswordDialogOpen(false);
                                    setNewPassword("");
                                }}
                                disabled={isResettingPassword}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isResettingPassword}
                            >
                                {isResettingPassword && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Resetar
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
