import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, auth, UserRole } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  role: UserRole | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: Error }>
  signUp: (email: string, password: string) => Promise<{ error?: Error }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar sessão inicial
    auth.getSession().then(({ session }) => {
      if (session?.user) {
        setUser(session.user)
        setRole(session.user.user_metadata.role as UserRole)
      }
      setLoading(false)
    })

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setRole(session?.user?.user_metadata.role as UserRole ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await auth.signInWithEmail(email, password)
    if (error) return { error }
    return {}
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await auth.signUpWithEmail(email, password)
    if (error) return { error }
    return {}
  }

  const signOut = async () => {
    await auth.signOut()
  }

  const value = {
    user,
    role,
    loading,
    signIn,
    signUp,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
