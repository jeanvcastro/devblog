import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api, { tokenService } from "@/services/api";
import { User } from "@/@types";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  loginAdmin: (email: string, password: string) => Promise<void>;
  loginGoogle: () => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = tokenService.get();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get<User>("/auth/me");
        setUser(response.data);
      } catch (error) {
        tokenService.remove();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const loginAdmin = async (email: string, password: string) => {
    const response = await api.post<{ user: User; token: string }>(
      "/admin/login",
      { email, password }
    );
    tokenService.set(response.data.token);
    setUser(response.data.user);
  };

  const loginGoogle = () => {
    window.location.href = "/api/auth/google";
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      tokenService.remove();
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    loginAdmin,
    loginGoogle,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin ?? false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
