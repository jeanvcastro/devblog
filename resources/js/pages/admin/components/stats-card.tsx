import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReactNode } from "react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon?: ReactNode;
    description?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export function StatsCard({
    title,
    value,
    icon,
    description,
    trend,
}: StatsCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-muted-foreground text-sm font-medium">
                        {title}
                    </CardTitle>
                    {icon && (
                        <div className="text-muted-foreground">{icon}</div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {(description || trend) && (
                    <div className="mt-2 flex items-center gap-2 text-xs">
                        {trend && (
                            <span
                                className={
                                    trend.isPositive
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-red-600 dark:text-red-400"
                                }
                            >
                                {trend.isPositive ? "+" : ""}
                                {trend.value}%
                            </span>
                        )}
                        {description && (
                            <span className="text-muted-foreground">
                                {description}
                            </span>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
