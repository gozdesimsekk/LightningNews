import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestPermission = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: 'BLQEpDEpzPMUFcsIXraRXYLq2Hwap8mKn3wW3BSmHENuaF8DzBV92Nn_NMc_Il8oKxmXztVSuz3IiuxQWt--sUM'
    });
    if (token) {
      await saveTokenToServer(token);
    } else {
      // console.log('Kullanıcı izin vermedi.');
    }
  } catch (error) {
    console.error('FCM token is null:', error);
  }
};

const saveTokenToServer = async (token) => {
  try {
    await fetch('/api/send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
      }),
    });
  } catch (error) {
    console.error('Token kaydedilemedi:', error);
  }
};
export const sendPushNotification = async (title, body) => {
  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
    });

    if (token && title && body) {
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          title,
          body
        }),
      });

      if (response.ok) {
        console.log("Notification sent successfully!");
      } else {
        console.error("Failed to send notification.");
      }
    }
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('Mesaj alındı:', payload);

      const title = payload.notification.title;
      const body = payload.notification.body;

      sendPushNotification(title, body);

      resolve(payload);
    });
  });


