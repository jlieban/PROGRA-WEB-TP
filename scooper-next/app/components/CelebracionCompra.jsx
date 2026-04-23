'use client'

import { useEffect } from 'react'

export default function CelebracionCompra({ onTerminar }) {
    useEffect(() => {
        const timer = setTimeout(onTerminar, 5500)
        return () => clearTimeout(timer)
    }, [onTerminar])

    return (
        <div className="celebracion-overlay" onClick={onTerminar}>
            <div className="celebracion-contenido">
                <svg className="helado-svg" viewBox="0 0 300 440" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="150,420 72,205 228,205" fill="#C8922A" />
                    <polygon points="150,420 72,205 228,205" fill="url(#cono-sombra)" />
                    <line x1="72"  y1="205" x2="150" y2="420" stroke="#A67520" strokeWidth="1.2" opacity="0.5" />
                    <line x1="107" y1="205" x2="150" y2="420" stroke="#A67520" strokeWidth="1.2" opacity="0.5" />
                    <line x1="150" y1="205" x2="150" y2="420" stroke="#A67520" strokeWidth="1.2" opacity="0.5" />
                    <line x1="193" y1="205" x2="150" y2="420" stroke="#A67520" strokeWidth="1.2" opacity="0.5" />
                    <line x1="228" y1="205" x2="150" y2="420" stroke="#A67520" strokeWidth="1.2" opacity="0.5" />
                    <line x1="76"  y1="245" x2="224" y2="245" stroke="#A67520" strokeWidth="1.2" opacity="0.5" />
                    <line x1="88"  y1="285" x2="212" y2="285" stroke="#A67520" strokeWidth="1.2" opacity="0.5" />
                    <line x1="104" y1="325" x2="196" y2="325" stroke="#A67520" strokeWidth="1.2" opacity="0.5" />
                    <line x1="122" y1="365" x2="178" y2="365" stroke="#A67520" strokeWidth="1.2" opacity="0.5" />
                    <ellipse className="scoop-bottom" cx="150" cy="202" rx="78" ry="68" fill="#D4896A" />
                    <ellipse cx="122" cy="178" rx="22" ry="13" fill="rgba(255,255,255,0.18)" transform="rotate(-20,122,178)" />
                    <ellipse className="drip-1" cx="112" cy="230" rx="11" ry="22" fill="#C0754A" />
                    <ellipse className="drip-2" cx="190" cy="222" rx="9"  ry="18" fill="#C0754A" />
                    <circle className="scoop-top" cx="150" cy="122" r="72" fill="#EED5A8" />
                    <ellipse cx="124" cy="100" rx="22" ry="14" fill="rgba(255,255,255,0.22)" transform="rotate(-25,124,100)" />
                    <ellipse className="drip-3" cx="100" cy="158" rx="10" ry="24" fill="#DEC090" />
                    <ellipse className="drip-4" cx="200" cy="152" rx="8"  ry="20" fill="#DEC090" />
                    <defs>
                        <linearGradient id="cono-sombra" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%"   stopColor="#000" stopOpacity="0.12" />
                            <stop offset="50%"  stopColor="#000" stopOpacity="0" />
                            <stop offset="100%" stopColor="#000" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>
                </svg>
                <p className="celebracion-titulo">¡Gracias por tu compra!</p>
                <p className="celebracion-sub">Tu pedido está siendo preparado</p>
            </div>
        </div>
    )
}
