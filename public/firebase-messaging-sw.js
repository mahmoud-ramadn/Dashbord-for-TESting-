/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js")

// تهيئة تطبيق Firebase
firebase.initializeApp({
    apiKey: "AIzaSyBW2KxDuLgUyek3LTqTJ29s9-hU4D2Y8lA",
    authDomain: "pushnotifications-565d2.firebaseapp.com",
    projectId: "pushnotifications-565d2",
    storageBucket: "pushnotifications-565d2.firebasestorage.app",
    messagingSenderId: "779885201511",
    appId: "1:779885201511:web:ea9459e59da82de0f4acc2",
    measurementId: "G-CPCBYBE4KY",
})

// تفعيل خدمة المراسلة
const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
    // console.log("[firebase-messaging-sw.js] تم استقبال إشعار في الخلفية:", payload)

    const notificationTitle = payload.notification.title
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon,
    }

    self.registration.showNotification(notificationTitle, notificationOptions)
})
