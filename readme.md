# SCOOPER — Helados Artesanales 🍦

E-commerce de helados artesanales desarrollado como trabajo práctico de Programación Web (ITBA, 2026).

**Deploy:** [scooper-prograwebtp.vercel.app](https://scooper-prograwebtp.vercel.app)

---

## Etapas del proyecto

El TP se desarrolló en tres etapas progresivas:

### 1. HTML + CSS + JS vanilla (`/`)
Landing semántica y responsive, carrito con DOM dinámico, fetch a JSON local, validación de formularios.

### 2. React (`/scooper`)
Migración a componentes reutilizables, manejo de estado con useState/useEffect, props y Context API para el carrito.

### 3. Next.js (`/scooper-next`)
App Router, API Routes propias, integración con Supabase (base de datos + autenticación), Mercado Pago (checkout + webhooks) y deploy en Vercel.

---

## Tecnologías

- HTML5, CSS3, JavaScript vanilla
- React 19
- Next.js 16
- Supabase (PostgreSQL + Auth)
- Mercado Pago API
- GitHub Actions (CI: lint y build en cada push/PR)
- Vercel (CD: deploy automático a producción)

---

## Funcionalidades principales (versión Next.js)

- Catálogo de productos con detalle individual
- Carrito de compras persistente por usuario
- Registro e inicio de sesión con roles (`cliente` / `admin`)
- Checkout integrado con Mercado Pago
- Webhook para confirmar pagos automáticamente
- Panel de administración con CRUD de productos y gestión de órdenes
- Historial de órdenes por usuario
