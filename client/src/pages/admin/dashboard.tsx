import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Indication } from "@shared/schema";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusMap = {
  pending: { label: "Pendente", variant: "secondary" },
  analyzing: { label: "Em Análise", variant: "warning" },
  completed: { label: "Concluída", variant: "success" },
  rejected: { label: "Rejeitada", variant: "destructive" },
} as const;

export default function AdminDashboard() {
  const { data: allIndications, isLoading } = useQuery<Indication[]>({
    queryKey: ["/api/admin/indications"],
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container p-4">
      <Card>
        <CardHeader>
          <CardTitle>Todas as Indicações</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-4">
              {allIndications?.map((indication) => (
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
                    <p className="text-sm">Email: {indication.email}</p>
                    <p className="text-sm">Telefone: {indication.phone}</p>
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
