import { ThemeToggle } from "@/components/common/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/contexts/auth-context";
import { getAvatarUrl } from "@/utils/avatar";
import { ChevronDown, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/logo.svg?react";

export function Header() {
    const { user, isAuthenticated, logout, canManagePosts } = useAuth();
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
                            <Logo className="h-6 text-black dark:text-white" />
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
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        <div className="hidden items-center md:flex">
                            {isAuthenticated ? (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="flex h-12 items-center gap-2 px-2"
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
                                                <AvatarFallback className="bg-primary text-primary-foreground">
                                                    {user?.name
                                                        ?.charAt(0)
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-muted-foreground text-sm">
                                                {user?.name}
                                            </span>
                                            <ChevronDown className="text-muted-foreground h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        align="end"
                                        className="w-48 p-2"
                                    >
                                        {canManagePosts && (
                                            <Link
                                                to="/admin/dashboard"
                                                className="hover:bg-accent flex items-center gap-2 rounded-md px-3 py-2 text-sm"
                                            >
                                                <LayoutDashboard className="h-4 w-4" />
                                                Dashboard
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => logout()}
                                            className="hover:bg-accent flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-500"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Sair
                                        </button>
                                    </PopoverContent>
                                </Popover>
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
                    <nav className="border-border flex flex-col gap-2 border-t py-4 md:hidden">
                        <Link
                            to="/"
                            className={`px-3 py-2 text-sm font-medium ${
                                isActive("/")
                                    ? "text-primary border-primary border-l-2"
                                    : "hover:text-primary"
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/posts"
                            className={`px-3 py-2 text-sm font-medium ${
                                isActive("/posts")
                                    ? "text-primary border-primary border-l-2"
                                    : "hover:text-primary"
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Artigos
                        </Link>
                        <div className="border-border my-2 border-t" />
                        {isAuthenticated ? (
                            <>
                                {canManagePosts && (
                                    <Link
                                        to="/admin/dashboard"
                                        className="hover:bg-accent rounded-md px-3 py-2 text-sm font-medium"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={() => {
                                        logout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="rounded-md px-3 py-2 text-left text-sm font-medium text-red-500"
                                >
                                    Sair
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="hover:bg-accent rounded-md px-3 py-2 text-sm font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Login
                            </Link>
                        )}
                    </nav>
                )}
            </div>
        </header>
    );
}
