import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";

const adminLoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { signIn } = useAuth();

  const form = useForm<z.infer<typeof adminLoginSchema>>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (data: z.infer<typeof adminLoginSchema>) => {
    try {
      // Tenta fazer login com Supabase
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (signInError) throw signInError;

      // Verifica se o usuário é admin
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user || user.user_metadata.role !== 'admin') {
        throw new Error('Acesso não autorizado. Apenas administradores podem entrar.');
      }

      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao painel administrativo"
      });

      setLocation("/admin/dashboard");
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: error instanceof Error ? error.message : "Credenciais inválidas"
      });
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Lock className="mx-auto h-12 w-12 text-primary" />
          <h1 className="text-2xl font-bold">Acesso Administrativo</h1>
          <p className="text-muted-foreground">
            Entre com suas credenciais administrativas
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="admin@ncfseguros.com" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
