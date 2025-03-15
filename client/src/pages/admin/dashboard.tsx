import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X, Send, ClipboardList } from "lucide-react";
import type { Indication } from "@shared/schema";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";

const statusMap = {
  pending: { label: "Pendente", variant: "secondary" as const },
  analyzing: { label: "Em Análise", variant: "outline" as const },
  completed: { label: "Concluída", variant: "default" as const },
  rejected: { label: "Rejeitada", variant: "destructive" as const },
} as const;

export default function AdminDashboard() {
  const { toast } = useToast();
  const { data: allIndications, isLoading } = useQuery<Indication[]>({
    queryKey: ["/api/admin/indications"],
  });

  const updateIndicationStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest(
        "PATCH",
        `/api/indications/${id}/status`,
        { status }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/indications"] });
      toast({
        title: "Status atualizado",
        description: "O status da indicação foi atualizado com sucesso!"
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o status da indicação."
      });
    }
  });

  const sendWhatsAppLink = (phone: string, name: string) => {
    // TODO: Implementar envio do link da proposta via WhatsApp
    const message = `Olá ${name}, obrigado pela sua indicação! Aqui está o link para a proposta: [LINK]`;
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const [, setLocation] = useLocation();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container p-4">
      <h1 className="text-2xl font-bold mb-6">Painel Administrativo</h1>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="cursor-pointer" onClick={() => setLocation("/admin/indications")}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClipboardList className="mr-2 h-5 w-5" />
              Gerenciar Indicações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Visualize e gerencie todas as indicações recebidas
            </p>
          </CardContent>
        </Card>
      </div>

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
                      {format(new Date(indication.createdAt!), "dd 'de' MMMM", {
                        locale: ptBR,
                      })}
                    </p>
                    <p className="text-sm">Email: {indication.email}</p>
                    <p className="text-sm">Telefone: {indication.phone}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={statusMap[indication.status as keyof typeof statusMap].variant}>
                      {statusMap[indication.status as keyof typeof statusMap].label}
                    </Badge>
                    {indication.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-500"
                          onClick={() => updateIndicationStatus.mutate({
                            id: indication.id,
                            status: "completed"
                          })}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500"
                          onClick={() => updateIndicationStatus.mutate({
                            id: indication.id,
                            status: "rejected"
                          })}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {indication.status === "completed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => sendWhatsAppLink(indication.phone, indication.name)}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Link
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}