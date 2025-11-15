import "@/css/app.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";
import { AuthProvider } from "@/contexts/auth-context";
import HomePage from "./pages/home";
import PostPage from "./pages/post-page";
import LoginPage from "./pages/login-page";
import SearchPage from "./pages/search-page";
import TagPage from "./pages/tag-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/post/:uuid",
    element: <PostPage />,
  },
  {
    path: "/tag/:slug",
    element: <TagPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/search",
    element: <SearchPage />,
  },
]);

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
