import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import laravel from "laravel-vite-plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/js/index.tsx"],
            refresh: true,
        }),
        react(),
        svgr(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            "@/css": path.resolve(__dirname, "./resources/css"),
            "@/assets": path.resolve(__dirname, "./resources/assets"),
            "@": path.resolve(__dirname, "./resources/js"),
        },
    },
    define: {
        global: "globalThis",
    },
    build: {
        target: "es2020",
        rollupOptions: {
            output: {
                manualChunks: {
                    markdown: [
                        "react-markdown",
                        "remark-gfm",
                        "react-syntax-highlighter",
                    ],
                    ui: [
                        "@radix-ui/react-dialog",
                        "@radix-ui/react-popover",
                        "@radix-ui/react-select",
                        "@radix-ui/react-tabs",
                    ],
                },
            },
        },
    },
});
