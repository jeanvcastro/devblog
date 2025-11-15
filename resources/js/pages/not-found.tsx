import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout";

export default function NotFoundPage() {
    return (
        <Layout>
            <div className="flex min-h-[60vh] items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center text-6xl font-bold text-primary">
                            404
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-center text-xl font-semibold">
                            Página não encontrada
                        </p>
                        <p className="text-center text-muted-foreground">
                            A página que você está procurando não existe ou foi movida.
                        </p>
                        <div className="flex justify-center gap-2">
                            <Button asChild>
                                <Link to="/">Voltar para Home</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link to="/search">Buscar Artigos</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
