import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig, loadEnv } from "vite"
// @ts-expect-error - vite-plugin-eslint is not typed
import eslint from "vite-plugin-eslint"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "")

    //
    const port = env.VITE_PORT ? parseInt(env.VITE_PORT) : 3000

    return {
        plugins: [react(), tailwindcss(), eslint()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        server: {
            port,
        },
        preview: {
            port,
        },
    }
})
