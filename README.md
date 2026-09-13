# LH Consultores · Frontend

Sitio web del despacho contable LH Consultores: página principal, blog informativo, plantilla promocional para redes sociales y panel de administración.

> **Estado:** maqueta de vista previa (Fase 1). Consume la API de [LHConsultoria-backend](https://github.com/DannNS20/LHConsultoria-backend), que por ahora guarda los datos en memoria.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- Animaciones: [React Bits](https://reactbits.dev) (GSAP y Motion)
- Imágenes para redes generadas con `next/og`

## Requisitos

- Node.js 20.9 o superior
- pnpm
- La API corriendo (por defecto en `http://localhost:4000`)

## Puesta en marcha

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Abre `http://localhost:3000`.

## Variables de entorno

| Variable | Descripción |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | URL pública de la API, usada desde el navegador |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio; se usa en las ligas para compartir |
| `API_INTERNAL_URL` | Opcional. URL interna de la API para peticiones del servidor (p. ej. red de Docker) |

## Rutas

| Ruta | Contenido |
| --- | --- |
| `/` | Página principal: inicio, nosotros, servicios, proceso, por qué elegirnos, últimas entradas y contacto |
| `/blog` | Listado con búsqueda, categorías y paginación |
| `/blog/[slug]` | Entrada del blog con botón para compartir |
| `/blog/[slug]/imagen?formato=horizontal\|cuadrado\|historia` | Imagen promocional generada para redes |
| `/admin/login` | Acceso al panel |
| `/admin` | Resumen del panel |
| `/admin/entradas` | Administración de entradas y editor por bloques |
| `/admin/mensajes` | Mensajes del formulario de contacto |

Acceso de demostración al panel: `demo@lhconsultores.test` / `Demo2026!` (definido en el backend).

## Estructura

```
src/
├─ app/
│  ├─ (site)/        Sitio público (encabezado, pie y botón de WhatsApp)
│  └─ admin/         Panel de administración
├─ components/
│  ├─ home/          Secciones de la página principal
│  ├─ blog/          Tarjetas, portada, contenido y ventana para compartir
│  ├─ admin/         Editor, carga de imágenes y piezas del panel
│  ├─ brand/         Logotipo en SVG
│  └─ ui/            Botones, campos, íconos y animación de aparición
├─ lib/              Cliente de la API, tipos, contenido del sitio y sesión
└─ assets/fonts/     Fuentes usadas en las imágenes para redes
```

## Demo en GitHub Pages

El flujo `.github/workflows/deploy-demo.yml` publica en cada push a `main` una versión estática de demostración:

- Se compila con `NEXT_PUBLIC_DEMO_MODE=1`: exportación estática (`out/`) bajo el subdirectorio del repo.
- No usa backend: `src/lib/demo-api.ts` implementa el mismo contrato que la API con las entradas de ejemplo, y lo que se publica desde el panel se guarda en el navegador de quien lo prueba.
- Las entradas se leen en `/blog/ver/?slug=` y la imagen para compartir se genera en el navegador (`src/lib/share-canvas.ts`).
- Los archivos `*.dyn.tsx` necesitan servidor y se excluyen del build de la demo.

Requisitos en GitHub: repositorio público (o plan con Pages privado) y **Settings → Pages → Source: GitHub Actions**.

Probar la demo en local:

```bash
NEXT_PUBLIC_DEMO_MODE=1 NEXT_PUBLIC_BASE_PATH=/LHConsultoria pnpm build
```

## Pendiente antes de producción

- Reemplazar datos marcados como “por confirmar” en `src/lib/site.ts` (teléfono, correo, WhatsApp, cifras).
- Sustituir el logotipo recreado (`src/components/brand/Logo.tsx`) y la foto del titular por los archivos originales.
- Mover la sesión del panel de `localStorage` a cookie `httpOnly`.
