### scaffolding
```
src/
├── api/              # Axios instance / Interceptors
├── components/       # UI Atómica (Shadcn/CVA) y Layouts
├── features/         # EL NÚCLEO (Dominio de negocio)
│   └── users/        
│       ├── adapters/ # Limpia data de API -> UI
│       ├── components/
│       ├── hooks/    # React Query (useQuery)
│       ├── services/ # Llamados fetch/axios
│       ├── types/    # Interfaces TS
│       └── index.ts  # Barrel Pattern
├── app/              # RUTAS (Sustituye a React Router)
│   ├── users/
│   │   └── page.tsx  # Solo llama al componente de la Feature
│   └── layout.tsx    # Providers (QueryClient) y Navbar
└── providers/        # React Query Client Provider

```
Carpeta / Archivo,Tipo,Razón de Senior
api/,Shared,"Axios funciona en ambos, pero los interceptores de localStorage solo en Client."
components/ui/,RCC,Shadcn/Radix suelen usar estados para accesibilidad/animaciones.
features/users/services/,Shared,Funciones puras de Fetch/Axios. Se pueden llamar desde el servidor o cliente.
features/users/hooks/,RCC,useQuery depende del ciclo de vida de React (Context).
app/users/page.tsx,RSC,"Por defecto, todas las rutas en app/ son Server Components."

🚀 Next.js Professional Boilerplate (Senior Architecture)
Este proyecto es una base sólida diseñada para superar desafíos técnicos de nivel Junior a Senior. Sigue una arquitectura de Clean Architecture y Feature-Driven Design, optimizada para el App Router de Next.js 15 y Tailwind CSS 4.

🏗️ Arquitectura del Proyecto (The Beauty)
La estructura está diseñada para ser escalable, testeable y desacoplada. Se divide en tres capas principales:

1. Capa de Infraestructura (src/api, src/providers)
API: Centraliza la configuración de Axios. Aquí residen los interceptores para manejar tokens de autenticación y errores globales (Aggressive Error Feedback).

Providers: Envuelve la aplicación con los contextos necesarios (React Query) sin ensuciar los componentes de servidor.

2. Capa de Dominio / Features (src/features/)
Es el corazón del proyecto. Cada dominio (ej. users, products) está encapsulado:

Services: Única fuente de verdad para las llamadas a la API.

Adapters: Transforman los datos crudos de la API (DTO) a interfaces limpias para la UI (UserUI). Esto protege a la aplicación de cambios inesperados en el backend.

Hooks: Lógica de estado y caché mediante React Query.

Components: UI exclusiva de la funcionalidad.

Index (Barrel): Punto de entrada único que expone solo lo necesario al resto de la app.

3. Capa de Aplicación / Rutas (src/app/)
Usa el sistema de carpetas de Next.js para el enrutamiento.

RSC (React Server Components): Las páginas son servidores por defecto para maximizar el SEO y minimizar el JS en el cliente.

RCC (React Client Components): Solo los componentes de las features que requieren interactividad llevan la directiva 'use client'.

⚡ Estrategia de Latencia (Netflix Style)
Para aplicaciones de alto tráfico como Netflix o Mercado Libre, la latencia es el enemigo #1. Este boilerplate la combate de tres formas:

Server-Side Pre-rendering: Al usar Next.js, el esqueleto de la página se sirve desde el servidor, bajando el LCP (Largest Contentful Paint).

Stale-While-Revalidate (React Query): Los datos se sirven desde el caché instantáneamente mientras se actualizan en segundo plano. Cero spinners para el usuario que regresa.

Data Adapters: Al transformar la data en la capa de servicio/hook, el hilo principal del navegador no se bloquea procesando JSONs pesados durante el renderizado.

Nota sobre Netflix: Netflix utiliza una estrategia de "Skeleton Screens" y carga perezosa de filas para que el usuario sienta que la app es instantánea, incluso si la API de recomendaciones tarda 2 segundos en responder. Este proyecto permite replicar eso mediante Suspense y componentes atómicos.

🛠️ Stack Tecnológico
Next.js 15 (App Router): Orquestación y rutas.

Tailwind CSS 4: Estilos modernos basados en variables de CSS (Zero-config).

CVA (Class Variance Authority): Gestión de variantes de UI escalables.

React Query: Gestión de estado asíncrono y caché.

Axios: Cliente HTTP con interceptores.

📝 Senior Mantra (Recordatorio para el Challenge)
Antes de empezar cualquier feature nueva:

¿Volumen de tráfico? Optimizar para renderizado inicial (SEO).

¿Estrategia de Error? Feedback agresivo al usuario, no fallos silenciosos.

¿Design System? Seguir los principios de accesibilidad y usar componentes base con CVA.

¿Cómo usar este Boilerplate para MeLi?
Duplica la carpeta features/users y cámbiala a features/products.

Define tus ProductDTO y ProductUI en types.

Ajusta el adapter para manejar los precios y monedas de MeLi.

¡Llama a tu nueva feature en app/products/page.tsx!