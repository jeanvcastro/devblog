import { Badge } from "@/components/ui/badge";
import React from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import type { Tag } from "@/@types";

interface TagBadgeProps {
    tag: Tag;
}

export function TagBadge({ tag }: TagBadgeProps) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const location = useLocation();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (location.pathname === "/posts") {
            const currentTags =
                searchParams.get("tags")?.split(",").filter(Boolean) || [];

            if (!currentTags.includes(tag.slug)) {
                const newTags = [...currentTags, tag.slug];
                const params = new URLSearchParams(searchParams);
                params.set("tags", newTags.join(","));
                navigate(`/posts?${params.toString()}`, { replace: true });
            }
        } else {
            navigate(`/posts?tags=${tag.slug}`);
        }
    };

    return (
        <Badge
            variant="secondary"
            className="hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
            onClick={handleClick}
        >
            {tag.name}
        </Badge>
    );
}
