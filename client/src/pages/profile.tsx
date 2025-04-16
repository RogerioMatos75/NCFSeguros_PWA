import { useLocation } from "wouter";
import { UserCircle, LogOut, Shield } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
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
          <CardTitle className="mt-4">{user?.email}</CardTitle>
          <p className="text-muted-foreground">{user?.user_metadata?.role || 'Cliente'}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {user?.user_metadata?.role === 'admin' && (
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