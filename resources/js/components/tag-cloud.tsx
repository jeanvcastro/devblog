import { TagBadge } from "@/components/tag-badge";
import type { Tag } from "@/@types";

interface TagCloudProps {
    tags: Tag[];
    loading?: boolean;
}

export function TagCloud({ tags, loading }: TagCloudProps) {
    if (loading) {
        return (
            <div className="flex flex-wrap gap-2">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-6 w-20 bg-muted animate-pulse rounded-md" />
                ))}
            </div>
        );
    }

    if (tags.length === 0) {
        return <p className="text-sm text-muted-foreground">Nenhuma tag disponível.</p>;
    }

    return (
        <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
                <div key={tag.uuid} className="flex items-center gap-1">
                    <TagBadge tag={tag} />
                    {tag.postsCount !== undefined && (
                        <span className="text-xs text-muted-foreground">({tag.postsCount})</span>
                    )}
                </div>
            ))}
        </div>
    );
}
