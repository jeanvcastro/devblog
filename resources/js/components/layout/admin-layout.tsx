import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";

type AdminLayoutProps = {
  children: ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path
      ? "bg-primary text-primary-foreground"
      : "hover:bg-accent";
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-border bg-card">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link to="/admin/dashboard" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">TechBlog Admin</span>
          </Link>
        </div>

        <nav className="space-y-1 p-4">
          <Link
            to="/admin/dashboard"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive("/admin/dashboard")}`}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/posts"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive("/admin/posts")}`}
          >
            Posts
          </Link>
          <Link
            to="/admin/comments"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive("/admin/comments")}`}
          >
            Comentários
          </Link>
          <Link
            to="/admin/analytics"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive("/admin/analytics")}`}
          >
            Analytics
          </Link>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
          <h1 className="text-lg font-semibold">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-primary"
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

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
