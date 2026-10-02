# Rock Experience

Landing page de la campaña ficticia **ROCK EXPERIENCE**. En ella el usuario conoce la campaña, consulta las experiencias disponibles (cargadas dinámicamente), ve el detalle de cada una y envía sus datos en un formulario de contacto que manda correos reales.

## Cómo ejecutar el proyecto

Requisitos: Node.js 20+ y [pnpm](https://pnpm.io/) 11.

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

| Comando                  | Descripción                          |
| ------------------------ | ------------------------------------ |
| `pnpm dev`               | Servidor de desarrollo en el puerto 3000 |
| `pnpm build`             | Build de producción                  |
| `pnpm start`             | Ejecuta el build de producción       |
| `pnpm lint`              | ESLint                               |
| `pnpm exec tsc --noEmit` | Verificación de tipos                |
| `pnpm test`              | Tests unitarios (Vitest)             |

### Variables de entorno

Crea un archivo `.env.local` en la raíz (está en `.gitignore` y nunca se sube al repositorio):

```bash
# Opcional. URL pública del sitio para metadata, Open Graph, sitemap y robots.
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Necesarias para que el formulario envíe correos (SMTP de Brevo u otro proveedor).
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=2525
SMTP_USER=tu-usuario-smtp
SMTP_PASS=tu-clave-smtp
SMTP_EMAIL_FROM=correo-remitente@dominio.com
```

Todas se validan con Zod en `src/lib/env.ts`. Las de SMTP solo se leen cuando se envía un correo, así que el sitio funciona sin ellas; en ese caso, al enviar el formulario se muestra el mensaje de error general.

### Simular los estados de carga y error

En desarrollo, la sección de experiencias acepta un parámetro para ver sus estados sin modificar código:

- `http://localhost:3000/?simular=carga`: retrasa la respuesta 4 segundos y muestra el skeleton.
- `http://localhost:3000/?simular=error`: fuerza el estado de error con el botón "Reintentar".

## Tecnologías utilizadas

| Tecnología | Uso |
| --- | --- |
| [Next.js 16](https://nextjs.org/) (App Router) | Framework: Server Components, Server Actions, rutas paralelas e interceptadas, `next/image`, `next/font`, metadata |
| React 19 | UI |
| TypeScript 5 (strict) | Tipado |
| Tailwind CSS 4 | Estilos con tokens de diseño en `@theme` (`app/globals.css`) |
| Zod 4 | Validación de datos, formulario, variables de entorno y respuestas externas |
| React Hook Form + `@hookform/resolvers` | Estado y validación del formulario en el cliente |
| Nodemailer | Envío de correos por SMTP (Brevo) |
| lucide-react | Íconos |
| Vitest | Tests unitarios |

## Estructura general

La arquitectura está organizada por **secciones**: cada bloque visual de la landing es una carpeta, y los textos viven separados de la UI.

```
app/                              # Solo rutas (App Router)
├── layout.tsx                    # Fuentes, metadata global, <main> y Navbar
├── page.tsx                      # Solo compone las secciones en orden
├── @modal/(.)experiencias/[id]/  # Detalle de experiencia como modal (ruta interceptada)
├── experiencias/[id]/            # Detalle de experiencia como página propia
├── (legal)/aviso-de-privacidad/  # Aviso de privacidad
├── api/experiences/              # Endpoints GET de experiencias
├── opengraph-image.jpg           # Imagen para compartir en redes
├── sitemap.ts · robots.ts
└── globals.css                   # Tokens de diseño (@theme)

src/
├── sections/                     # Un folder por bloque de la landing
│   ├── hero/
│   ├── experiences/              # Grid, card, skeleton, error, modal y detalle
│   ├── benefits/
│   └── contact/                  # Sección, formulario ("use client") e información
├── content/                      # Copy y datos tipados (textos, experiencias en JSON, navegación)
├── components/
│   ├── layout/                   # Navbar y componentes cliente sin UI (observer, cierre del menú)
│   └── ui/                       # Primitivas propias (ScrollLink)
├── actions/contact/              # Server Action, schema de Zod, plantillas de correo y tests
└── lib/                          # env, site, mailer, acceso a datos y utilidades
```

Reglas principales: una sección no importa de otra, los textos no se escriben dentro de los componentes y los componentes son Server Components salvo que no haya alternativa.

## Decisiones técnicas relevantes

### Datos dinámicos de experiencias

- El JSON vive en `src/content/experiences.json`. Se lee en el servidor y se valida con Zod antes de renderizar, de modo que un dato mal formado no rompe la UI en silencio.
- La sección se renderiza en el servidor dentro de un `<Suspense>`. Con Partial Prerendering, el resto de la página es HTML estático y la grilla llega por streaming.
- Estados:
  - **Carga:** skeleton con la misma grilla.
  - **Error:** mensaje con un botón "Reintentar" que hace `router.refresh()`.
  - **Éxito:** las 6 cards.
  - **Vacío:** un mensaje propio.
- También existe un endpoint `GET /api/experiences` (y `/api/experiences/[id]`) por si un cliente externo necesita los datos.
- Las 6 experiencias usan un único componente reutilizable, `ExperienceCard`.
- Las imágenes usan `picsum.photos/seed/...` en lugar de `?random=N`, para que cada experiencia muestre siempre la misma imagen entre recargas. Cada objeto del JSON agrega un campo `details` con la información del detalle.

### Detalle de experiencia: modal y página

- Al hacer clic en una card, el detalle se abre en un `<dialog>` nativo mediante una ruta interceptada (`@modal/(.)experiencias/[id]`). La URL cambia, así que el detalle se puede compartir, y "atrás" cierra el modal.
- Al entrar directo a `/experiencias/[id]`, o al recargar, se muestra como página completa con su propio `<h1>` y su propia metadata.

### Formulario de contacto

- **Un solo `ContactSchema` de Zod** valida en el cliente (React Hook Form) y vuelve a validar en la Server Action, así las reglas no pueden divergir entre capas. Los tipos se infieren del schema.
- Reglas:
  - **Nombre:** sin números.
  - **Teléfono:** exactamente 10 dígitos (formato mexicano), con espacios, guiones o paréntesis opcionales.
  - **Correo:** se normaliza a minúsculas.
- Los campos de nombre y teléfono **filtran mientras se escribe o se pega**: no dejan escribir letras ni más de 10 dígitos en el teléfono, ni números en el nombre, en lugar de solo marcar el error al enviar.
- Se valida al enviar. Después del primer intento se valida al cambiar cada campo, para que el error desaparezca en cuanto se corrige. Al enviar con errores, el foco va al primer campo inválido.
- **Envío real con Server Action + SMTP (Brevo):**
  - Se manda un aviso al dueño del sitio con `reply-to` al usuario, y una confirmación al usuario.
  - Si falla el aviso al dueño, se muestra un error recuperable y se conservan los datos.
  - Si solo falla la confirmación, el usuario ve éxito, porque su mensaje ya llegó; el fallo queda en el log.
- Todo lo que escribe el usuario se escapa antes de insertarlo en el HTML de los correos, y la respuesta del servidor SMTP se valida con Zod.
- **Honeypot** anti-spam: un campo oculto que, si llega con valor, se responde como éxito sin enviar nada.
- Estados de carga (botón deshabilitado con "Enviando…", para evitar el doble envío), error (`role="alert"`) y confirmación (`role="status"`, que recibe el foco).

### Responsive

La interfaz se reorganiza por dispositivo en lugar de solo escalar. Se auditó en 320, 375, 667×375, 768, 1024, 1440 y 1920 px (más 1440 con zoom al 200%).

- **Navegación:** en móvil y tablet (< 1024 px) se muestran el logo, un CTA compacto y una hamburguesa que abre un menú a pantalla completa con la **Popover API nativa**. En desktop los ítems van en línea y la hamburguesa desaparece. Un componente cliente sin UI cierra el menú si la ventana pasa a desktop.
- **Grillas por breakpoint:** Experiencias usa 1 → 2 → 3 columnas. Beneficios usa 1 → 2×2 → 4 en fila desde 1280 px. Contacto apila formulario e información en móvil, pone los campos en 2 columnas desde 768 px y usa 7/12 + 5/12 desde 1024 px.
- **Áreas táctiles** de al menos 44 px en móvil. En el CTA de la navbar se amplió con un pseudo-elemento, para no cambiar el tamaño visual de la píldora.
- **Longitud de línea:** los párrafos se limitan a unos 75 caracteres por línea, medidos sobre el ancho real de la fuente.
- **Alturas de pantalla:** `svh`/`dvh` en lugar de `vh`. El hero crece en teléfonos horizontales en lugar de cortar el contenido.
- **Sin parches:** no se usa `overflow-x-hidden` para ocultar desbordes; cada uno se corrigió en su causa.

### SEO

- Metadata en `app/layout.tsx` con `metadataBase` y plantilla de título (`%s | Rock Experience`).
- Open Graph y Twitter card, con una imagen de 1200×630 en JPG (las redes no aceptan AVIF) y su texto alternativo. El detalle de cada experiencia comparte su propia imagen y su propio título.
- `sitemap.ts`, `robots.ts` y URLs canónicas.
- Un solo `<h1>` por página y jerarquía h1 → h2 → h3. Cada sección es un `<section>` con `aria-labelledby` y un `id` para anclas.

### Performance

- **Server Components por defecto.** Los componentes cliente son hojas pequeñas: el formulario, el enlace con scroll, el observer de la sección activa, el modal y el botón de reintentar. Las secciones, la navbar y el layout no envían JavaScript propio.
- **Plataforma nativa antes que JavaScript:** Popover API para el menú, `<dialog>` para el modal, `@starting-style` para las animaciones de entrada y CSS `:has()` para bloquear el scroll del body.
- **Imágenes con `next/image`:**
  - La del hero va en AVIF con `preload`.
  - Las cards usan `lazy` y un `sizes` calculado según el ancho real de cada columna en cada breakpoint (por ejemplo, 384 px en 1440), para no descargar imágenes de más.
- **Fuentes con `next/font`:** se autoalojan, sin peticiones a Google Fonts ni saltos de layout.

### Accesibilidad

- **Enlaces para navegar y botones para acciones.** La navegación entre secciones usa `<a href="/#seccion">` mediante `ScrollLink`, que funciona sin JavaScript y añade scroll suave y foco en la sección destino. Los `<button>` se reservan para abrir y cerrar el menú, cerrar el modal, enviar y reintentar.
- Navegación completa con teclado, foco visible en todos los elementos interactivos, `<label htmlFor>` en todos los campos y errores asociados con `aria-describedby`.
- ARIA solo donde aporta: `aria-current` en la sección activa, `aria-controls` en la hamburguesa y `aria-invalid` solo cuando hay error.
- `cursor: pointer` global para todo lo clicable y respeto a `prefers-reduced-motion`.

### Seguridad

- No hay credenciales en el código. Las variables sensibles (`SMTP_*`) viven en `.env.local`, se validan con Zod y solo se usan en el servidor; `src/lib/mailer.ts` importa `server-only`.
- Lo que escribe el usuario se valida dos veces (cliente y servidor) y se escapa al insertarlo en los correos.

## Qué mejoraría con más tiempo

- **Tests E2E con Playwright:** que la página renderice, que la navegación por anclas funcione, que el formulario muestre éxito y errores, y que no haya scroll horizontal en 375/768/1440. Hoy solo hay tests unitarios del schema y de las plantillas de correo; el resto se verificó con scripts de Playwright fuera del repositorio.
- **Protección del formulario contra abuso:** rate limiting por IP y un captcha invisible (por ejemplo, Cloudflare Turnstile). El honeypot solo frena bots simples, y la confirmación podría usarse para enviar correos a direcciones ajenas.
- **Entregabilidad de los correos:** verificar un dominio propio en Brevo (SPF/DKIM/DMARC) en lugar de enviar desde una dirección `@gmail.com`.
- **Contraste:** subir el placeholder de los inputs (3.2:1, WCAG pide 4.5:1) y el borde de los campos (1.3:1, WCAG pide 3:1 para componentes de UI).
- **Contenido real:** aviso de privacidad redactado legalmente, con su enlace en el footer junto a los datos de contacto.
- **Contenido editable:** mover los textos de `src/content/` a un CMS o a i18n; la separación entre copy y UI ya lo permite sin tocar componentes.
- **Medición:** Lighthouse CI y monitoreo de Core Web Vitals reales, y analítica de conversiones del formulario.

## Herramientas de IA utilizadas

**Herramienta:** Claude Code (Anthropic), usado desde la terminal dentro del repositorio.

**Para qué la utilicé:**

- Implementar secciones a partir de especificaciones detalladas que yo redactaba (estructura, estilos, validaciones y criterios de terminado), siguiendo las reglas de arquitectura de `CLAUDE.md`.
- Integrar el envío real de correos con Brevo a partir de las variables de entorno que yo configuré.
- Auditar el responsive con capturas automatizadas en 7 tamaños de pantalla y mediciones (desbordes, áreas táctiles, caracteres por línea).
- Revisar el proyecto contra los requisitos de la prueba y redactar documentación.

**Qué revisé manualmente:**

- El plan de archivos de cada sección antes de que se escribiera código.
- Las reglas de validación del formulario, contrastándolas con el caso de uso real (números de teléfono mexicanos y nombres de personas).
- La recepción de los dos correos en una prueba real de envío.
- La organización de ramas y los mensajes de commit antes de cada PR.

**Qué generó mal y cómo lo detecté y corregí:**

- **Rama equivocada:** empezó la sección de contacto sobre `feature/benefits`, que ya estaba fusionada. Lo noté al revisar el flujo de git; se movieron los cambios a `feature/contact`, creada desde `main` actualizado.
- **Teléfono demasiado permisivo:** la primera versión aceptaba de 10 a 15 dígitos y dejaba escribir letras, aunque las rechazaba al enviar. Para números mexicanos lo correcto son exactamente 10 dígitos, así que pedí que la validación fuera exacta y que el campo filtrara letras (y números en el nombre) mientras se escribe.
- **Ruta en el contenido:** puso la ruta del aviso de privacidad en el objeto de contenido. Como es una ruta fija de la app y no copy editable, pedí dejarla escrita directamente.
- **Error detectado por el linter:** el compilador de React marcó la lectura de un `ref` durante el render en el formulario (`pnpm lint`); se corrigió midiendo el formulario desde el evento de envío.
- **Fallos detectados en la auditoría de responsive:**
  - En 320 px la hamburguesa quedaba fuera de la pantalla.
  - Varias áreas táctiles medían menos de 44 px.
  - El `sizes` de las imágenes no correspondía al ancho real de la grilla.
- **Fallos detectados al contrastar con los requisitos:**
  - La navegación usaba `<button>` en lugar de enlaces.
  - Faltaba Open Graph.
  - La meta description no correspondía a la campaña.
