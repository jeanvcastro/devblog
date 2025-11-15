import type { ApiResponse, Post, Tag } from "@/@types";
import { Layout } from "@/components/layout";
import { PostList } from "@/components/post-list";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import api from "@/services/api";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [selectedTags, setSelectedTags] = useState<string[]>(
        searchParams.get("tags")?.split(",").filter(Boolean) || []
    );
    const [allTags, setAllTags] = useState<Tag[]>([]);
    const [results, setResults] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        const tagsFromUrl = searchParams.get("tags")?.split(",").filter(Boolean) || [];
        setSelectedTags(tagsFromUrl);
        setCurrentPage(1);
    }, [searchParams]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedQuery, selectedTags]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const res = await api.get<Tag[]>("/tags");
                setAllTags(res.data || []);
            } catch (error) {
                console.error("Erro ao carregar tags:", error);
                setAllTags([]);
            }
        };
        fetchTags();
    }, []);

    useEffect(() => {
        const searchPosts = async () => {
            setLoading(true);
            try {
                const params: { q?: string; tags?: string; page: number } = {
                    page: currentPage,
                };

                if (debouncedQuery.trim()) {
                    params.q = debouncedQuery;
                }

                if (selectedTags.length > 0) {
                    params.tags = selectedTags.join(',');
                }

                const res = await api.get<any>("/posts/search", { params });
                setResults(res.data.data || []);
                setTotalPages(res.data.last_page || 1);
                setTotal(res.data.total || 0);
            } catch (error) {
                console.error("Erro ao buscar:", error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        searchPosts();
    }, [debouncedQuery, selectedTags, currentPage]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (debouncedQuery.trim()) params.set("q", debouncedQuery);
        if (selectedTags.length > 0) params.set("tags", selectedTags.join(","));
        setSearchParams(params, { replace: true });
    }, [debouncedQuery, selectedTags, setSearchParams]);

    const toggleTag = (slug: string) => {
        setSelectedTags(prev =>
            prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
        );
    };

    return (
        <Layout>
            <div className="container mx-auto max-w-7xl px-4 py-12">
                <div className="mx-auto max-w-4xl">
                    <h1 className="mb-8 text-center text-4xl font-bold">
                        Artigos
                    </h1>

                    <div className="space-y-6 mb-12">
                        <div className="relative">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                            <Input
                                type="search"
                                placeholder="Digite algo para buscar..."
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                className="h-12 pl-10 text-base"
                            />
                        </div>

                        {selectedTags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                <span className="text-sm text-muted-foreground self-center">Filtros:</span>
                                {selectedTags.map(slug => {
                                    const tag = allTags.find(t => t.slug === slug);
                                    return tag ? (
                                        <Badge
                                            key={slug}
                                            variant="secondary"
                                            className="gap-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
                                            onClick={() => toggleTag(slug)}
                                        >
                                            {tag.name}
                                            <X className="h-3 w-3" />
                                        </Badge>
                                    ) : null;
                                })}
                            </div>
                        )}

                        <div>
                            <p className="text-sm text-muted-foreground mb-3">Tags populares:</p>
                            <div className="flex flex-wrap gap-2">
                                {allTags.slice(0, 8).map(tag => (
                                    <Badge
                                        key={tag.uuid}
                                        variant={selectedTags.includes(tag.slug) ? "default" : "outline"}
                                        className="cursor-pointer transition-colors"
                                        onClick={() => toggleTag(tag.slug)}
                                    >
                                        {tag.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-muted-foreground mb-6">
                            {loading
                                ? "Buscando..."
                                : `${total} resultado${total !== 1 ? "s" : ""} encontrado${total !== 1 ? "s" : ""}`}
                        </p>
                        <PostList posts={results} loading={loading} />

                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-8">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Anterior
                                </Button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(page => {
                                            if (totalPages <= 7) return true;
                                            if (page === 1 || page === totalPages) return true;
                                            if (Math.abs(page - currentPage) <= 1) return true;
                                            return false;
                                        })
                                        .map((page, idx, arr) => {
                                            const prevPage = arr[idx - 1];
                                            const showEllipsis = prevPage && page - prevPage > 1;

                                            return (
                                                <div key={page} className="flex items-center gap-1">
                                                    {showEllipsis && (
                                                        <span className="px-2 text-muted-foreground">...</span>
                                                    )}
                                                    <Button
                                                        variant={currentPage === page ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setCurrentPage(page)}
                                                    >
                                                        {page}
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    Próxima
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
