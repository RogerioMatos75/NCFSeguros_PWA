import { Router } from "express";
import { db } from "../db/index.js";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/admin/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Por enquanto, vamos usar credenciais fixas para teste
        if (email === "admin@ncfseguros.com" && password === "admin123") {
            res.json({ success: true });
        } else {
            res.status(401).json({ error: "Credenciais inválidas" });
        }
    } catch (error) {
        res.status(500).json({ error: "Erro interno" });
    }
});

export default router;
