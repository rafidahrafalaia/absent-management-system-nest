/* eslint-disable no-undef */
// Shows FCM push notifications while the admin app is in the background.
// The Firebase config is passed as query params by src/firebase.js.
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js');

firebase.initializeApp(Object.fromEntries(new URLSearchParams(self.location.search)));
firebase.messaging();
