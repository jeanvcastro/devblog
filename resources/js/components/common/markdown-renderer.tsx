import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
    oneDark,
    oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "@/contexts/theme-context";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface MarkdownRendererProps {
    content: string;
}

function CodeBlock({ language, code }: { language: string; code: string }) {
    const { actualTheme } = useTheme();
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="group border-border relative overflow-hidden rounded-lg border">
            <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 z-10 h-8 w-8 opacity-0 group-hover:opacity-100"
                onClick={handleCopy}
            >
                {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                ) : (
                    <Copy className="h-4 w-4" />
                )}
            </Button>
            <SyntaxHighlighter
                style={actualTheme === "dark" ? oneDark : oneLight}
                language={language}
                PreTag="div"
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <div className="prose prose-neutral dark:prose-invert max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        const isInline = !match;
                        const code = String(children).replace(/\n$/, "");

                        return !isInline ? (
                            <CodeBlock language={match[1]} code={code} />
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                    img({ src, alt }) {
                        return (
                            <img
                                src={src}
                                alt={alt || ""}
                                className="h-auto max-w-full rounded-lg"
                                loading="lazy"
                            />
                        );
                    },
                    a({ href, children }) {
                        return (
                            <a
                                href={href}
                                className="text-primary underline-offset-2 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {children}
                            </a>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
