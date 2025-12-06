import { AdminLayout } from "@/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import api from "@/services/api";
import { Check, Copy, Loader2, Trash2, Upload } from "lucide-react";
import { ChangeEvent, SyntheticEvent, useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface Image {
    filename: string;
    url: string;
    path: string;
    size: number;
    modified: number;
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number) {
    const aspect = mediaWidth / mediaHeight;
    return centerCrop(
        makeAspectCrop({ unit: "%", width: 100 }, aspect, mediaWidth, mediaHeight),
        mediaWidth,
        mediaHeight,
    );
}

export function MediaPage() {
    const [images, setImages] = useState<Image[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [imageToDelete, setImageToDelete] = useState<Image | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [cropDialogOpen, setCropDialogOpen] = useState(false);
    const [imgSrc, setImgSrc] = useState("");
    const [crop, setCrop] = useState<Crop>();
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const response = await api.get<Image[]>("/images");
            setImages(response.data);
        } catch (error) {
            console.error("Erro ao carregar imagens:", error);
            toast.error("Erro ao carregar imagens");
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setOriginalFile(file);
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            setImgSrc(reader.result?.toString() || "");
            setCropDialogOpen(true);
        });
        reader.readAsDataURL(file);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const onImageLoad = useCallback((e: SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height));
    }, []);

    const getCroppedImg = async (): Promise<Blob | null> => {
        const image = imgRef.current;
        if (!image || !crop) return null;

        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        const pixelCrop = {
            x: (crop.x / 100) * image.width * scaleX,
            y: (crop.y / 100) * image.height * scaleY,
            width: (crop.width / 100) * image.width * scaleX,
            height: (crop.height / 100) * image.height * scaleY,
        };

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height,
        );

        return new Promise(resolve => {
            canvas.toBlob(blob => resolve(blob), "image/jpeg", 0.9);
        });
    };

    const handleUpload = async () => {
        if (!originalFile) return;

        try {
            setUploading(true);
            const croppedBlob = await getCroppedImg();

            const formData = new FormData();
            if (croppedBlob) {
                const ext = originalFile.name.split(".").pop() || "jpg";
                const filename = originalFile.name.replace(/\.[^/.]+$/, "") + "_cropped." + ext;
                formData.append("image", croppedBlob, filename);
            } else {
                formData.append("image", originalFile);
            }

            await api.post("/images/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Imagem enviada com sucesso!");
            setCropDialogOpen(false);
            setImgSrc("");
            setOriginalFile(null);
            fetchImages();
        } catch (error) {
            console.error("Erro ao fazer upload:", error);
            toast.error("Erro ao enviar imagem");
        } finally {
            setUploading(false);
        }
    };

    const handleCancelCrop = () => {
        setCropDialogOpen(false);
        setImgSrc("");
        setOriginalFile(null);
        setCrop(undefined);
    };

    const handleCopyUrl = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            setCopiedUrl(url);
            toast.success("URL copiada!");
            setTimeout(() => setCopiedUrl(null), 2000);
        } catch {
            toast.error("Erro ao copiar URL");
        }
    };

    const handleCopyMarkdown = async (image: Image) => {
        const imageName = image.filename.replace(/\.[^/.]+$/, "");
        const markdown = `![${imageName}](${image.url})`;
        try {
            await navigator.clipboard.writeText(markdown);
            toast.success("Markdown copiado!");
        } catch {
            toast.error("Erro ao copiar markdown");
        }
    };

    const handleDelete = (image: Image) => {
        setImageToDelete(image);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!imageToDelete) return;

        try {
            setIsDeleting(true);
            await api.delete(`/images/${imageToDelete.filename}`);
            setImages(prev =>
                prev.filter(img => img.filename !== imageToDelete.filename),
            );
            setDeleteDialogOpen(false);
            setImageToDelete(null);
            toast.success("Imagem excluída com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir imagem:", error);
            toast.error("Erro ao excluir imagem");
        } finally {
            setIsDeleting(false);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Galeria de Mídia</h1>
                        <p className="text-muted-foreground mt-2">
                            Gerencie as imagens do blog ({images.length}{" "}
                            {images.length === 1 ? "imagem" : "imagens"})
                        </p>
                    </div>
                    <div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept="image/*"
                            className="hidden"
                        />
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Imagem
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-muted aspect-square animate-pulse rounded-lg"
                            />
                        ))}
                    </div>
                ) : images.length === 0 ? (
                    <Card>
                        <CardContent className="flex h-64 items-center justify-center">
                            <div className="text-center">
                                <p className="text-muted-foreground mb-4">
                                    Nenhuma imagem enviada ainda
                                </p>
                                <Button
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    variant="outline"
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Enviar primeira imagem
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {images.map(image => (
                            <Card
                                key={image.filename}
                                className="flex flex-col overflow-hidden border-0 py-0 shadow-md dark:border"
                            >
                                <div className="bg-muted relative aspect-square overflow-hidden">
                                    <img
                                        src={image.url}
                                        alt={image.filename}
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                </div>
                                <CardContent className="space-y-3 p-4">
                                    <div className="space-y-1">
                                        <p className="truncate text-sm font-medium">
                                            {image.filename}
                                        </p>
                                        <div className="text-muted-foreground flex items-center justify-between text-xs">
                                            <span>
                                                {formatSize(image.size)}
                                            </span>
                                            <span>
                                                {formatDate(image.modified)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() =>
                                                handleCopyUrl(image.url)
                                            }
                                        >
                                            {copiedUrl === image.url ? (
                                                <Check className="h-4 w-4" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() =>
                                                handleCopyMarkdown(image)
                                            }
                                        >
                                            MD
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(image)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar exclusão</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir esta imagem? Esta
                            ação não pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={isDeleting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Excluindo..." : "Excluir"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
                <DialogContent className="max-w-[95vw] sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Recortar imagem</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center">
                        {imgSrc && (
                            <ReactCrop
                                crop={crop}
                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                            >
                                <img
                                    ref={imgRef}
                                    src={imgSrc}
                                    alt="Crop"
                                    onLoad={onImageLoad}
                                    style={{ maxHeight: "60vh", maxWidth: "100%" }}
                                />
                            </ReactCrop>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={handleCancelCrop}
                            disabled={uploading}
                        >
                            Cancelar
                        </Button>
                        <Button onClick={handleUpload} disabled={uploading}>
                            {uploading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Enviar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
