import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Check, Send } from "lucide-react";
import type { Indication } from "@shared/schema";

export default function AdminIndications() {
  const { toast } = useToast();
  const { data: indications } = useQuery<Indication[]>({
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
                      <span className={`${
                        indication.status === "completed" 
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => sendProposalLink.mutate(indication.id)}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Proposta
                  </Button>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
