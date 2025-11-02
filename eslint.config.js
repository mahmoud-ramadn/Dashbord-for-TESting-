import js from "@eslint/js"
import tanstackQuery from "@tanstack/eslint-plugin-query"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import globals from "globals"
import typescript from "typescript-eslint"

export default [
    {
        ignores: [
            "dist/**",
            "node_modules/**",
            "*.d.ts",
            "**/coverage/**",
            "**/src/components/ui/**",
            "package.json",
            "pnpm-lock.yaml",
        ],
    },
    js.configs.recommended,
    ...typescript.configs.recommended,
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.es2021,
            },
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
            "@tanstack/query": tanstackQuery,
        },
        rules: {
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
            "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
            "@tanstack/query/exhaustive-deps": "error",
            "no-console": ["warn", { allow: ["error"] }],
        },
    },
]
