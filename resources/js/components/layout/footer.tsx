export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-card text-card-foreground border-border border-t">
            <div className="container mx-auto max-w-7xl px-4 py-12">
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div className="flex flex-col items-center gap-2 md:items-start">
                        <span className="from-primary to-secondary bg-linear-to-r bg-clip-text text-xl font-bold text-transparent">
                            BroderLab
                        </span>
                        <p className="text-muted-foreground text-sm">
                            © {currentYear} Todos os direitos reservados.
                        </p>
                    </div>
                    <div className="flex gap-6">
                        <a
                            href="#"
                            className="text-muted-foreground hover:text-primary text-sm underline-offset-2 hover:underline"
                        >
                            Sobre
                        </a>
                        <a
                            href="#"
                            className="text-muted-foreground hover:text-primary text-sm underline-offset-2 hover:underline"
                        >
                            Contato
                        </a>
                        <a
                            href="#"
                            className="text-muted-foreground hover:text-primary text-sm underline-offset-2 hover:underline"
                        >
                            Termos
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
