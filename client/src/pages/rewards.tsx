import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";

export default function Rewards() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: rewards } = useQuery({
    queryKey: ['rewards', user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/rewards/${user?.id}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar recompensas');
      }
      return response.json();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar suas recompensas"
      });
    }
  });

  return (
    <div className="container p-4 pb-24">
      <Card>
        <CardHeader>
          <CardTitle>Minhas Recompensas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progresso para próxima recompensa</span>
                <span>{rewards?.progress || 0}%</span>
              </div>
              <Progress value={rewards?.progress || 0} />
            </div>

            {rewards?.available?.map((reward: any) => (
              <Card key={reward.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{reward.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {reward.description}
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-primary">
                      {reward.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}

            {(!rewards?.available || rewards.available.length === 0) && (
              <p className="text-center text-muted-foreground">
                Você ainda não tem recompensas disponíveis.
                Continue indicando para ganhar!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
