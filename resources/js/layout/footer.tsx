import { Link } from "react-router-dom";
import Logo from "../../assets/logo.svg?react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-card text-card-foreground border-border border-t">
            <div className="container mx-auto max-w-7xl px-4 py-12">
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div className="flex flex-col items-center gap-2 md:items-start">
                        <Logo className="text-foreground h-6" />
                        <p className="text-muted-foreground text-sm">
                            © {currentYear} Todos os direitos reservados.
                        </p>
                    </div>
                    <div className="flex gap-6">
                        <a
                            href="https://devbroder.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary text-sm underline-offset-2 hover:underline"
                        >
                            DevBroder®
                        </a>
                        <Link
                            to="/terms"
                            className="text-muted-foreground hover:text-primary text-sm underline-offset-2 hover:underline"
                        >
                            Termos de Uso
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
