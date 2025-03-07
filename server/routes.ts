import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertIndicationSchema, insertRewardSchema } from "@shared/schema";

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

  // Nova rota administrativa para listar todas as indicações
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
      res.json(indication);
    } catch (error) {
      res.status(400).json({ error: "Failed to update indication status" });
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

  const httpServer = createServer(app);
  return httpServer;
}