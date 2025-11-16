import { Clock } from "lucide-react";

interface ReadingTimeProps {
    minutes: number;
}

export function ReadingTime({ minutes = 0 }: ReadingTimeProps) {
    return (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{minutes} min</span>
        </div>
    );
}
