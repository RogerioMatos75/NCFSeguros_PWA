import { useState } from "react"
import { useLocation } from "wouter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "./AuthProvider"
import { supabase } from "@/lib/supabase"

export function AdminLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const [, setLocation] = useLocation()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) throw signInError

      // Verificar se o usuário existe e é admin
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError) throw userError

      if (!user || user.user_metadata.role !== 'admin') {
        throw new Error('Acesso não autorizado. Apenas administradores podem entrar.')
      }

      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao painel administrativo"
      })

      setLocation("/admin/dashboard")
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Entrando..." : "Entrar como Administrador"}
      </Button>
    </form>
  )
}
