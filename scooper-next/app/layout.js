import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '500'],
    style: ['normal', 'italic'],
    variable: '--font-playfair',
})

const dmSans = DM_Sans({
    subsets: ['latin'],
    weight: ['300', '400', '500'],
    variable: '--font-dm-sans',
})

export const metadata = {
    title: 'SCOOPER — Helados Artesanales',
    description: 'SCOOPER — Helados artesanales con ingredientes seleccionados. Sin artificios, sin apuros.',
}

export default function RootLayout({ children }) {
    return (
        <html lang="es" className={`${playfair.variable} ${dmSans.variable}`}>
            <body>{children}</body>
        </html>
    )
}
