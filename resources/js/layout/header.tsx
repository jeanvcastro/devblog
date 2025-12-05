import { ThemeToggle } from "@/components/common/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export function Header() {
    const { user, isAuthenticated, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === "/") return location.pathname === "/";
        return location.pathname.startsWith(path);
    };

    return (
        <header className="bg-card text-card-foreground border-border sticky top-0 z-50 w-full border-b">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center">
                            <span className="from-primary to-secondary bg-linear-to-r bg-clip-text text-2xl font-bold text-transparent">
                                Devbroder Lab
                            </span>
                        </Link>

                        <nav className="hidden items-center gap-6 md:flex">
                            <Link
                                to="/"
                                className={
                                    isActive("/")
                                        ? "border-primary text-primary border-b text-sm font-medium"
                                        : "text-foreground hover:text-primary text-sm font-medium"
                                }
                            >
                                Home
                            </Link>
                            <Link
                                to="/posts"
                                className={
                                    isActive("/posts")
                                        ? "border-primary text-primary border-b text-sm font-medium"
                                        : "text-foreground hover:text-primary text-sm font-medium"
                                }
                            >
                                Artigos
                            </Link>
                            {user?.is_admin && (
                                <Link
                                    to="/admin/dashboard"
                                    className={
                                        isActive("/admin")
                                            ? "border-primary text-primary border-b text-sm font-medium"
                                            : "text-foreground hover:text-primary text-sm font-medium"
                                    }
                                >
                                    Dashboard
                                </Link>
                            )}
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        <div className="hidden items-center gap-4 md:flex">
                            {isAuthenticated ? (
                                <>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="ring-background h-8 w-8 ring-2">
                                            <AvatarImage
                                                src={user?.avatar || undefined}
                                                alt={user?.name}
                                            />
                                            <AvatarFallback className="bg-primary text-primary-foreground">
                                                {user?.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-muted-foreground text-sm">
                                            {user?.name}
                                        </span>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => logout()}
                                        className="hover:text-primary"
                                    >
                                        Sair
                                    </Button>
                                </>
                            ) : (
                                <Button asChild>
                                    <Link to="/login">Login</Link>
                                </Button>
                            )}
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </Button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <nav className="border-border flex flex-col items-center gap-4 border-t py-6 md:hidden">
                        <Link
                            to="/"
                            className={
                                isActive("/")
                                    ? "border-primary text-primary border-b text-sm font-medium"
                                    : "text-foreground hover:text-primary text-sm font-medium"
                            }
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/posts"
                            className={
                                isActive("/posts")
                                    ? "border-primary text-primary border-b text-sm font-medium"
                                    : "text-foreground hover:text-primary text-sm font-medium"
                            }
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Artigos
                        </Link>
                        {user?.is_admin && (
                            <Link
                                to="/admin/dashboard"
                                className={
                                    isActive("/admin")
                                        ? "border-primary text-primary border-b text-sm font-medium"
                                        : "text-foreground hover:text-primary text-sm font-medium"
                                }
                            >
                                Dashboard
                            </Link>
                        )}
                        {isAuthenticated ? (
                            <Button
                                size="sm"
                                onClick={() => {
                                    logout();
                                    setMobileMenuOpen(false);
                                }}
                                className="hover:text-primary"
                            >
                                Sair
                            </Button>
                        ) : (
                            <Button size="sm" asChild>
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                            </Button>
                        )}
                    </nav>
                )}
            </div>
        </header>
    );
}
