import React, { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { LOGGING_API_URL } from '../api/api.js';
import { fetchToken } from './Auth.js';
import { isFirebaseConfigured, registerPushNotifications } from '../firebase.js';

/**
 * Pops up a toast whenever an employee changes their profile.
 * Events arrive over Server-Sent Events from the logging service (which consumes RabbitMQ).
 * If Firebase is configured, this browser is also registered for FCM push while the tab is closed.
 */
const Notification = () => {
  useEffect(() => {
    const token = encodeURIComponent(fetchToken());
    const source = new EventSource(`${LOGGING_API_URL}/notifications/stream?token=${token}`);
    source.onmessage = (event) => {
      const { title, body } = JSON.parse(event.data);
      toast(
        <div>
          <strong>{title}</strong>
          <div>{body}</div>
        </div>,
        { duration: 8000, icon: '🔔' }
      );
    };

    if (isFirebaseConfigured) {
      registerPushNotifications().catch(err => console.warn('FCM registration failed', err));
    }
    return () => source.close();
  }, []);

  return <Toaster position="top-right" />;
}

export default Notification
