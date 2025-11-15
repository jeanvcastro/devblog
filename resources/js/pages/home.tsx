import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";

export default function HomePage() {
    return (
        <Layout>
            <div className="container mx-auto max-w-7xl px-4">
                <section className="py-20 text-center">
                    <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
                        Bem-vindo ao{" "}
                        <span className="from-primary to-secondary bg-gradient-to-r bg-clip-text text-transparent">
                            TechBlog
                        </span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/80">
                        Artigos técnicos sobre desenvolvimento de software,
                        arquitetura, performance e muito mais.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <Button size="lg">Explorar Artigos</Button>
                        <Button variant="outline" size="lg">
                            Sobre o Blog
                        </Button>
                    </div>
                </section>
            </div>
        </Layout>
    );
}
