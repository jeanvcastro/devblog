import { TagBadge } from "./tag-badge";
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
                    <div
                        key={i}
                        className="bg-muted h-6 w-20 animate-pulse rounded-md"
                    />
                ))}
            </div>
        );
    }

    if (tags.length === 0) {
        return (
            <p className="text-muted-foreground text-sm">
                Nenhuma tag disponível.
            </p>
        );
    }

    return (
        <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
                <div key={tag.uuid} className="flex items-center gap-1">
                    <TagBadge tag={tag} />
                    {tag.posts_count !== undefined && (
                        <span className="text-muted-foreground text-xs">
                            ({tag.posts_count})
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}
