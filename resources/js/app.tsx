import "@/css/app.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";
import { AuthProvider } from "@/contexts/auth-context";
import { ErrorBoundary } from "@/components/error-boundary";
import HomePage from "./pages/home";
import PostPage from "./pages/post-page";
import LoginPage from "./pages/login-page";
import SearchPage from "./pages/search-page";
import TagPage from "./pages/tag-page";
import NotFoundPage from "./pages/not-found";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/post/:uuid",
    element: <PostPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/tag/:slug",
    element: <TagPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/search",
    element: <SearchPage />,
    errorElement: <NotFoundPage />,
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
