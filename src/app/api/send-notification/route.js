import admin from 'firebase-admin';
import serviceAccount from '../../../../service-key.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export async function POST(req) {
  try {
    const { token, title, body } = await req.json();

    if (!token || !title || !body) {

      return new Response(JSON.stringify({ error: 'Token, title and body fields are required.' }), { status: 400 });
    }


    const message = {
      notification: {
        title: title,
        body: body,
      },
      token: token,
    };

    const response = await admin.messaging().send(message);

    return new Response(JSON.stringify({ message: 'Notification sent', response }), { status: 200 });
  } catch (error) {
    console.error('Error sending notification:', error);

    const errorMessage = error.message || 'Error sending notification';
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
