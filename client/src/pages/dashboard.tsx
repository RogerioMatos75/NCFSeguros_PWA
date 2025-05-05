import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, FileText } from "lucide-react";
import { useLocation } from "wouter";
import { SummaryStats } from "@/components/dashboard/summary-stats";
import { auth } from "@/lib/firebase";
import type { User } from "@shared/schema";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  const { data: user } = useQuery<User>({
    queryKey: [`/api/users/${auth.currentUser?.uid}`],
    enabled: !!auth.currentUser?.uid,
  });

  return (
    <DashboardLayout>
      <div className="py-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Bem-vindo, {user?.name?.split(' ')[0]}!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Indique amigos e ganhe descontos em seu seguro
            </p>
            <div className="space-y-4 mt-4">
              <Button
                className="w-full"
                onClick={() => setLocation("/indicate")}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Indicar Agora
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setLocation("/dashboard/proposal")}
              >
                <FileText className="mr-2 h-4 w-4" />
                Solicitar Cotação
              </Button>
            </div>
          </CardContent>
        </Card>

        <SummaryStats />
      </div>
    </DashboardLayout>
  );
}
