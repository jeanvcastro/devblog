import { Eye } from "lucide-react";

interface ViewCounterProps {
    count: number;
}

export function ViewCounter({ count = 0 }: ViewCounterProps) {
    return (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>{count.toLocaleString()}</span>
        </div>
    );
}
