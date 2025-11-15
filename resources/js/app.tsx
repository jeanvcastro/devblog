import "@/css/app.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";
import { AuthProvider } from "@/contexts/auth-context";
import { ErrorBoundary } from "@/components/error-boundary";
import { ProtectedRoute } from "@/components/protected-route";
import HomePage from "./pages/home";
import PostPage from "./pages/post-page";
import LoginPage from "./pages/login-page";
import SearchPage from "./pages/search-page";
import TagPage from "./pages/tag-page";
import ErrorPage from "./pages/error-page";
import NotFoundPage from "./pages/not-found";
import { DashboardPage } from "./pages/admin/dashboard-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/post/:uuid",
    element: <PostPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/tag/:slug",
    element: <TagPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/search",
    element: <SearchPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute requireAdmin>
        <DashboardPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
