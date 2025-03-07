import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdminPromote() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiRequest("POST", "/api/admin/promote", {
        email,
        adminKey
      });

      toast({
        title: "Sucesso",
        description: "Usuário promovido a administrador!"
      });

      setLocation("/admin/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Chave de administrador inválida ou usuário não encontrado."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Promover Administrador</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePromote} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email do Usuário</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@exemplo.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Chave de Administrador</label>
              <Input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Digite a chave secreta"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Promovendo..." : "Promover para Administrador"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
