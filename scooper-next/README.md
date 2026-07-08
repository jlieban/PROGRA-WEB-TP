# SCOOPER — Helados Artesanales 🍦

E-commerce de helados artesanales desarrollado como trabajo práctico de Programación Web (ITBA, 2026).

**Deploy:** [scooper-prograwebtp.vercel.app](https://scooper-prograwebtp.vercel.app)

---

## Tecnologías

- **Next.js 16** — framework full-stack con App Router
- **React 19** — UI con componentes y hooks
- **Supabase** — base de datos PostgreSQL + autenticación
- **Mercado Pago** — integración de pagos y webhooks
- **GitHub Actions** — CI (lint y build automático en cada push/PR a `main`)
- **Vercel** — CD (deploy automático a producción tras cada push a `main`)

---

## Funcionalidades

- Catálogo de productos con detalle individual
- Carrito de compras persistente por usuario
- Registro e inicio de sesión con roles (`cliente` / `admin`)
- Checkout con integración a Mercado Pago
- Webhook para actualización automática del estado de la orden al recibir confirmación de pago
- Panel de administración con CRUD completo de productos y gestión de órdenes
- Historial de órdenes por usuario

---

## Estructura del proyecto

```
scooper-next/
├── app/
│   ├── api/              # API Routes (Next.js)
│   │   ├── admin/        # Gestión de productos y órdenes (solo admin)
│   │   ├── auth/         # Login, registro y verificación de rol
│   │   ├── carrito/      # CRUD del carrito
│   │   ├── checkout/     # Creación de orden con validación de stock
│   │   ├── pagos/        # Preferencia de pago y confirmación
│   │   ├── productos/    # Catálogo público
│   │   ├── ordenes/      # Órdenes del usuario autenticado
│   │   └── webhooks/     # Notificaciones de Mercado Pago
│   ├── components/       # Componentes reutilizables
│   ├── context/          # CartContext y UserContext
│   ├── admin/            # Panel de administración
│   ├── checkout/         # Página de checkout
│   ├── login/ y registro/
│   ├── ordenes/          # Historial de compras
│   └── producto/[id]/    # Detalle de producto
├── lib/
│   ├── supabase.js       # Cliente público de Supabase
│   ├── supabase-admin.js # Cliente admin (server-side)
│   └── mercadopago.js    # Cliente de Mercado Pago
└── public/               # Imágenes de productos
```

---

## Correr localmente

### 1. Clonar el repositorio

```bash
git clone git@github.com:jlieban/PROGRA-WEB-TP.git
cd PROGRA-WEB-TP/scooper-next
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env.local` con las siguientes variables:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu_clave_publica_supabase
MERCADOPAGO_ACCESS_TOKEN=tu_access_token_mp
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=tu_public_key_mp
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Correr el servidor de desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

---

## Etapas del proyecto

El TP se desarrolló en tres etapas progresivas:

1. **HTML + CSS + JS vanilla** — landing semántica, carrito con DOM dinámico, fetch a JSON local
2. **React** — migración a componentes, useState/useEffect, props y context
3. **Next.js** — App Router, API Routes, integración con Supabase y Mercado Pago
