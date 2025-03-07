import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { insertIndicationSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { auth } from "@/lib/firebase";
import type { InsertIndication } from "@shared/schema";

export function IndicationForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertIndication>({
    resolver: zodResolver(insertIndicationSchema.extend({
      phone: insertIndicationSchema.shape.phone.regex(
        /^\(\d{2}\) \d{5}-\d{4}$/,
        "Formato: (99) 99999-9999"
      )
    })),
    defaultValues: {
      name: "",
      email: "",
      phone: ""
    }
  });

  const createIndication = useMutation({
    mutationFn: async (data: InsertIndication) => {
      const res = await apiRequest(
        "POST",
        `/api/users/${auth.currentUser?.uid}/indications`,
        data
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: [`/api/users/${auth.currentUser?.uid}/indications`] 
      });
      form.reset();
      toast({
        title: "Indicação enviada",
        description: "Sua indicação foi registrada com sucesso!"
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível enviar sua indicação. Tente novamente."
      });
    }
  });

  const onSubmit = (data: InsertIndication) => {
    createIndication.mutate(data);
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d)(\d{4})$/, '$1-$2');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Indicado</FormLabel>
              <FormControl>
                <Input placeholder="Nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="email@exemplo.com" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input
                  placeholder="(99) 99999-9999"
                  {...field}
                  onChange={(e) => {
                    field.onChange(formatPhone(e.target.value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full"
          disabled={createIndication.isPending}
        >
          {createIndication.isPending ? "Enviando..." : "Enviar Indicação"}
        </Button>
      </form>
    </Form>
  );
}
