'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext(null)

export function UserProvider({ children }) {
    const [usuario, setUsuario] = useState(null)

    // useEffect corre solo en el cliente, después de la hidratación
    // Es la única forma segura de leer localStorage en Next.js
    useEffect(() => {
        const guardado = localStorage.getItem('usuario')
        if (guardado) setUsuario(JSON.parse(guardado))
    }, [])

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
