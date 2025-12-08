import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

type Theme = "light" | "dark" | "system";

type ThemeContextType = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    actualTheme: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = {
    children: ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
};

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "tech-blog-theme",
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(() => {
        const stored = localStorage.getItem(storageKey);
        return (stored as Theme) || defaultTheme;
    });

    const [actualTheme, setActualTheme] = useState<"light" | "dark">(() => {
        if (theme === "system") {
            return window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";
        }
        return theme;
    });

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove("light", "dark");

        let currentTheme: "light" | "dark";

        if (theme === "system") {
            const systemTheme = window.matchMedia(
                "(prefers-color-scheme: dark)",
            ).matches
                ? "dark"
                : "light";

            root.classList.add(systemTheme);
            root.style.colorScheme = systemTheme;
            setActualTheme(systemTheme);
            currentTheme = systemTheme;
        } else {
            root.classList.add(theme);
            root.style.colorScheme = theme;
            setActualTheme(theme);
            currentTheme = theme;
        }

        const metaThemeColor = document.querySelector(
            'meta[name="theme-color"]',
        );
        if (metaThemeColor) {
            metaThemeColor.setAttribute(
                "content",
                currentTheme === "dark" ? "#000000" : "#f2f0e4",
            );
        }
    }, [theme]);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleChange = () => {
            if (theme === "system") {
                const systemTheme = mediaQuery.matches ? "dark" : "light";
                const root = window.document.documentElement;
                root.classList.remove("light", "dark");
                root.classList.add(systemTheme);
                root.style.colorScheme = systemTheme;
                setActualTheme(systemTheme);

                const metaThemeColor = document.querySelector(
                    'meta[name="theme-color"]',
                );
                if (metaThemeColor) {
                    metaThemeColor.setAttribute(
                        "content",
                        systemTheme === "dark" ? "#000000" : "#f2f0e4",
                    );
                }
            }
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [theme]);

    const value = {
        theme,
        setTheme: (newTheme: Theme) => {
            localStorage.setItem(storageKey, newTheme);
            setTheme(newTheme);
        },
        actualTheme,
    };

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return context;
}
