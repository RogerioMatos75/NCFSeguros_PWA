import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus, Clock, CheckCircle, XCircle } from "lucide-react";
import { auth } from "@/lib/firebase";
import type { Indication } from "@shared/schema";

export function SummaryStats() {
  const { data: indications, isLoading } = useQuery<Indication[]>({
    queryKey: [`/api/users/${auth.currentUser?.uid}/indications`],
    enabled: !!auth.currentUser?.uid,
  });

  const stats = {
    total: indications?.length || 0,
    pending: indications?.filter(i => i.status === "pending").length || 0,
    completed: indications?.filter(i => i.status === "completed").length || 0,
    rejected: indications?.filter(i => i.status === "rejected").length || 0,
  };

  if (isLoading) {
    return <StatsSkeletons />;
  }

  return (
    <div className="grid gap-4 grid-cols-2">
      <StatsCard
        title="Total de Indicações"
        value={stats.total}
        icon={UserPlus}
        className="bg-primary/10"
      />
      <StatsCard
        title="Pendentes"
        value={stats.pending}
        icon={Clock}
        className="bg-yellow-500/10"
      />
      <StatsCard
        title="Concluídas"
        value={stats.completed}
        icon={CheckCircle}
        className="bg-green-500/10"
      />
      <StatsCard
        title="Rejeitadas"
        value={stats.rejected}
        icon={XCircle}
        className="bg-red-500/10"
      />
    </div>
  );
}

function StatsCard({ 
  title, 
  value, 
  icon: Icon,
  className 
}: { 
  title: string;
  value: number;
  icon: any;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function StatsSkeletons() {
  return (
    <div className="grid gap-4 grid-cols-2">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Skeleton className="h-8 w-[50px]" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
