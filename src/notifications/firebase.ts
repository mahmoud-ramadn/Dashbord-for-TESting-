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

console.log("✅ Firebase Config:", firebaseConfig) // <— Add this temporarily!

const app = initializeApp(firebaseConfig)
export const messaging = getMessaging(app)

export const generateToken = async () => {
    const permission = await Notification.requestPermission()

    if (permission === "granted") {
        try {
            const token = await getToken(messaging, {
                vapidKey: "BEgcq9qqrEZZX_VEfZW7Od4spcwkUR8FddFAkgDR2U3laZ02YzG0e7-TdekymTVCxogxQJKByGyMYtesNTR1EgI",
            })
            console.log("🔥 FCM Token:", token)
        } catch (err) {
            console.error("❌ Error getting token:", err)
        }
    } else {
        console.warn("❌ Notification permission not granted")
    }
}
