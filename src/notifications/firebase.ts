import { initializeApp } from "firebase/app"
import { getMessaging, getToken } from "firebase/messaging"

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
export const messaging = getMessaging(app)

export const generateToken = async () => {
    const permission = await Notification.requestPermission()

    if (permission === "granted") {
    const token = await getToken(messaging, {
        vapidKey: "BM7tUrv64vNIX3sY0M-eaLDSL7NF6EtcPlX3RviqunH3SUiZwBh-PQqNZXzQeFIAE0DeLWKehg86nZHPK6W1Eg0",
        })
        console.log(token);
        
    }
}
