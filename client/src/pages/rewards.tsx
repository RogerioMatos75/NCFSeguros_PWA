import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Gift } from "lucide-react";
import { auth } from "@/lib/firebase";
import type { Reward } from "@shared/schema";

const DISCOUNT_LEVELS = [
  { threshold: 0, discount: 0 },
  { threshold: 3, discount: 5 },
  { threshold: 5, discount: 10 },
  { threshold: 10, discount: 15 },
];

export default function Rewards() {
  const { data: activeReward } = useQuery<Reward>({
    queryKey: [`/api/users/${auth.currentUser?.uid}/active-reward`],
    enabled: !!auth.currentUser?.uid,
  });

  const { data: indications } = useQuery<Reward[]>({
    queryKey: [`/api/users/${auth.currentUser?.uid}/indications`],
    enabled: !!auth.currentUser?.uid,
  });

  const completedIndications = indications?.filter(i => i.status === "completed").length || 0;
  const currentLevel = DISCOUNT_LEVELS.findIndex(level => completedIndications < level.threshold) - 1;
  const currentDiscount = DISCOUNT_LEVELS[Math.max(0, currentLevel)].discount;
  const nextLevel = DISCOUNT_LEVELS[currentLevel + 1];
  
  const progress = nextLevel
    ? ((completedIndications - DISCOUNT_LEVELS[currentLevel].threshold) /
      (nextLevel.threshold - DISCOUNT_LEVELS[currentLevel].threshold)) * 100
    : 100;

  return (
    <div className="container p-4 pb-24">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center space-x-4">
          <Gift className="h-8 w-8 text-primary" />
          <div>
            <CardTitle>Seu Desconto Atual</CardTitle>
            <p className="text-3xl font-bold mt-2">{currentDiscount}%</p>
          </div>
        </CardHeader>
        <CardContent>
          {nextLevel && (
            <>
              <div className="flex justify-between text-sm mb-2">
                <span>Progresso para {nextLevel.discount}%</span>
                <span>{completedIndications}/{nextLevel.threshold} indicações</span>
              </div>
              <Progress value={progress} className="h-2" />
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Níveis de Desconto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {DISCOUNT_LEVELS.slice(1).map((level, index) => (
              <div
                key={level.threshold}
                className={`p-4 rounded-lg border ${
                  currentDiscount >= level.discount
                    ? "bg-primary/10 border-primary"
                    : "bg-background"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{level.discount}% de desconto</p>
                    <p className="text-sm text-muted-foreground">
                      {level.threshold} indicações concluídas
                    </p>
                  </div>
                  {currentDiscount >= level.discount && (
                    <span className="text-primary text-sm font-medium">
                      Conquistado!
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
