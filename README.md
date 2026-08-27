# Serxus — frontend SaaS base (`sass`)

Next.js (App Router) + Tailwind CSS v4 + shadcn/ui. La autenticación vive en el **auth-service** (Nest + Supabase); este frontend **no** usa el cliente de Supabase.

## Requisitos

- Node 20+
- `auth-service` en ejecución (por defecto `http://localhost:3001`)

## Configuración

```bash
cp .env.local.example .env.local
# Ajustá NEXT_PUBLIC_AUTH_SERVICE_URL si tu API corre en otro host/puerto
npm install
npm run dev
```

## Flujo de auth (alineado con `auth-service`)

1. El formulario de login valida con Zod + React Hook Form.
2. La **Server Action** `loginAction` hace `POST /auth/sign-in` con `{ email, password, client: "backoffice" }` para permitir cuentas de club; la app móvil envía `client: "app"` y el API rechaza cuentas de panel (`is_club` / roles de staff).
3. La respuesta incluye `accessToken`; Next lo guarda en una cookie **HttpOnly** (`SESSION_COOKIE_NAME`).
4. `GET /auth/me` se llama desde el servidor con `Authorization: Bearer <accessToken>`.
5. `logoutAction` borra la cookie en Next (no hay endpoint de logout en el auth-service actual).

### Registro de club (`/register`)

La ruta **solo** da de alta cuentas con `isClub: true`: la Server Action llama a `POST /auth/sign-up` con `{ email, password, fullName?, isClub: true }`, igual que el metadata `is_club` que espera Supabase vía `auth-service`. Tras un registro exitoso se redirige a `/login?registered=1`.

La UI de auth sigue la misma línea visual que **events-starter** (verde `#1FB585`, fondo claro, formularios centrados), implementada con Tailwind y tokens en `globals.css`.

La función `hashPassword` en `lib/crypto.ts` queda disponible para tests u otros flujos; no se usa en el login contra Supabase.

## Scripts

| Comando             | Descripción          |
| ------------------- | -------------------- |
| `npm run dev`       | Desarrollo           |
| `npm run build`     | Producción           |
| `npm run lint`      | ESLint (flat config) |
| `npm run typecheck` | `tsc --noEmit`       |
| `npm run test`      | Vitest (CI)          |
| `npm run format`    | Prettier             |

## CORS

El `auth-service` debe permitir el origen del frontend en `CORS_ORIGIN` (p. ej. `http://localhost:3000`) para que el flujo del navegador sea coherente si en el futuro exponés llamadas desde el cliente. Las Server Actions actuales llaman al API **desde el servidor**, así que en local suele bastar con tener ambos servicios arriba.
