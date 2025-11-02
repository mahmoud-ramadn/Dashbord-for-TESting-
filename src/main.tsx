import "nprogress/nprogress.css";



import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";



import "@/assets/css/index.css";
import { router } from "@/routes"
import { generateToken } from "./notifications/firebase";

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/firebase-messaging-sw.js")
            .then((registration) => {
                console.log("Service Worker registered:", registration)
                generateToken(registration) // مرر الـ registration هنا
            })
            .catch((err) => {
                console.error("Service Worker registration failed:", err)
            })
    })
}


createRoot(document.getElementById("root")!).render(<RouterProvider router={router} />)