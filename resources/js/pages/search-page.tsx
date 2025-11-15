import type { ApiResponse, Post } from "@/@types";
import SearchIllustration from "@/assets/search.svg";
import { Layout } from "@/components/layout";
import { PostList } from "@/components/post-list";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import api from "@/services/api";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        const searchPosts = async () => {
            if (!debouncedQuery.trim()) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const res = await api.get<ApiResponse<Post[]>>(
                    "/posts/search",
                    {
                        params: { q: debouncedQuery },
                    },
                );
                setResults(res.data.data);
            } catch (error) {
                console.error("Erro ao buscar:", error);
            } finally {
                setLoading(false);
            }
        };

        searchPosts();
    }, [debouncedQuery]);

    return (
        <Layout>
            <div className="container mx-auto max-w-7xl px-4 py-12">
                <div className="mx-auto max-w-4xl">
                    <h1 className="mb-8 text-center text-4xl font-bold">
                        Buscar Artigos
                    </h1>

                    <div className="relative mb-12">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                        <Input
                            type="search"
                            placeholder="Digite algo para buscar"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="h-12 pl-10 text-base"
                        />
                    </div>

                    <div>
                        {query.trim() ? (
                            <div>
                                <p className="text-muted-foreground mb-6">
                                    {loading
                                        ? "Buscando..."
                                        : `${results.length} resultado${results.length !== 1 ? "s" : ""} para "${query}"`}
                                </p>
                                <PostList posts={results} loading={loading} />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-6 py-12">
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
