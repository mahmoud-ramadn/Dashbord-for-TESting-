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
const messaging = getMessaging(app)

const generateToken = async (sw?: ServiceWorkerRegistration) => {
    try {
        const currentToken = await getToken(messaging, {
            vapidKey: "BEgcq9qqrEZZX_VEfZW7Od4spcwkUR8FddFAkgDR2U3laZ02YzG0e7-TdekymTVCxogxQJKByGyMYtesNTR1EgI",
            serviceWorkerRegistration: sw,
        })
        if (currentToken) {
            console.log("FCM Token:", currentToken)
            // Optionally send token to your server
        } else {
            console.warn("No registration token available.")
        }
    } catch (err) {
        console.error("An error occurred while retrieving token. ", err)
    }
}

export { messaging, generateToken }
