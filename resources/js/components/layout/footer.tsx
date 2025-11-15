export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-border border-t-2 bg-black">
            <div className="container mx-auto max-w-7xl px-4 py-12">
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div className="flex flex-col items-center gap-2 md:items-start">
                        <span className="from-primary to-secondary bg-linear-to-r bg-clip-text text-xl font-bold text-transparent">
                            DevBlog
                        </span>
                        <p className="text-sm text-white/60">
                            © {currentYear} Todos os direitos reservados.
                        </p>
                    </div>
                    <div className="flex gap-6">
                        <a
                            href="#"
                            className="hover:text-primary text-sm text-white/60 transition-colors"
                        >
                            Sobre
                        </a>
                        <a
                            href="#"
                            className="hover:text-primary text-sm text-white/60 transition-colors"
                        >
                            Contato
                        </a>
                        <a
                            href="#"
                            className="hover:text-primary text-sm text-white/60 transition-colors"
                        >
                            Termos
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
