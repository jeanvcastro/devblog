import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import type { Tag } from "@/@types";

interface TagBadgeProps {
    tag: Tag;
}

export function TagBadge({ tag }: TagBadgeProps) {
    return (
        <Link to={`/tag/${tag.slug}`}>
            <Badge
                variant="secondary"
                className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
            >
                {tag.name}
            </Badge>
        </Link>
    );
}
