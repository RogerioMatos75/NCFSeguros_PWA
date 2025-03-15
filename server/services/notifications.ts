import { initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import axios from 'axios';

const firebaseApp = initializeApp({
    credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
});

export async function sendPushNotification(userToken: string, notification: { title: string; body: string }) {
    try {
        const message = {
            token: userToken,
            notification: {
                title: notification.title,
                body: notification.body,
            },
        };

        const response = await getMessaging().send(message);
        return { success: true, messageId: response };
    } catch (error) {
        console.error('Erro ao enviar notificação push:', error);
        throw error;
    }
}

export async function sendWhatsAppMessage(phone: string, name: string, url: string) {
    try {
        const message =
            `Olá ${name}! 👋

Parabéns! Sua indicação para o seguro foi aprovada. 🎉

Para darmos continuidade ao processo, por favor, preencha a proposta através do link abaixo:

📝 ${url}

⚠️ Importante:
- O preenchimento leva apenas alguns minutos
- Todos os dados são tratados com segurança
- Nossa equipe está à disposição para ajudar

Precisa de ajuda? Estamos aqui para te auxiliar! 😊

Atenciosamente,
Equipe NCF Seguros`;

        const response = await axios.post(
            `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: phone,
                type: "text",
                text: { body: message }
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return { success: true, messageId: response.data.messages[0].id };
    } catch (error) {
        console.error('Erro ao enviar mensagem WhatsApp:', error);
        throw error;
    }
}
