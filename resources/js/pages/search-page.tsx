import SearchIllustration from "@/assets/search.svg";
import { Layout } from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchPage() {
    const [query, setQuery] = useState("");

    return (
        <Layout>
            <div className="container mx-auto max-w-7xl px-4 py-12">
                <div className="mx-auto max-w-2xl">
                    <h1 className="mb-8 text-center text-4xl font-bold">
                        Buscar Artigos
                    </h1>

                    <div className="relative">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                        <Input
                            type="search"
                            placeholder="Digite algo para buscar"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="h-12 pl-10 text-base"
                        />
                    </div>

                    <div className="mt-12">
                        {query ? (
                            <p className="text-muted-foreground text-center">
                                Resultados para &quot;{query}&quot;
                            </p>
                        ) : (
                            <div className="flex flex-col items-center gap-6">
                                <img
                                    src={SearchIllustration}
                                    alt="Ilustração de busca"
                                    className="h-64 w-64"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
