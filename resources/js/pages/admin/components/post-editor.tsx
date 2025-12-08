import { Tag } from "@/@types";
import { MarkdownRenderer } from "@/components/common/markdown-renderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { calculateReadingTime } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { z } from "zod";

const postSchema = z.object({
    title: z.string().min(1, "Título é obrigatório"),
    slug: z.string().min(1, "Slug é obrigatório"),
    content: z.string().min(1, "Conteúdo é obrigatório"),
    excerpt: z.string().optional(),
    status: z.enum(["draft", "published"]),
    published_at: z.string().nullable(),
    tags: z.array(z.string()),
    reading_time: z.number(),
});

type PostErrors = Partial<Record<keyof z.infer<typeof postSchema>, string>>;

interface PostEditorProps {
    initialData?: {
        title: string;
        slug: string;
        excerpt: string;
        content: string;
        status: "draft" | "published";
        published_at: string | null;
        tags: string[];
        reading_time: number;
    };
    availableTags: Tag[];
    onSave: (data: PostFormData) => void;
    onCancel: () => void;
    isLoading?: boolean;
    canPublish?: boolean;
}

export interface PostFormData {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    status: "draft" | "published";
    published_at: string | null;
    tags: string[];
    reading_time: number;
}

export function PostEditor({
    initialData,
    availableTags,
    onSave,
    onCancel,
    isLoading = false,
    canPublish = true,
}: PostEditorProps) {
    const [formData, setFormData] = useState<PostFormData>({
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        excerpt: initialData?.excerpt || "",
        content: initialData?.content || "",
        status: initialData?.status || "draft",
        published_at: initialData?.published_at || null,
        tags: initialData?.tags || [],
        reading_time: initialData?.reading_time || 0,
    });
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(
        !!initialData?.slug,
    );
    const [errors, setErrors] = useState<PostErrors>({});

    const slugify = (text: string): string => {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    };

    useEffect(() => {
        if (!slugManuallyEdited && formData.title) {
            setFormData(prev => ({
                ...prev,
                slug: slugify(prev.title),
            }));
        }
    }, [formData.title, slugManuallyEdited]);

    useEffect(() => {
        if (formData.content) {
            const calculatedTime = calculateReadingTime(formData.content);
            if (formData.reading_time !== calculatedTime) {
                setFormData(prev => ({
                    ...prev,
                    reading_time: calculatedTime,
                }));
            }
        }
    }, [formData.content]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const result = postSchema.safeParse(formData);
        if (!result.success) {
            const newErrors: PostErrors = {};
            result.error.issues.forEach(issue => {
                const field = issue.path[0] as keyof PostErrors;
                if (!newErrors[field]) {
                    newErrors[field] = issue.message;
                }
            });
            setErrors(newErrors);
            return;
        }

        onSave(formData);
    };

    const handleToggleTag = (tagUuid: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tagUuid)
                ? prev.tags.filter(uuid => uuid !== tagUuid)
                : [...prev.tags, tagUuid],
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={e =>
                                setFormData(prev => ({
                                    ...prev,
                                    title: e.target.value,
                                }))
                            }
                            placeholder="Digite o título do post"
                            aria-invalid={!!errors.title}
                        />
                        {errors.title && (
                            <p className="text-destructive text-sm">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                            id="slug"
                            value={formData.slug}
                            onChange={e => {
                                setSlugManuallyEdited(true);
                                setFormData(prev => ({
                                    ...prev,
                                    slug: e.target.value,
                                }));
                            }}
                            placeholder="slug-do-post"
                            aria-invalid={!!errors.slug}
                        />
                        {errors.slug && (
                            <p className="text-destructive text-sm">
                                {errors.slug}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="excerpt">Resumo</Label>
                        <Textarea
                            id="excerpt"
                            value={formData.excerpt}
                            onChange={e =>
                                setFormData(prev => ({
                                    ...prev,
                                    excerpt: e.target.value,
                                }))
                            }
                            placeholder="Resumo curto do post"
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Conteúdo</Label>
                        <Tabs defaultValue="write" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="write">
                                    Escrever
                                </TabsTrigger>
                                <TabsTrigger value="preview">
                                    Preview
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="write" className="space-y-2">
                                <Textarea
                                    value={formData.content}
                                    onChange={e =>
                                        setFormData(prev => ({
                                            ...prev,
                                            content: e.target.value,
                                        }))
                                    }
                                    placeholder="Escreva o conteúdo do post em Markdown... Use a página Mídia para fazer upload de imagens."
                                    rows={16}
                                    className="font-mono"
                                    aria-invalid={!!errors.content}
                                />
                                {errors.content && (
                                    <p className="text-destructive text-sm">
                                        {errors.content}
                                    </p>
                                )}
                            </TabsContent>
                            <TabsContent value="preview">
                                <Card>
                                    <CardContent className="p-6">
                                        {formData.content ? (
                                            <MarkdownRenderer
                                                content={formData.content}
                                            />
                                        ) : (
                                            <p className="text-muted-foreground py-8 text-center">
                                                Nenhum conteúdo para visualizar
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Publicação</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(
                                        value: "draft" | "published",
                                    ) =>
                                        setFormData(prev => ({
                                            ...prev,
                                            status: value,
                                        }))
                                    }
                                    disabled={
                                        !canPublish &&
                                        formData.status === "draft"
                                    }
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">
                                            Rascunho
                                        </SelectItem>
                                        <SelectItem
                                            value="published"
                                            disabled={!canPublish}
                                        >
                                            Publicado
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {!canPublish && (
                                    <p className="text-muted-foreground text-xs">
                                        Apenas administradores podem publicar
                                        posts
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="published_at">
                                    Data de Publicação
                                </Label>
                                <DateTimePicker
                                    value={formData.published_at || ""}
                                    onChange={dateString =>
                                        setFormData(prev => ({
                                            ...prev,
                                            published_at: dateString || null,
                                        }))
                                    }
                                    placeholder="Selecione a data de publicação"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reading_time">
                                    Tempo de Leitura (minutos)
                                </Label>
                                <Input
                                    id="reading_time"
                                    type="number"
                                    min="0"
                                    value={formData.reading_time}
                                    onChange={e =>
                                        setFormData(prev => ({
                                            ...prev,
                                            reading_time:
                                                parseInt(e.target.value) || 0,
                                        }))
                                    }
                                    placeholder="5"
                                />
                                <p className="text-muted-foreground text-xs">
                                    Calculado automaticamente baseado no
                                    conteúdo
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tags</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {availableTags.map(tag => (
                                    <div
                                        key={tag.uuid}
                                        className="flex items-center space-x-2"
                                    >
                                        <Checkbox
                                            id={`tag-${tag.uuid}`}
                                            checked={formData.tags.includes(
                                                tag.uuid,
                                            )}
                                            onCheckedChange={() =>
                                                handleToggleTag(tag.uuid)
                                            }
                                        />
                                        <label
                                            htmlFor={`tag-${tag.uuid}`}
                                            className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {tag.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-2">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Salvando..." : "Salvar Post"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
