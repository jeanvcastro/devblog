import { Layout } from "@/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import {
    useRouteError,
    isRouteErrorResponse,
    useNavigate,
} from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    const navigate = useNavigate();

    let errorMessage = "Ocorreu um erro inesperado";
    let errorStatus: number | undefined;

    if (isRouteErrorResponse(error)) {
        errorStatus = error.status;
        errorMessage = error.statusText || error.data?.message || errorMessage;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }

    return (
        <Layout>
            <div className="container mx-auto max-w-2xl px-4 py-20">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <AlertCircle className="text-destructive h-8 w-8" />
                            <CardTitle className="text-2xl">
                                {errorStatus ? `Erro ${errorStatus}` : "Erro"}
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">{errorMessage}</p>

                        <div className="flex gap-3">
                            <Button onClick={() => navigate("/")}>
                                Ir para Home
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => window.location.reload()}
                            >
                                Recarregar Página
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
