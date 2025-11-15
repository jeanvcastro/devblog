import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

export function formatDate(date: string | null | undefined): string {
    if (!date) return "";
    return dayjs(date).format("DD [de] MMMM [de] YYYY");
}

export function formatDateTime(date: string | null | undefined): string {
    if (!date) return "";
    return dayjs(date).format("DD/MM/YYYY [às] HH:mm");
}

export function formatRelative(date: string | null | undefined): string {
    if (!date) return "";
    const now = dayjs();
    const target = dayjs(date);
    const diff = now.diff(target, "day");

    if (diff === 0) return "Hoje";
    if (diff === 1) return "Ontem";
    if (diff < 7) return `Há ${diff} dias`;
    if (diff < 30) return `Há ${Math.floor(diff / 7)} semanas`;
    if (diff < 365) return `Há ${Math.floor(diff / 30)} meses`;
    return `Há ${Math.floor(diff / 365)} anos`;
}
