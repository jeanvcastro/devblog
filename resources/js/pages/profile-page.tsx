import { User } from "@/@types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { Layout } from "@/layout";
import api from "@/services/api";
import { getAvatarUrl } from "@/utils/avatar";
import { zodResolver } from "@hookform/resolvers/zod";
import GoogleIcon from "@/assets/google.svg?react";
import { Camera, Loader2, Trash2 } from "lucide-react";
import {
    ChangeEvent,
    SyntheticEvent,
    useCallback,
    useRef,
    useState,
} from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ReactCrop, {
    type Crop,
    centerCrop,
    makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { z } from "zod";

const profileSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
) {
    return centerCrop(
        makeAspectCrop(
            { unit: "%", width: 90 },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    );
}

export default function ProfilePage() {
    const { user, updateUser } = useAuth();
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [cropDialogOpen, setCropDialogOpen] = useState(false);
    const [imgSrc, setImgSrc] = useState("");
    const [crop, setCrop] = useState<Crop>();
    const imgRef = useRef<HTMLImageElement>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: { name: user?.name ?? "" },
    });

    const onUpdateProfile = async (data: ProfileFormData) => {
        try {
            const response = await api.put<{ user: User }>("/profile", data);
            updateUser(response.data.user);
            toast.success("Perfil atualizado com sucesso!");
        } catch {
            toast.error("Erro ao atualizar perfil");
        }
    };

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

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
        setCrop(centerAspectCrop(width, height, 1));
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

    const handleSaveAvatar = async () => {
        const croppedBlob = await getCroppedImg();
        if (!croppedBlob) {
            toast.error("Erro ao processar imagem");
            return;
        }

        const formData = new FormData();
        formData.append("avatar", croppedBlob, "avatar.jpg");

        try {
            setIsUploadingAvatar(true);
            const response = await api.post<{ user: User }>(
                "/profile/avatar",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                },
            );
            updateUser(response.data.user);
            toast.success("Avatar atualizado com sucesso!");
            setCropDialogOpen(false);
            setImgSrc("");
        } catch {
            toast.error("Erro ao atualizar avatar");
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const handleCancelCrop = () => {
        setCropDialogOpen(false);
        setImgSrc("");
        setCrop(undefined);
    };

    const handleRemoveAvatar = async () => {
        try {
            setIsRemovingAvatar(true);
            const response = await api.delete<{ user: User }>(
                "/profile/avatar",
            );
            updateUser(response.data.user);
            toast.success("Avatar removido com sucesso!");
        } catch {
            toast.error("Erro ao remover avatar");
        } finally {
            setIsRemovingAvatar(false);
        }
    };

    if (!user) return null;

    return (
        <Layout>
            <div className="container mx-auto max-w-2xl px-4 py-8">
                <div className="mb-6">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold">Meu Perfil</h1>
                        <div className="bg-muted text-muted-foreground flex items-center gap-1.5 rounded-full px-3 py-1 text-xs">
                            <GoogleIcon className="h-3.5 w-3.5" />
                            Google
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-2">
                        Gerencie suas informações pessoais
                    </p>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Avatar</CardTitle>
                            <CardDescription>
                                Sua foto de perfil
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                            <div className="relative">
                                <Avatar className="h-32 w-32">
                                    <AvatarImage
                                        src={getAvatarUrl(
                                            user.name,
                                            user.avatar,
                                        )}
                                        alt={user.name}
                                    />
                                    <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                                        {user.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <Button
                                    size="icon"
                                    className="border-background hover:bg-secondary absolute right-0 bottom-0 h-10 w-10 rounded-full border-2"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    disabled={
                                        isUploadingAvatar || isRemovingAvatar
                                    }
                                >
                                    <Camera className="h-5 w-5" />
                                </Button>
                            </div>
                            {user.avatar && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleRemoveAvatar}
                                    disabled={
                                        isUploadingAvatar || isRemovingAvatar
                                    }
                                    className="text-destructive hover:text-destructive"
                                >
                                    {isRemovingAvatar ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="mr-2 h-4 w-4" />
                                    )}
                                    Remover foto
                                </Button>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileSelect}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Informações</CardTitle>
                            <CardDescription>Atualize seu nome</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={handleSubmit(onUpdateProfile)}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome</Label>
                                    <Input
                                        id="name"
                                        placeholder="Seu nome"
                                        {...register("name")}
                                    />
                                    {errors.name && (
                                        <p className="text-destructive text-sm">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        value={user.email}
                                        disabled
                                        className="bg-muted"
                                    />
                                </div>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Salvar
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
                <DialogContent className="max-w-[95vw] sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Ajustar foto</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center">
                        {imgSrc && (
                            <ReactCrop
                                crop={crop}
                                onChange={(_, percentCrop) =>
                                    setCrop(percentCrop)
                                }
                                aspect={1}
                                circularCrop
                            >
                                <img
                                    ref={imgRef}
                                    src={imgSrc}
                                    alt="Crop"
                                    onLoad={onImageLoad}
                                    style={{
                                        maxHeight: "60vh",
                                        maxWidth: "100%",
                                    }}
                                />
                            </ReactCrop>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={handleCancelCrop}
                            disabled={isUploadingAvatar}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSaveAvatar}
                            disabled={isUploadingAvatar}
                        >
                            {isUploadingAvatar && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Salvar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Layout>
    );
}
