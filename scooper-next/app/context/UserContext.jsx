'use client'

import { createContext, useContext, useState } from 'react'

const UserContext = createContext(null)

export function UserProvider({ children }) {
    // Inicializamos directo desde localStorage para evitar el flash de "no logueado"
    const [usuario, setUsuario] = useState(() => {
        if (typeof window !== 'undefined') {
            const guardado = localStorage.getItem('usuario')
            return guardado ? JSON.parse(guardado) : null
        }
        return null
    })

    function login(datos) {
        localStorage.setItem('usuario', JSON.stringify(datos))
        setUsuario(datos)
    }

    function logout() {
        localStorage.removeItem('usuario')
        setUsuario(null)
    }

    return (
        <UserContext.Provider value={{ usuario, login, logout }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    return useContext(UserContext)
}
