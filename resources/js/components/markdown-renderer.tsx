import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "@/contexts/theme-context";

interface MarkdownRendererProps {
    content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    const { actualTheme } = useTheme();

    return (
        <div className="prose prose-neutral dark:prose-invert max-w-none">
            <ReactMarkdown
                components={{
                    code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        const isInline = !match;
                        return !isInline ? (
                            <SyntaxHighlighter
                                style={actualTheme === "dark" ? oneDark as any : oneLight as any}
                                language={match[1]}
                                PreTag="div"
                            >
                                {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
