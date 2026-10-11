// Optional Firebase Cloud Messaging push. The in-app popup works without it (see Notification.js).
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, isSupported } from 'firebase/messaging';
import { loggingApi } from './api/api.js';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};
const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY;

export const isFirebaseConfigured = Boolean(firebaseConfig.projectId && vapidKey);

/** Asks for notification permission and registers this browser's FCM token with the logging service. */
export async function registerPushNotifications() {
  if (!(await isSupported())) return;

  // The service worker cannot read process.env, so the config is passed in its URL.
  const registration = await navigator.serviceWorker.register(
    `/firebase-messaging-sw.js?${new URLSearchParams(firebaseConfig)}`
  );
  const messaging = getMessaging(initializeApp(firebaseConfig));
  const fcmToken = await getToken(messaging, { vapidKey, serviceWorkerRegistration: registration });
  if (fcmToken) await loggingApi.post('/devices', { fcmToken });
}
