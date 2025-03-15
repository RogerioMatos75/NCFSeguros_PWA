import { Router } from "express";
import { db } from "../db/index.js";
import { indications, rewards, users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { sendPushNotification, sendWhatsAppMessage } from "../services/notifications";

const router = Router();

router.post("/indications/:id/approve", async (req, res) => {
    const { id } = req.params;

    try {
        // Atualizar status da indicação
        const [indication] = await db.update(indications)
            .set({
                status: "completed",
                notificationSent: true
            })
            .where(eq(indications.id, parseInt(id)))
            .returning();

        // Buscar usuário que fez a indicação
        const [user] = await db.select()
            .from(users)
            .where(eq(users.id, indication.userId));

        // Criar recompensa
        await db.insert(rewards).values({
            userId: indication.userId,
            discountPercentage: 1,
            isActive: true
        });

        // Enviar notificação push para quem indicou
        await sendPushNotification(user.uid, {
            title: "Parabéns! 🎉",
            body: "Sua indicação foi aprovada. Você ganhou 1% de desconto!"
        });

        res.json({
            success: true,
            message: "Indicação aprovada e recompensa criada"
        });
    } catch (error) {
        console.error("Erro ao aprovar indicação:", error);
        res.status(500).json({
            error: "Erro ao aprovar indicação",
            details: error instanceof Error ? error.message : "Erro desconhecido"
        });
    }
});

router.post("/indications/:id/send-proposal", async (req, res) => {
    const { id } = req.params;
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL da proposta é obrigatória" });
    }

    try {
        const [indication] = await db.update(indications)
            .set({
                proposalLink: url,
                notificationSent: true
            })
            .where(eq(indications.id, parseInt(id)))
            .returning();

        // Enviar mensagem WhatsApp com a mensagem formatada
        await sendWhatsAppMessage(indication.phone, indication.name, url);

        res.json({
            success: true,
            message: "Link da proposta enviado com sucesso"
        });
    } catch (error) {
        console.error("Erro ao enviar proposta:", error);
        res.status(500).json({
            error: "Erro ao enviar proposta",
            details: error instanceof Error ? error.message : "Erro desconhecido"
        });
    }
});

export default router;
