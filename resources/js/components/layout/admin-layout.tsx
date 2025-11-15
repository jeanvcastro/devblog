import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/auth-context";
import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";

type AdminLayoutProps = {
    children: ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);

    const isActive = (path: string) => {
        return location.pathname === path
            ? "bg-primary text-primary-foreground"
            : "hover:bg-accent";
    };

    const NavLinks = () => (
        <>
            <Link
                to="/admin/dashboard"
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive("/admin/dashboard")}`}
                onClick={() => setOpen(false)}
            >
                Dashboard
            </Link>
            <Link
                to="/admin/posts"
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive("/admin/posts")}`}
                onClick={() => setOpen(false)}
            >
                Posts
            </Link>
            <Link
                to="/admin/comments"
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive("/admin/comments")}`}
                onClick={() => setOpen(false)}
            >
                Comentários
            </Link>
            <Link
                to="/admin/analytics"
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive("/admin/analytics")}`}
                onClick={() => setOpen(false)}
            >
                Analytics
            </Link>
        </>
    );

    return (
        <div className="flex min-h-screen">
            <aside className="border-border bg-card hidden w-64 border-r lg:block">
                <div className="border-border flex h-16 items-center border-b px-6">
                    <Link to="/admin/dashboard">
                        <span className="text-primary text-xl font-bold">
                            TechBlog Admin
                        </span>
                    </Link>
                </div>

                <nav className="space-y-1 p-4">
                    <NavLinks />
                </nav>
            </aside>

            <div className="flex flex-1 flex-col">
                <header className="border-border bg-background flex h-16 items-center justify-between border-b px-4 lg:px-6">
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
                                        <span className="text-primary text-xl font-bold">
                                            TechBlog Admin
                                        </span>
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
                        <div className="hidden items-center gap-2 sm:flex">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.avatar || undefined} />
                                <AvatarFallback>
                                    {user?.name?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-muted-foreground text-sm">
                                {user?.name}
                            </span>
                        </div>
                        <ThemeToggle />
                        <Link
                            to="/"
                            className="hover:text-primary text-sm font-medium transition-colors"
                        >
                            Ver Site
                        </Link>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => logout()}
                        >
                            Sair
                        </Button>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
