import { User } from "@/@types";
import api, { tokenService } from "@/services/api";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

type AuthContextType = {
    user: User | null;
    loading: boolean;
    loginAdmin: (email: string, password: string) => Promise<void>;
    loginGoogle: () => void;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    is_admin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
    children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleOAuthCallback = () => {
            const params = new URLSearchParams(window.location.search);
            const token = params.get('token');
            const userJson = params.get('user');

            if (token && userJson) {
                tokenService.set(token);
                setUser(JSON.parse(userJson));
                window.history.replaceState({}, '', '/');
                setLoading(false);
                return true;
            }
            return false;
        };

        const loadUser = async () => {
            if (handleOAuthCallback()) {
                return;
            }

            const token = tokenService.get();
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get<User>("/auth/me");
                setUser(response.data);
            } catch {
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
            { email, password },
        );
        tokenService.set(response.data.token);
        setUser(response.data.user);
    };

    const loginGoogle = () => {
        const params = new URLSearchParams(window.location.search);
        const utmParams = new URLSearchParams();

        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(key => {
            const value = params.get(key);
            if (value) utmParams.append(key, value);
        });

        const queryString = utmParams.toString();
        window.location.href = `/auth/google${queryString ? '?' + queryString : ''}`;
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
        is_admin: user?.is_admin ?? false,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}
