import { ErrorBoundary } from "@/components/common/error-boundary";
import { PageLoader } from "@/components/common/page-loader";
import { ProtectedRoute } from "@/components/common/protected-route";
import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/contexts/theme-context";
import "@/css/app.css";
import { lazy, ReactNode, Suspense } from "react";

console.log(`
%c
    ____             ____                  __
   / __ \\___  _   __/ __ )_________  ____/ /__  _____
  / / / / _ \\| | / / __  / ___/ __ \\/ __  / _ \\/ ___/
 / /_/ /  __/| |/ / /_/ / /  / /_/ / /_/ /  __/ /
/_____/\\___/ |___/_____/_/   \\____/\\__,_/\\___/_/

%cO que você tá procurando aqui? 👀

Acesse %cdevbroder.com%c, lá tem os contatos. Bora trocar uma ideia!
`,
"color: #ff4800; font-weight: bold;",
"color: inherit; font-size: 14px;",
"color: #ff4800; font-weight: bold; font-size: 14px;",
"color: inherit; font-size: 14px;"
);
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const HomePage = lazy(() => import("./pages/home"));
const PostPage = lazy(() => import("./pages/post-page/index"));
const LoginPage = lazy(() => import("./pages/login-page"));
const PostsListPage = lazy(() => import("./pages/posts-page"));
const TagPage = lazy(() => import("./pages/tag-page"));
const TermsPage = lazy(() => import("./pages/terms-page"));
const ErrorPage = lazy(() => import("./pages/error-page"));
const NotFoundPage = lazy(() => import("./pages/not-found"));
const DashboardPage = lazy(() =>
    import("./pages/admin/dashboard-page").then(m => ({
        default: m.DashboardPage,
    })),
);
const PostsPage = lazy(() =>
    import("./pages/admin/posts-page").then(m => ({ default: m.PostsPage })),
);
const PostsNewPage = lazy(() =>
    import("./pages/admin/posts-new-page").then(m => ({
        default: m.PostsNewPage,
    })),
);
const PostsEditPage = lazy(() =>
    import("./pages/admin/posts-edit-page").then(m => ({
        default: m.PostsEditPage,
    })),
);
const CommentsPage = lazy(() =>
    import("./pages/admin/comments-page/index").then(m => ({
        default: m.CommentsPage,
    })),
);
const AnalyticsPage = lazy(() =>
    import("./pages/admin/analytics-page").then(m => ({
        default: m.AnalyticsPage,
    })),
);
const MediaPage = lazy(() =>
    import("./pages/admin/media-page").then(m => ({ default: m.MediaPage })),
);
const AdminProfilePage = lazy(() =>
    import("./pages/admin/profile-page").then(m => ({
        default: m.ProfilePage,
    })),
);
const ProfilePage = lazy(() => import("./pages/profile-page"));
const UsersPage = lazy(() =>
    import("./pages/admin/users-page").then(m => ({ default: m.UsersPage })),
);

const SuspenseWrapper = ({ children }: { children: ReactNode }) => (
    <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <SuspenseWrapper>
                <HomePage />
            </SuspenseWrapper>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/post/:uuid",
        element: (
            <SuspenseWrapper>
                <PostPage />
            </SuspenseWrapper>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/tag/:slug",
        element: (
            <SuspenseWrapper>
                <TagPage />
            </SuspenseWrapper>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/login",
        element: (
            <SuspenseWrapper>
                <LoginPage />
            </SuspenseWrapper>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/posts",
        element: (
            <SuspenseWrapper>
                <PostsListPage />
            </SuspenseWrapper>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/terms",
        element: (
            <SuspenseWrapper>
                <TermsPage />
            </SuspenseWrapper>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/admin/dashboard",
        element: (
            <SuspenseWrapper>
                <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                    <DashboardPage />
                </ProtectedRoute>
            </SuspenseWrapper>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/admin/posts",
        element: (
            <SuspenseWrapper>
                <ProtectedRoute allowedRoles={['editor', 'admin', 'superadmin']}>
                    <PostsPage />
                </ProtectedRoute>
            </SuspenseWrapper>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/admin/posts/new",
        element: (
            <SuspenseWrapper>
                <ProtectedRoute allowedRoles={['editor', 'admin', 'superadmin']}>
                    <PostsNewPage />
                </ProtectedRoute>
            </SuspenseWrapper>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/admin/posts/:uuid/edit",
        element: (
            <SuspenseWrapper>
                <ProtectedRoute allowedRoles={['editor', 'admin', 'superadmin']}>
                    <PostsEditPage />
                </ProtectedRoute>
            </SuspenseWrapper>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/admin/comments",
        element: (
            <SuspenseWrapper>
                <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                    <CommentsPage />
                </ProtectedRoute>
            </SuspenseWrapper>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/admin/analytics",
        element: (
            <SuspenseWrapper>
                <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                    <AnalyticsPage />
                </ProtectedRoute>
            </SuspenseWrapper>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/admin/media",
        element: (
            <SuspenseWrapper>
                <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                    <MediaPage />
                </ProtectedRoute>
            </SuspenseWrapper>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/profile",
        element: (
            <SuspenseWrapper>
                <ProtectedRoute>
                    <ProfilePage />
                </ProtectedRoute>
            </SuspenseWrapper>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/admin/profile",
        element: (
            <SuspenseWrapper>
                <ProtectedRoute allowedRoles={['editor', 'admin', 'superadmin']}>
                    <AdminProfilePage />
                </ProtectedRoute>
            </SuspenseWrapper>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/admin/users",
        element: (
            <SuspenseWrapper>
                <ProtectedRoute allowedRoles={['superadmin']}>
                    <UsersPage />
                </ProtectedRoute>
            </SuspenseWrapper>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "*",
        element: (
            <SuspenseWrapper>
                <NotFoundPage />
            </SuspenseWrapper>
        ),
    },
]);

const App = () => {
    return (
        <ErrorBoundary>
            <HelmetProvider>
                <ThemeProvider>
                    <AuthProvider>
                        <RouterProvider router={router} />
                        <Toaster position="top-right" />
                    </AuthProvider>
                </ThemeProvider>
            </HelmetProvider>
        </ErrorBoundary>
    );
};

export default App;
