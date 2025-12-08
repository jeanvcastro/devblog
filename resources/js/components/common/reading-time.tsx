import { Clock } from "lucide-react";

interface ReadingTimeProps {
    minutes: number;
}

export function ReadingTime({ minutes = 0 }: ReadingTimeProps) {
    return (
        <div className="text-muted-foreground flex items-center gap-1 text-sm">
            <Clock className="h-4 w-4" />
            <span>{minutes} min</span>
        </div>
    );
}
