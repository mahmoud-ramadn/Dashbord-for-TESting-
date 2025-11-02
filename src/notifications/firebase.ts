import { initializeApp } from "firebase/app"
import { getMessaging, getToken } from "firebase/messaging"

const firebaseConfig = {
    apiKey: "AIzaSyBW2KxDuLgUyek3LTqTJ29s9-hU4D2Y8lA",
    authDomain: "pushnotifications-565d2.firebaseapp.com",
    projectId: "pushnotifications-565d2",
    storageBucket: "pushnotifications-565d2.firebasestorage.app",
    messagingSenderId: "779885201511",
    appId: "1:779885201511",
    measurementId: "G-CPCBYBE4KY",
}

const app = initializeApp(firebaseConfig)
export const messaging = getMessaging(app)

export const generateToken = async () => {
    const permission = await Notification.requestPermission()

    if (permission === "granted") {
        const token = await getToken(messaging, {
            vapidKey: "BEgcq9qqrEZZX_VEfZW7Od4spcwkUR8FddFAkgDR2U3laZ02YzG0e7-TdekymTVCxogxQJKByGyMYtesNTR1EgI",
        })
        console.log(token)
    }
}
