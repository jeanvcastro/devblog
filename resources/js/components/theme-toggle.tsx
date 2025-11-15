import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
    const { theme, setTheme, actualTheme } = useTheme();

    const toggleTheme = () => {
        if (theme === "system") {
            setTheme(actualTheme === "dark" ? "light" : "dark");
        } else {
            setTheme(theme === "dark" ? "light" : "dark");
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className="bg-black text-white/60 hover:bg-white/10 hover:text-white/60"
            onClick={toggleTheme}
        >
            {actualTheme === "dark" ? (
                <Sun className="h-5 w-5" />
            ) : (
                <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Alternar tema</span>
        </Button>
    );
}
