import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { ReactNode } from "react";

export interface DataTableColumn<T> {
    key: string;
    header: string;
    cell?: (row: T) => ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: DataTableColumn<T>[];
    loading?: boolean;
    emptyMessage?: string;
    actions?: (row: T) => ReactNode;
}

export function DataTable<T extends Record<string, unknown>>({
    data,
    columns,
    loading = false,
    emptyMessage = "Nenhum dado disponível.",
    actions,
}: DataTableProps<T>) {
    if (loading) {
        return (
            <Card className="overflow-hidden py-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {columns.map(column => (
                                    <TableHead
                                        key={column.key}
                                        className={column.className}
                                    >
                                        {column.header}
                                    </TableHead>
                                ))}
                                {actions && (
                                    <TableHead className="w-20">
                                        Ações
                                    </TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[...Array(5)].map((_, i) => (
                                <TableRow key={i}>
                                    {columns.map(column => (
                                        <TableCell key={column.key}>
                                            <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                                        </TableCell>
                                    ))}
                                    {actions && (
                                        <TableCell>
                                            <div className="bg-muted h-4 w-16 animate-pulse rounded" />
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        );
    }

    if (data.length === 0) {
        return (
            <Card className="p-12 text-center">
                <p className="text-muted-foreground">{emptyMessage}</p>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden py-0">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map(column => (
                                <TableHead
                                    key={column.key}
                                    className={column.className}
                                >
                                    {column.header}
                                </TableHead>
                            ))}
                            {actions && (
                                <TableHead className="w-20 text-right">
                                    Ações
                                </TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow key={index}>
                                {columns.map(column => (
                                    <TableCell
                                        key={column.key}
                                        className={column.className}
                                    >
                                        {column.cell
                                            ? column.cell(row)
                                            : String(row[column.key] ?? "")}
                                    </TableCell>
                                ))}
                                {actions && (
                                    <TableCell className="text-right">
                                        {actions(row)}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}
