import { Router } from "express";
import { createClient } from "@supabase/supabase-js";

const router = Router();

// Inicializar cliente Supabase para verificação de token
const supabaseAdmin = createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

// Middleware para verificar se o usuário é admin
const isAdmin = async (req: any, res: any, next: any) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: "Token não fornecido" });
        }

        const token = authHeader.replace("Bearer ", "");
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: "Token inválido" });
        }

        if (user.user_metadata?.role !== "admin") {
            return res.status(403).json({ error: "Acesso não autorizado" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Erro ao verificar admin:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Rotas protegidas por admin
router.use(isAdmin);

router.get("/admin/users", async (req, res) => {
    try {
        const { data: users, error } = await supabaseAdmin
            .from("profiles")
            .select("*");

        if (error) throw error;

        res.json(users);
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).json({ error: "Erro ao buscar usuários" });
    }
});

router.post("/admin/promote", async (req, res) => {
    const { userId } = req.body;

    try {
        const { error } = await supabaseAdmin.auth.admin.updateUserById(
            userId,
            { user_metadata: { role: "admin" } }
        );

        if (error) throw error;

        res.json({ success: true });
    } catch (error) {
        console.error("Erro ao promover usuário:", error);
        res.status(500).json({ error: "Erro ao promover usuário" });
    }
});

export default router;
