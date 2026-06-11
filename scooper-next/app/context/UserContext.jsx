'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const UserContext = createContext(null)

export function UserProvider({ children }) {
    const [usuario, setUsuario] = useState(undefined)

    useEffect(() => {
        // onAuthStateChange dispara INITIAL_SESSION al montar (equivalente a getSession),
        // además de LOGIN, LOGOUT y renovación de token.
        // Usar solo esto evita la race condition entre getSession y onAuthStateChange.
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                // Setear usuario inmediatamente para no bloquear el login
                setUsuario({
                    id: session.user.id,
                    email: session.user.email,
                    nombre: session.user.user_metadata?.nombre || session.user.email,
                    rol: 'cliente'
                })
                // Obtener el rol real en segundo plano
                try {
                    const { data: perfil } = await supabase
                        .from('usuarios')
                        .select('rol')
                        .eq('id', session.user.id)
                        .single()

                    if (perfil?.rol) {
                        setUsuario(prev => prev ? { ...prev, rol: perfil.rol } : prev)
                    }
                } catch (_) {}
            } else {
                setUsuario(null)
            }
        })

        // Cleanup: cancelar la suscripción cuando el componente se desmonta
        return () => subscription.unsubscribe()
    }, [])

    async function logout() {
        await supabase.auth.signOut()
        // onAuthStateChange se encarga de setUsuario(null)
    }

    return (
        <UserContext.Provider value={{ usuario, logout }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    return useContext(UserContext)
}
