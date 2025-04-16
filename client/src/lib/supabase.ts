import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aublvsyiuiikddkdhclz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1Ymx2c3lpdWlpa2Rka2RoY2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MjMyNzUsImV4cCI6MjA2MDM5OTI3NX0.u_2P64XBRS6H4KUWz1r-Kns1s9I2pVOkWxCOYHL-tD4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserRole = 'admin' | 'client'

// Funções de autenticação
export const auth = {
    // Login com email/senha
    signInWithEmail: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        return { data, error }
    },

    // Registro de novo usuário
    signUpWithEmail: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    role: 'client' // papel padrão para novos usuários
                }
            }
        })
        return { data, error }
    },

    // Logout
    signOut: async () => {
        const { error } = await supabase.auth.signOut()
        return { error }
    },

    // Obter usuário atual
    getCurrentUser: async () => {
        const { data: { user }, error } = await supabase.auth.getUser()
        return { user, error }
    },

    // Obter sessão atual
    getSession: async () => {
        const { data: { session }, error } = await supabase.auth.getSession()
        return { session, error }
    }
}