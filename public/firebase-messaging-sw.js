importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyA2HULh6ElhLtitdfD7YareuH1Gid8mPgk",
  authDomain: "finance-manager-be7f8.firebaseapp.com",
  projectId: "finance-manager-be7f8",
  storageBucket: "finance-manager-be7f8.firebasestorage.app",
  messagingSenderId: "1012934705702",
  appId: "1:1012934705702:web:58644933b96ed24bc15ce7",
  measurementId: "G-T0K48LEKH9"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
