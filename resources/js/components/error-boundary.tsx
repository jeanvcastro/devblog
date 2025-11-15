import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Error Boundary caught an error:", error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = "/";
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-background p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle className="text-center text-2xl text-destructive">
                                Algo deu errado
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-center text-muted-foreground">
                                Desculpe, ocorreu um erro inesperado. Nossa equipe foi
                                notificada e estamos trabalhando para resolver o problema.
                            </p>
                            {/* eslint-disable-next-line no-undef */}
                            {process.env.NODE_ENV === "development" && this.state.error && (
                                <div className="rounded-md bg-muted p-4">
                                    <p className="text-sm font-mono text-destructive">
                                        {this.state.error.message}
                                    </p>
                                </div>
                            )}
                            <div className="flex justify-center gap-2">
                                <Button onClick={this.handleReset}>
                                    Voltar para Home
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
            );
        }

        return this.props.children;
    }
}
