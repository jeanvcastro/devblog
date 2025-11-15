import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import { Check } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

interface CommentFormProps {
    postUuid: string;
    parentUuid?: string;
    onSubmit: () => Promise<void>;
    onCancel?: () => void;
}

export function CommentForm({
    parentUuid,
    onSubmit,
    onCancel,
}: CommentFormProps) {
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!content.trim()) return;

        setSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            await onSubmit();
            setContent("");
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch {
            setError("Erro ao enviar comentário. Tente novamente.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="bg-muted rounded-lg p-6 text-center">
                <p className="text-muted-foreground mb-4">
                    Você precisa estar logado para comentar.
                </p>
                <Button asChild>
                    <Link to="/login">Fazer Login</Link>
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
                placeholder={
                    parentUuid
                        ? "Escreva sua resposta..."
                        : "Escreva seu comentário..."
                }
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={4}
                disabled={submitting}
            />
            {success && (
                <div className="flex items-center gap-2 rounded-md border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-800 dark:text-white">
                    <Check className="size-4 text-green-800 dark:text-green-500" />
                    Comentário enviado com sucesso! Aguardando aprovação.
                </div>
            )}
            {error && (
                <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-md border p-3 text-sm">
                    {error}
                </div>
            )}
            <div className="flex gap-2">
                <Button type="submit" disabled={submitting || !content.trim()}>
                    {submitting ? "Enviando..." : "Enviar"}
                </Button>
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancelar
                    </Button>
                )}
            </div>
        </form>
    );
}
