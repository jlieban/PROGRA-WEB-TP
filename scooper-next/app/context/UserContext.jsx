'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const UserContext = createContext(null)

export function UserProvider({ children }) {
    const [usuario, setUsuario] = useState(null)

    useEffect(() => {
        // Leer la sesión activa al montar el componente
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUsuario({
                    id: session.user.id,
                    email: session.user.email,
                    nombre: session.user.user_metadata?.nombre || session.user.email
                })
            }
        })

        // Escuchar cambios de sesión en tiempo real:
        // dispara cuando el usuario inicia sesión, cierra sesión, o el token se renueva
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                // Obtener el rol del usuario desde la tabla usuarios
                const { data: perfil } = await supabase
                    .from('usuarios')
                    .select('rol')
                    .eq('id', session.user.id)
                    .single()

                setUsuario({
                    id: session.user.id,
                    email: session.user.email,
                    nombre: session.user.user_metadata?.nombre || session.user.email,
                    rol: perfil?.rol ?? 'cliente'
                })
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
