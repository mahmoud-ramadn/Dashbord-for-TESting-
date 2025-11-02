import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";





const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
}


const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

const generateToken = async (sw?: ServiceWorkerRegistration) => {
    try {
        const permission = await Notification.requestPermission()
        if (permission === "granted") {
            const currentToken = await getToken(messaging, {
                vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
                serviceWorkerRegistration: sw,
            })
            if (currentToken) {
                console.log("FCM Token:", currentToken)
            } else {
                console.warn("No registration token available.")
            }
        } else {
            console.warn("Notification permission denied")
        }
    } catch (err) {
        console.error("An error occurred while retrieving token. ", err)
    }
}

export { generateToken }