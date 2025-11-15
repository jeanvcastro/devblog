import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

interface CommentFormProps {
    postUuid: string;
    parentUuid?: string;
    onSubmit: (content: string) => Promise<void>;
    onCancel?: () => void;
}

export function CommentForm({
    parentUuid,
    onSubmit,
    onCancel,
}: CommentFormProps) {
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const { isAuthenticated } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!content.trim()) return;

        setSubmitting(true);

        try {
            await onSubmit(content);
            setContent("");
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
