# Desafío Semana 13 - Integración Mercado Pago Sandbox

## Setup

- SDK instalado: `mercadopago`
- Tipo de integración: **Checkout Pro**
- Credenciales configuradas en `.env.local` y Vercel

### Variables de entorno
```
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-...
NEXT_PUBLIC_APP_URL=https://scooper-prograwebtp.vercel.app
```

## Cuentas de prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Vendedor | (completar con email de cuenta vendedor) | (completar) |
| Comprador | (completar con email de cuenta comprador) | (completar) |

## Tarjetas de prueba

| Resultado | Número | Vencimiento | CVV | Titular |
|-----------|--------|-------------|-----|---------|
| Aprobada | 4111 1111 1111 1111 | 11/25 | 123 | APRO |
| Rechazada | 4111 1111 1111 1112 | 11/25 | 123 | OTHE |
| Pendiente | 4111 1111 1111 1113 | 11/25 | 123 | PENDING |

## API

### POST /api/pagos/crear-preferencia
- Recibe: `{ orden_id }`
- Verifica autenticación y que la orden pertenece al usuario
- Crea preferencia con SDK de Mercado Pago
- Retorna: `{ init_point, preference_id }`

## Páginas

- `/checkout?orden_id=X` — resumen de orden y botón de pago
- `/pago-completado` — confirmación de pago exitoso
- `/pago-fallido` — mensaje de pago rechazado con opción de reintentar
- `/pago-pendiente` — aviso de pago en proceso

## Webhook

- Endpoint preparado en `/api/webhooks/mercado-pago`
- Implementación completa en Semana 14

## Flujo de testing

1. Loguearse con cuenta de prueba **comprador**
2. Agregar productos al carrito
3. Confirmar compra → se crea orden en estado `pendiente`
4. Ir a `/checkout?orden_id=X`
5. Click en "Pagar con Mercado Pago" → redirección a MP
6. Usar tarjeta de prueba APROBADA
7. Redirige a `/pago-completado`
8. Verificar en Supabase que la orden existe
