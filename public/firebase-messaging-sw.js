/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js")

firebase.initializeApp({
    apiKey: "AIzaSyCvKmdq6XK_CfYswLK-VP_2xwYUXQ21Ef0",
    authDomain: "notficationpusher-dashbord.firebaseapp.com",
    projectId: "notficationpusher-dashbord",
    storageBucket: "notficationpusher-dashbord.firebasestorage.app",
    messagingSenderId: "1085767033611",
    appId: "1:1085767033611:web:f219ffc589c249de6d380e",
    measurementId: "G-JFZNV478WB",
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon,
    }

    self.registration.showNotification(notificationTitle, notificationOptions)
})
