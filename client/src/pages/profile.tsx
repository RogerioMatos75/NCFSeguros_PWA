import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogOut, UserCircle, Edit2 } from "lucide-react";
import { useLocation } from "wouter";
import { logOut } from "@/lib/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { User } from "@shared/schema";

const updateProfileSchema = z.object({
  policyNumber: z.string().min(1, "Número da apólice é obrigatório"),
});

export default function Profile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: user } = useQuery<User>({
    queryKey: [`/api/users/${auth.currentUser?.uid}`],
    enabled: !!auth.currentUser?.uid,
  });

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      policyNumber: user?.policyNumber || "",
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (data: z.infer<typeof updateProfileSchema>) => {
      const res = await apiRequest(
        "PATCH",
        `/api/users/${auth.currentUser?.uid}`,
        data
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: [`/api/users/${auth.currentUser?.uid}`] 
      });
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso!"
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar seu perfil. Tente novamente."
      });
    }
  });

  const handleLogout = async () => {
    try {
      await logOut();
      setLocation("/auth");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: "Não foi possível fazer logout. Tente novamente."
      });
    }
  };

  const onSubmit = (data: z.infer<typeof updateProfileSchema>) => {
    updateProfile.mutate(data);
  };

  return (
    <div className="container p-4 pb-24">
      <Card>
        <CardHeader className="text-center">
          <UserCircle className="h-24 w-24 mx-auto text-primary" />
          <CardTitle className="mt-4">{user?.name}</CardTitle>
          <p className="text-muted-foreground">{user?.email}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="policyNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número da Apólice</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input placeholder="Digite o número da apólice" {...field} />
                          <Button 
                            type="submit"
                            size="icon"
                            disabled={updateProfile.isPending}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>

            <Separator />

            <div>
              <label className="text-sm font-medium">Data de Cadastro</label>
              <p className="text-lg">
                {user?.createdAt && new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>

            <Button
              variant="destructive"
              className="w-full mt-8"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}