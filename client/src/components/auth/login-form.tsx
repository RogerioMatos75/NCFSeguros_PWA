import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInWithGoogle, handleAuthRedirect } from "@/lib/auth";
import { useLocation } from "wouter";
import { FcGoogle } from "react-icons/fc";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export function LoginForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    handleAuthRedirect().then((user) => {
      if (user) {
        // Verificar se o usuário é admin
        fetch(`/api/users/${user.uid}`).then(async (res) => {
          if (res.ok) {
            const userData = await res.json();
            if (userData.isAdmin) {
              setLocation("/admin/dashboard");
            } else {
              setLocation("/dashboard");
            }
          }
        }).catch((error) => {
          console.error("Error checking user role:", error);
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Erro ao verificar permissões do usuário"
          });
        });
      }
    }).catch((error) => {
      console.error("Auth redirect error:", error);
      toast({
        variant: "destructive",
        title: "Erro de autenticação",
        description: "Não foi possível fazer login com o Google"
      });
    });
  }, [setLocation, toast]);

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      // Implement email/password login
      setLocation("/dashboard");
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao fazer login"
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      // O redirecionamento será tratado pelo useEffect
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao iniciar login com Google"
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
          Google
        </Button>
      </form>
    </Form>
  );
}