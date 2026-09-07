# Jhon David Toro Muriel — Portafolio de Desarrollador

**[🇬🇧 Read in English](./README.md)**

Un portafolio de desarrollador interactivo y de calidad producción — no una plantilla. Construido con React 19, TypeScript y Vite, y tratado como un producto real: tipado de punta a punta, testeado, accesible, internacionalizado, e instrumentado con Core Web Vitals reales (no simulados).

**Dominio de producción:** `portfolio.doxel.dev` (configurado en `SITE_URL`/etiquetas canónicas — ver [Despliegue](#despliegue) para su estado actual).

## Contenido

- [Funcionalidades](#funcionalidades)
- [Stack tecnológico](#stack-tecnológico)
- [Cómo empezar](#cómo-empezar)
- [Variables de entorno](#variables-de-entorno)
- [Scripts](#scripts)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Testing](#testing)
- [Arquitectura](#arquitectura)
- [Despliegue](#despliegue)
- [Guía de ingeniería](#guía-de-ingeniería)
- [Contacto](#contacto)

## Funcionalidades

- **Contenido** — Secciones de Hero, Sobre mí, línea de tiempo de Experiencia, Educación, Proyectos y Contacto, todas alimentadas por módulos de contenido tipados (`src/content/`), no por texto embebido directamente en el JSX.
- **Bilingüe** — Traducción completa inglés/español vía i18next, con la preferencia del visitante persistida y el atributo `<html lang>` sincronizado.
- **Tema** — Modo claro/oscuro sin parpadeo del tema incorrecto al cargar. En escritorio, cambiar de tema anima una revelación circular desde el punto de clic usando la View Transitions API nativa; en móvil cae a un cross-fade más barato, ya que la revelación circular pierde frames de forma medible en GPUs más débiles.
- **Command palette** — <kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>K</kbd> abre una lista de acciones buscable: ir a una sección, cambiar tema/idioma, copiar el correo, abrir GitHub, abrir la terminal.
- **Asistente de IA** — Un widget de chat (y un comando `ask` en la terminal) que responde preguntas de los visitantes, basado estrictamente en el contenido real de este portafolio a través de un proxy server-side a Gemini — nunca inventa datos sobre experiencia o habilidades.
- **Actividad de GitHub en vivo** — Un modal con repositorios reales, estrellas y conteo de commits, obtenidos server-side vía la API GraphQL de GitHub (no desde el cliente, para mantener el token privado y evitar el límite de 60 solicitudes/hora de la API pública).
- **Formulario de contacto** — Envío real de correos vía EmailJS, con estados accesibles de carga/éxito/error (no solo un spinner que desaparece).
- **Terminal easter egg** — Una terminal falsa arrastrable (con un toggle de maximizar) que corre un pequeño conjunto de comandos reales (`help`, `whoami`, `cd`, `ask`, `clear`, …).
- **Fondo de constelación** — Una red de partículas en canvas que reacciona al cursor, condicionada a un ancho de escritorio y a `prefers-reduced-motion`, y pausada cuando la pestaña no está visible.
- **Métricas de rendimiento reales** — El footer reporta el LCP/CLS/TTFB real de esta página, medidos con la API nativa `PerformanceObserver` (sin librería externa), no una afirmación de marketing.
- **Accesibilidad** — Landmarks semánticos, skip link, estados de foco visibles, menús/modales/palette operables por teclado, y regiones `aria-live` para cambios de estado asíncronos.

## Stack tecnológico

| | |
|---|---|
| **Framework** | React 19, con el React Compiler activado (`babel-plugin-react-compiler`) |
| **Lenguaje** | TypeScript, modo `strict` |
| **Build tool** | Vite |
| **Estilos** | SCSS Modules, custom properties CSS para theming |
| **Enrutamiento** | React Router |
| **i18n** | react-i18next |
| **Animación** | Motion (Framer Motion), View Transitions API, Lenis (scroll suave) |
| **Formularios/correo** | EmailJS |
| **Serverless** | Vercel Edge Functions (`api/`) para el asistente de IA y el proxy de GitHub |
| **Testing** | Vitest, React Testing Library, Playwright |
| **Gestor de paquetes** | pnpm |

Sin librería de estado global, sin framework CSS, sin kit de UI — ver las reglas de disciplina de dependencias en [`CLAUDE.md`](./CLAUDE.md) para entender por qué.

## Cómo empezar

```bash
git clone <este-repo>
cd portfolio
pnpm install
cp .env.example .env   # opcional — ver abajo
pnpm dev
```

El servidor de desarrollo corre en `http://localhost:5173`. Las funciones serverless de `api/*.ts` también corren localmente, a través de un pequeño plugin de Vite (`localApiPlugin.ts`) que las adapta al servidor de desarrollo de Node — no se necesita el CLI de Vercel.

## Variables de entorno

Copia `.env.example` a `.env` y completa lo que necesites. Cada funcionalidad que depende de una variable se degrada de forma controlada sin ella (el formulario de contacto muestra un estado de error claro; el asistente de IA y el modal de GitHub muestran un mensaje de "no configurado") — nada se rompe.

| Variable | Usada por | Necesaria para |
|---|---|---|
| `VITE_EMAILJS_SERVICE_ID` | `src/features/contact/ContactForm.tsx` | Enviar el formulario de contacto |
| `VITE_EMAILJS_TEMPLATE_ID` | igual | igual |
| `VITE_EMAILJS_PUBLIC_KEY` | igual | igual |
| `GEMINI_API_KEY` | `api/chat.ts` (solo servidor) | El widget del asistente de IA |
| `GITHUB_TOKEN` | `api/github.ts` (solo servidor) | El modal de repositorios de GitHub en vivo |

`GEMINI_API_KEY` y `GITHUB_TOKEN` deliberadamente **no** llevan el prefijo `VITE_` — cualquier variable con ese prefijo se incrusta en el bundle del cliente y queda visible para quien abra las devtools. Ver los comentarios en `.env.example` para saber dónde obtener cada clave.

## Scripts

| Script | Qué hace |
|---|---|
| `pnpm dev` | Inicia el servidor de desarrollo |
| `pnpm build` | Type-check y luego build de producción |
| `pnpm preview` | Previsualiza el build de producción localmente |
| `pnpm lint` | Corre ESLint |
| `pnpm typecheck` | Type-check de todo el proyecto (app, api/, e2e/, configs de test) |
| `pnpm test` | Corre los tests unitarios/de componentes una vez |
| `pnpm test:watch` | Corre los tests unitarios/de componentes en modo watch |
| `pnpm test:coverage` | Corre los tests unitarios/de componentes con reporte de coverage |
| `pnpm test:e2e` | Corre la suite e2e de Playwright, en headless |
| `pnpm test:e2e:ui` | Modo UI interactivo de Playwright |
| `pnpm test:e2e:headed` | Corre los tests e2e con una ventana de navegador visible |

## Estructura del proyecto

```text
src/
├── app/            # Raíz de composición: providers, router, configuración de i18n
├── content/         # Contenido tipado — perfil, experiencia, proyectos, skills, locales
├── core/            # Lógica agnóstica de framework: hooks, clientes de API, theming, SEO
├── design-system/   # Primitivas reutilizables y presentacionales (Button, Modal, Section, …)
├── features/        # Lógica de negocio por sección (Hero, Contact, Projects, …)
├── pages/           # Composición a nivel de ruta
├── shared/           # "Chrome" de la app compartido entre features (header, footer, command palette, …)
├── styles/          # Design tokens, temas, estilos globales
└── test/            # Setup de Vitest

api/                 # Vercel Edge Functions (asistente de IA, proxy de GitHub)
e2e/                 # Tests end-to-end de Playwright
```

La justificación completa de este layering — dirección de dependencias, dónde pertenece cierta lógica — está en [`ARCHITECTURE.md`](./ARCHITECTURE.es.md).

## Testing

85 tests unitarios/de componentes (Vitest + React Testing Library) enfocados en código con lógica real — hooks, formularios, el command palette, los dos handlers serverless — más 5 escenarios end-to-end con Playwright cubriendo los flujos que recorre un visitante real. Desglose completo, convenciones y cómo correr todo: [`TESTING.md`](./TESTING.md).

## Arquitectura

El layering, las reglas de dependencia, y el razonamiento detrás de las decisiones técnicas más importantes (View Transitions en vez de una librería de animación en JS, sin estado global, por qué el asistente de IA está anclado al contenido server-side) están documentados en [`ARCHITECTURE.es.md`](./ARCHITECTURE.es.md).

## Despliegue

Preparado para [Vercel](https://vercel.com): `vite build` genera el sitio estático, y todo lo que está bajo `api/` se despliega automáticamente como Edge Functions — sin configuración extra. Para desplegar: conecta este repo a un proyecto de Vercel, configura las cinco variables de [Variables de entorno](#variables-de-entorno) en su dashboard (Settings → Environment Variables), y despliega. `SITE_URL` (`src/core/seo/seo.constants.ts`) debe coincidir con el dominio donde despliegues, ya que se usa para construir las URLs canónicas/Open Graph.

## Guía de ingeniería

[`CLAUDE.md`](./CLAUDE.md) es la fuente de verdad para arquitectura, tooling y estándares de calidad en este proyecto — rigor de TypeScript, convenciones de componentes, accesibilidad, rendimiento y disciplina de dependencias. `AGENTS.md` apunta hacia él para herramientas que buscan ese nombre de archivo por convención.

## Contacto

**Jhon David Toro Muriel** — [GitHub](https://github.com/Jhon-Toro) · [toromurieljhon@gmail.com](mailto:toromurieljhon@gmail.com)
