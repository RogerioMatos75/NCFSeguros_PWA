import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { auth } from "@/lib/firebase";
import type { Indication } from "@shared/schema";

const statusMap = {
  pending: { label: "Pendente", variant: "secondary" },
  analyzing: { label: "Em Análise", variant: "warning" },
  completed: { label: "Concluída", variant: "success" },
  rejected: { label: "Rejeitada", variant: "destructive" },
} as const;

export default function History() {
  const { data: indications, isLoading } = useQuery<Indication[]>({
    queryKey: [`/api/users/${auth.currentUser?.uid}/indications`],
    enabled: !!auth.currentUser?.uid,
  });

  if (isLoading) {
    return (
      <div className="container p-4 pb-24">
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Indicações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-3 w-[150px]" />
                  </div>
                  <Skeleton className="h-6 w-[80px]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container p-4 pb-24">
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Indicações</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="space-y-4">
              {indications?.map((indication) => (
                <div
                  key={indication.id}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{indication.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(indication.createdAt), "dd 'de' MMMM", {
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                  <Badge variant={statusMap[indication.status as keyof typeof statusMap].variant}>
                    {statusMap[indication.status as keyof typeof statusMap].label}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
