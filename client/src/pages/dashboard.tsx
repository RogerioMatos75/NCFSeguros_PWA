import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
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
    <div className="container p-4 pb-24">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Bem-vindo, {user?.name?.split(' ')[0]}!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Indique amigos e ganhe descontos em seu seguro
          </p>
          <Button 
            className="w-full mt-4"
            onClick={() => setLocation("/indicate")}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Indicar Agora
          </Button>
        </CardContent>
      </Card>

      <SummaryStats />
    </div>
  );
}
