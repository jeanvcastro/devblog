import GoogleIcon from "@/assets/google.svg?react";
import { Layout } from "@/layout";
import { SEO } from "@/components/common/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [error, setError] = useState("");
    const { loginAdmin, loginGoogle } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setError("");

        try {
            await loginAdmin(data.email, data.password);
            navigate("/admin/dashboard");
        } catch {
            setError("Credenciais inválidas");
        }
    };

    return (
        <Layout>
            <SEO
                title="Login"
                description="Faça login para acessar o painel administrativo ou comentar nos artigos."
                url="/login"
            />
            <div className="container mx-auto flex max-w-7xl items-center justify-center px-4 py-8">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold">Login</h1>
                        <p className="text-muted-foreground mt-2">
                            Entre com suas credenciais ou Google
                        </p>
                    </div>

                    <div className="space-y-4">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Digite seu email"
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="text-destructive text-sm">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Digite sua senha"
                                    {...register("password")}
                                />
                                {errors.password && (
                                    <p className="text-destructive text-sm">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {error && (
                                <p className="text-destructive text-sm">
                                    {error}
                                </p>
                            )}

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full"
                            >
                                {isSubmitting ? "Entrando..." : "Entrar"}
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="border-border w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background text-muted-foreground px-2">
                                    Ou continue com
                                </span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            onClick={loginGoogle}
                            className="w-full gap-2"
                        >
                            <GoogleIcon />
                            Google
                        </Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
