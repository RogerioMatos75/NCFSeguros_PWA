import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertIndicationSchema, insertRewardSchema } from "@shared/schema";
import { sendWhatsAppMessage, sendPushNotification } from "./services/notifications"; // Assumindo que as funções estão aqui

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "ncf-admin-2024";

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware para verificar se o usuário é admin
  const isAdmin = async (req: any, res: any, next: any) => {
    try {
      const user = await storage.getUserByUid(req.params.uid);
      if (!user?.isAdmin) {
        res.status(403).json({ error: "Acesso não autorizado" });
        return;
      }
      next();
    } catch (error) {
      res.status(403).json({ error: "Acesso não autorizado" });
    }
  };

  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.get("/api/users/:uid", async (req, res) => {
    const user = await storage.getUserByUid(req.params.uid);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  });

  // Indication routes
  app.post("/api/users/:userId/indications", async (req, res) => {
    try {
      const indicationData = insertIndicationSchema.parse(req.body);
      const userId = parseInt(req.params.userId);
      const indication = await storage.createIndication(userId, indicationData);
      res.json(indication);
    } catch (error) {
      res.status(400).json({ error: "Invalid indication data" });
    }
  });

  app.get("/api/users/:userId/indications", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const indications = await storage.getIndicationsByUserId(userId);
      res.json(indications);
    } catch (error) {
      res.status(400).json({ error: "Failed to fetch indications" });
    }
  });

  // Admin routes
  app.get("/api/admin/indications", async (req, res) => {
    try {
      const allIndications = await storage.getAllIndications();
      res.json(allIndications);
    } catch (error) {
      res.status(400).json({ error: "Failed to fetch all indications" });
    }
  });

  app.patch("/api/indications/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const id = parseInt(req.params.id);
      const indication = await storage.updateIndicationStatus(id, status);

      // Se a indicação foi aceita, criar uma recompensa
      if (status === "completed") {
        // TODO: Implementar lógica de recompensa
        // await storage.createReward(indication.userId, { discountPercentage: 5 });
      }

      res.json(indication);
    } catch (error) {
      res.status(400).json({ error: "Failed to update indication status" });
    }
  });

  // Novo endpoint para confirmar e enviar proposta
  app.post("/api/indications/:id/confirm-and-send", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { proposalUrl } = req.body; // Recebe a URL da proposta do frontend

      if (!proposalUrl) {
        return res.status(400).json({ error: "Proposal URL is required" });
      }

      // 1. Buscar a indicação
      const indication = await storage.getIndicationById(id);
      if (!indication) {
        return res.status(404).json({ error: "Indication not found" });
      }

      // 2. Atualizar status da indicação para 'confirmed' (ou similar)
      //    e marcar que as notificações/mensagens foram enviadas
      const updatedIndication = await storage.updateIndication(id, {
        status: "confirmed", // Ou um novo status apropriado
        proposalLink: proposalUrl,
        notificationSent: true,
        whatsappSent: true, // Marcar como enviado
      });

      // 3. Buscar dados do usuário que indicou para a notificação
      const referrerUser = await storage.getUserById(indication.userId);
      if (!referrerUser) {
        console.error(`Referrer user not found for indication ${id}`);
        // Continuar mesmo se o usuário não for encontrado? Ou retornar erro?
      }

      // 4. Enviar notificação push para quem indicou (se usuário encontrado)
      if (referrerUser && referrerUser.pushToken) { // Verificar se pushToken existe
         const pushMessage = `Sua indicação para ${indication.name} foi confirmada! Você ganhou 1% de desconto. Se contratarem, você ganha +1% na renovação.`;
         try {
           await sendPushNotification(referrerUser.pushToken, "Indicação Confirmada!", pushMessage);
         } catch (pushError) {
           console.error(`Failed to send push notification to ${referrerUser.email}:`, pushError);
           // Consider how to handle push notification errors (e.g., log, but continue)
         }
-        // await sendPushNotification(referrerUser.pushToken, "Indicação Confirmada!", pushMessage);
-         console.log(`Simulando envio de push para ${referrerUser.email}: ${pushMessage}`); // Placeholder
       }
 
       // 5. Enviar mensagem WhatsApp para o indicado
       const whatsappMessage = `Olá ${indication.name}, você foi indicado para conhecer nossos seguros! Acesse nossa proposta aqui: ${proposalUrl}`;
       try {
         await sendWhatsAppMessage(indication.phone, whatsappMessage);
       } catch (whatsappError) {
         console.error(`Failed to send WhatsApp message to ${indication.phone}:`, whatsappError);
         // Consider how to handle WhatsApp errors (e.g., log, but continue, or maybe revert status?)
       }
-      // await sendWhatsAppMessage(indication.phone, whatsappMessage);
-      console.log(`Simulando envio de WhatsApp para ${indication.phone}: ${whatsappMessage}`); // Placeholder
 
       res.json(updatedIndication);

    } catch (error: any) {
      console.error("Error confirming and sending indication:", error);
      res.status(500).json({ error: error.message || "Failed to confirm indication and send proposal" });
    }
  });

  app.patch("/api/indications/:id/proposal", async (req, res) => {
    try {
      const { proposalLink } = req.body;
      const id = parseInt(req.params.id);
      const indication = await storage.updateIndicationProposal(id, proposalLink);
      res.json(indication);
    } catch (error) {
      res.status(400).json({ error: "Failed to update proposal link" });
    }
  });

  // Reward routes
  app.post("/api/users/:userId/rewards", async (req, res) => {
    try {
      const rewardData = insertRewardSchema.parse(req.body);
      const userId = parseInt(req.params.userId);
      const reward = await storage.createReward(userId, rewardData);
      res.json(reward);
    } catch (error) {
      res.status(400).json({ error: "Invalid reward data" });
    }
  });

  app.get("/api/users/:userId/active-reward", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const reward = await storage.getActiveRewardByUserId(userId);
      if (!reward) {
        res.status(404).json({ error: "No active reward found" });
        return;
      }
      res.json(reward);
    } catch (error) {
      res.status(400).json({ error: "Failed to fetch reward" });
    }
  });

  // Admin promotion route
  app.post("/api/admin/promote", async (req, res) => {
    try {
      const { email, adminKey } = req.body;

      if (adminKey !== ADMIN_SECRET_KEY) {
        res.status(403).json({ error: "Invalid admin key" });
        return;
      }

      const users = await storage.getAllUsers();
      const user = users.find(u => u.email === email);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const updatedUser = await storage.updateUser(user.id, { isAdmin: true });
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: "Failed to promote user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}