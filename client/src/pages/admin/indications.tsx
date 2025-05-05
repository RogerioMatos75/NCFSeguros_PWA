import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Indication } from "@/../../shared/schema";
import { Check, Send } from "lucide-react";

export default function AdminIndications() {
  const { toast } = useToast();
  const { data: indications, refetch } = useQuery<Indication[]>({ // Adicionado refetch
    queryKey: ["/api/indications"],
  });

  const approveIndication = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/indications/${id}/approve`, {
        method: "POST"
      });
      if (!response.ok) throw new Error("Falha ao aprovar indicação");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Indicação aprovada",
        description: "O usuário será notificado automaticamente."
      });
    }
  });

  const sendProposalLink = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/indications/${id}/send-proposal`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: "https://villa.segfy.com/Publico/Segurados/Orcamentos/SolicitarCotacao?e=P6pb0nbwjHfnbNxXuNGlxw%3D%3D"
        })
      });
      if (!response.ok) throw new Error("Falha ao enviar link");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Proposta Enviada",
        description: "O link foi enviado via WhatsApp para o indicado"
      });
      refetch(); // Atualiza a lista após sucesso
    }
  });

  const confirmAndSendProposal = useMutation({ // Nova mutação
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/indications/${id}/confirm-and-send`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          proposalUrl: "https://villa.segfy.com/Publico/Segurados/Orcamentos/SolicitarCotacao?e=P6pb0nbwjHfnbNxXuNGlxw%3D%3D"
        })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        throw new Error(errorData.message || "Falha ao confirmar e enviar proposta");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Indicação Confirmada e Proposta Enviada",
        description: "Notificações enviadas e status atualizado."
      });
      refetch(); // Atualiza a lista após sucesso
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível completar a ação."
      });
    }
  });

  return (
    <div className="container p-4">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Indicações</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[70vh]">
            {indications?.map((indication) => (
              <div key={indication.id} className="flex items-center justify-between p-4 border-b">
                <div className="space-y-2">
                  <div>
                    <h3 className="font-medium">{indication.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Indicado por: {indication.userId}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Email:</span> {indication.email}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Telefone:</span> {indication.phone}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Status:</span>{" "}
                      <span className={`${indication.status === "completed"
                        ? "text-green-500"
                        : "text-yellow-500"
                        }`}>
                        {indication.status === "completed" ? "Aprovado" : "Pendente"}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {indication.status !== "completed" && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => approveIndication.mutate(indication.id)}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Aprovar
                    </Button>
                  )}
                  {indication.status === "pending" && ( // Mostrar apenas se pendente
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => confirmAndSendProposal.mutate(indication.id)}
                      disabled={confirmAndSendProposal.isPending} // Desabilitar enquanto carrega
                    >
                      <Check className="mr-2 h-4 w-4" />
                      {confirmAndSendProposal.isPending ? 'Processando...' : 'Confirmar e Enviar'}
                    </Button>
                  )}
                  {/* Manter o botão de enviar proposta separadamente, se necessário, ou remover se o novo botão o substitui */}
                  {/* <Button
                    size="sm"
                    variant="outline"
                    onClick={() => sendProposalLink.mutate(indication.id)}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Proposta (Apenas Link)
                  </Button> */}
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
