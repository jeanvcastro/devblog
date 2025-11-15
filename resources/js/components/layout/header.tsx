import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function Header() {
    const { user, isAuthenticated, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="border-border sticky top-0 z-50 w-full border-b-2 bg-black">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center">
                            <span className="from-primary to-secondary bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent">
                                DevBlog
                            </span>
                        </Link>

                        <nav className="hidden items-center gap-6 md:flex">
                            <Link
                                to="/"
                                className="hover:text-primary text-sm font-medium text-white/60 transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                to="/search"
                                className="hover:text-primary text-sm font-medium text-white/60 transition-colors"
                            >
                                Artigos
                            </Link>
                            {user?.is_admin && (
                                <Link
                                    to="/admin/dashboard"
                                    className="hover:text-primary text-sm font-medium text-white/60 transition-colors"
                                >
                                    Dashboard
                                </Link>
                            )}
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle className="bg-black text-white/60 hover:bg-white/10 hover:text-white/60" />

                        <div className="hidden items-center gap-4 md:flex">
                            {isAuthenticated ? (
                                <>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
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
                                        <span className="text-sm text-white/60">
                                            {user?.name}
                                        </span>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => logout()}
                                        className="hover:text-primary cursor-pointer bg-black text-white/60 hover:bg-white/10"
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
                            className="bg-black text-white/60 hover:bg-white/10 hover:text-white/60 md:hidden"
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
                    <nav className="flex flex-col items-center gap-4 border-t border-black py-6 md:hidden">
                        <Link
                            to="/"
                            className="hover:text-primary text-sm font-medium text-white/60 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/search"
                            className="hover:text-primary text-sm font-medium text-white/60 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Artigos
                        </Link>
                        {user?.is_admin && (
                            <Link
                                to="/admin/dashboard"
                                className="hover:text-primary text-sm font-medium text-white/60 transition-colors"
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
                                className="hover:text-primary text-white/60"
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
