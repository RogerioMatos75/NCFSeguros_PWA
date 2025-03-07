import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogOut, UserCircle, Shield } from "lucide-react";
import { useLocation } from "wouter";
import { logOut } from "@/lib/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: user } = useQuery<User>({
    queryKey: [`/api/users/${auth.currentUser?.uid}`],
    enabled: !!auth.currentUser?.uid,
  });

  const handleLogout = async () => {
    try {
      await logOut();
      setLocation("/auth");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: "Não foi possível fazer logout. Tente novamente."
      });
    }
  };

  return (
    <div className="container p-4 pb-24">
      <Card>
        <CardHeader className="text-center">
          <UserCircle className="h-24 w-24 mx-auto text-primary" />
          <CardTitle className="mt-4">{user?.name}</CardTitle>
          <p className="text-muted-foreground">{user?.email}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Número da Apólice</label>
              <p className="text-lg">{user?.policyNumber || "Aguardando confirmação"}</p>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium">Data de Cadastro</label>
              <p className="text-lg">
                {user?.createdAt && new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            {user?.isAdmin && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setLocation("/admin/promote")}
              >
                <Shield className="mr-2 h-4 w-4" />
                Promover Administrador
              </Button>
            )}
            <Button
              variant="destructive"
              className="w-full mt-8"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}