import { ThemeToggle } from "@/components/common/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/auth-context";
import { getAvatarUrl } from "@/utils/avatar";
import {
    BarChart3,
    ChevronDown,
    ExternalLink,
    FileText,
    Image,
    LayoutDashboard,
    LogOut,
    MessageSquare,
    User,
    Users,
} from "lucide-react";
import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/logo.svg?react";

type AdminLayoutProps = {
    children: ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
    const location = useLocation();
    const { user, logout, canApproveComments, canManageUsers } = useAuth();
    const [open, setOpen] = useState(false);

    const isActive = (path: string) => {
        return location.pathname === path
            ? "bg-primary text-primary-foreground"
            : "hover:bg-accent";
    };

    const NavLinks = () => (
        <>
            {canApproveComments && (
                <Link
                    to="/admin/dashboard"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${isActive("/admin/dashboard")}`}
                    onClick={() => setOpen(false)}
                >
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard
                </Link>
            )}
            {canManageUsers && (
                <Link
                    to="/admin/users"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${isActive("/admin/users")}`}
                    onClick={() => setOpen(false)}
                >
                    <Users className="h-5 w-5" />
                    Usuários
                </Link>
            )}
            <Link
                to="/admin/posts"
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${isActive("/admin/posts")}`}
                onClick={() => setOpen(false)}
            >
                <FileText className="h-5 w-5" />
                Posts
            </Link>
            {canApproveComments && (
                <>
                    <Link
                        to="/admin/comments"
                        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${isActive("/admin/comments")}`}
                        onClick={() => setOpen(false)}
                    >
                        <MessageSquare className="h-5 w-5" />
                        Comentários
                    </Link>
                    <Link
                        to="/admin/media"
                        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${isActive("/admin/media")}`}
                        onClick={() => setOpen(false)}
                    >
                        <Image className="h-5 w-5" />
                        Mídia
                    </Link>
                    <Link
                        to="/admin/analytics"
                        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${isActive("/admin/analytics")}`}
                        onClick={() => setOpen(false)}
                    >
                        <BarChart3 className="h-5 w-5" />
                        Analytics
                    </Link>
                </>
            )}
            <div className="border-border my-2 border-t" />
            <a
                href="/"
                className="text-muted-foreground hover:text-foreground flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium"
                onClick={() => setOpen(false)}
            >
                <ExternalLink className="h-5 w-5" />
                Blog
            </a>
        </>
    );

    return (
        <div className="flex min-h-screen">
            <aside className="border-border bg-card hidden w-64 border-r lg:block">
                <div className="flex h-16 items-center px-6">
                    <Link to="/admin/dashboard">
                        <Logo className="h-6 text-black dark:text-white" />
                    </Link>
                </div>

                <nav className="space-y-1 p-4">
                    <NavLinks />
                </nav>
            </aside>

            <div className="flex flex-1 flex-col">
                <header className="border-border bg-card flex h-16 items-center justify-between border-b px-4 lg:px-6">
                    <div className="flex items-center gap-4">
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="lg:hidden"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="4" x2="20" y1="12" y2="12" />
                                        <line x1="4" x2="20" y1="6" y2="6" />
                                        <line x1="4" x2="20" y1="18" y2="18" />
                                    </svg>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-64 p-0">
                                <div className="border-border flex h-16 items-center border-b px-6">
                                    <Link
                                        to="/admin/dashboard"
                                        onClick={() => setOpen(false)}
                                    >
                                        <Logo className="h-6 text-black dark:text-white" />
                                    </Link>
                                </div>
                                <nav className="space-y-1 p-4">
                                    <NavLinks />
                                </nav>
                            </SheetContent>
                        </Sheet>
                        <h1 className="text-lg font-semibold">Admin Panel</h1>
                    </div>
                    <div className="flex items-center gap-2 lg:gap-4">
                        <ThemeToggle />
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="flex h-12 items-center gap-2"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src={
                                                user
                                                    ? getAvatarUrl(
                                                          user.name,
                                                          user.avatar,
                                                      )
                                                    : undefined
                                            }
                                        />
                                        <AvatarFallback>
                                            {user?.name
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-muted-foreground hidden text-sm sm:inline">
                                        {user?.name}
                                    </span>
                                    <ChevronDown className="text-muted-foreground h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="end" className="w-48 p-2">
                                <Link
                                    to="/admin/profile"
                                    className="hover:bg-accent flex items-center gap-2 rounded-md px-3 py-2 text-sm"
                                >
                                    <User className="h-4 w-4" />
                                    Meu Perfil
                                </Link>
                                <button
                                    onClick={() => logout()}
                                    className="hover:bg-accent flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-500"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sair
                                </button>
                            </PopoverContent>
                        </Popover>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
