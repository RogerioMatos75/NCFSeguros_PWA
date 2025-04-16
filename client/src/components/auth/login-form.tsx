import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { FcGoogle } from "react-icons/fc";
import { Shield } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { signInWithGoogle } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export function LoginForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { signIn } = useAuth();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        // Verificar role nos metadados
        if (user.user_metadata?.role === 'admin') {
          setLocation("/admin/dashboard");
        } else {
          setLocation("/dashboard");
        }

        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!"
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao fazer login com Google"
      });
    }
  };

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const { error } = await signIn(data.email, data.password);

      if (error) throw error;

      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!"
      });

      setLocation("/dashboard");
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="seu@email.com" {...field} />
              </FormControl>
              <FormMessage />
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
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4">
          <Button type="submit" className="w-full">
            Entrar
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou continue com
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="mr-2 h-4 w-4" />
            Entrar com Google
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => setLocation("/admin/login")}
          >
            <Shield className="mr-2 h-4 w-4" />
            Acesso Administrador
          </Button>
        </div>
      </form>
    </Form>
  );
}