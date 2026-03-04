# App de Hábitos - Documentación

Una aplicación moderna para el seguimiento de hábitos diarios, construida con Next.js 16, Supabase y TailwindCSS.

## Estructura del Proyecto

```
my-app-habitos/
├── .next/                # Archivos generados por Next.js (compilación)
├── node_modules/         # Dependencias de Node.js
├── public/               # Archivos estáticos accesibles públicamente
├── src/                  # Código fuente de la aplicación
│   ├── api/              # Configuración de API y utilidades
│   ├── app/              # Componentes y páginas de la aplicación (App Router de Next.js)
│   │   ├── auth/         # Página de autenticación
│   │   ├── habits/       # Página de hábitos
│   │   ├── actions.ts    # Server Actions para operaciones del servidor
│   │   ├── globals.css   # Estilos globales
│   │   └── layout.tsx    # Layout principal de la aplicación
│   ├── components/       # Componentes reutilizables de UI
│   │   └── ui/           # Componentes de UI básicos (botones, inputs, etc.)
│   ├── features/         # Módulos de funcionalidades organizados por dominio
│   │   ├── auth/         # Funcionalidad de autenticación
│   │   │   ├── components/  # Componentes relacionados con autenticación
│   │   │   ├── hooks/       # Hooks personalizados para autenticación
│   │   │   ├── services/    # Servicios para interactuar con la API de autenticación
│   │   │   └── types/       # Tipos TypeScript para autenticación
│   │   └── habits/       # Funcionalidad de hábitos
│   │       ├── adapters/    # Adaptadores para transformar datos
│   │       ├── components/  # Componentes relacionados con hábitos
│   │       ├── hooks/       # Hooks personalizados para hábitos
│   │       ├── services/    # Servicios para interactuar con la API de hábitos
│   │       └── types/       # Tipos TypeScript para hábitos
│   ├── hooks/            # Hooks personalizados globales
│   ├── lib/              # Utilidades y configuraciones
│   │   └── database.types.ts # Tipos TypeScript para la base de datos
│   ├── utils/            # Utilidades generales
│   │   ├── supabase/     # Configuración de Supabase
│   │   │   ├── client.ts     # Cliente de Supabase para el navegador
│   │   │   ├── server.ts     # Cliente de Supabase para Server Components y Server Actions
│   │   │   ├── cookie-config.ts # Configuración de cookies
│   │   │   └── index.ts      # Re-exportaciones para facilitar importaciones
│   ├── providers/        # Proveedores de contexto React
│   └── middleware.ts     # Middleware de Next.js para manejo de rutas
├── .cursorrules          # Reglas para el editor Cursor
├── .env.local            # Variables de entorno locales
├── .gitignore            # Archivos y carpetas ignorados por Git
├── eslint.config.mjs     # Configuración de ESLint
├── next-env.d.ts         # Tipos para Next.js
├── next.config.ts        # Configuración de Next.js
├── package-lock.json     # Versiones exactas de dependencias
├── package.json          # Dependencias y scripts
├── postcss.config.mjs    # Configuración de PostCSS
└── tsconfig.json         # Configuración de TypeScript
```

## Funcionalidad

### Autenticación
- Registro de usuarios con email y contraseña
- Inicio de sesión con email y contraseña
- Confirmación de email
- Cierre de sesión
- Protección de rutas para usuarios autenticados

### Gestión de Hábitos
- Creación de nuevos hábitos
- Listado de hábitos del usuario
- Marcado de hábitos como completados
- Visualización del estado de los hábitos (pendiente, completado)
- Indicador visual de urgencia para hábitos próximos a vencer

### Características Técnicas
- Server Components y Server Actions de Next.js 16
- Manejo seguro de cookies con httpOnly para tokens de autenticación
- Diseño responsive con TailwindCSS
- Efectos visuales premium con glassmorphism y gradientes
- Manejo de estado con React Query
- Validación de formularios con Zod
- Feedback visual con sistema de toasts

## Conflictos y Soluciones

### 1. Error de Cookies en Next.js 16

**Problema:**
```
Error: Cookies can only be modified in a Server Action or Route Handler
```

Este error ocurría porque en Next.js 16, la API de cookies solo puede modificar cookies en Server Actions o Route Handlers, no en Server Components regulares. Además, la función `cookies()` ahora devuelve una promesa y debe ser usada con `await`.

**Solución:**
- Consolidamos la lógica de Supabase en una estructura más limpia:
  - `utils/supabase/client.ts`: Cliente para el navegador
  - `utils/supabase/server.ts`: Cliente unificado para Server Components y Server Actions
- Implementamos la función `createClient()` como asíncrona para manejar `cookies()` como una promesa
- Añadimos bloques try/catch para ignorar errores cuando se intenta modificar cookies en un Server Component
- Configuramos las cookies de autenticación con `httpOnly: true` para mayor seguridad

### 2. Error de Importación de Módulos

**Problema:**
```
The export getServerSession was not found in module [project]/Practicas/app-actividades/my-app-habitos/src/app/actions.ts
```

Este error ocurría porque después de refactorizar el código, algunas importaciones no se actualizaron correctamente.

**Solución:**
- Actualizamos todas las importaciones para que apunten a las ubicaciones correctas
- Aseguramos la consistencia en las rutas de importación en todo el proyecto
- Utilizamos alias de importación `@/` para mantener las rutas limpias

### 3. Advertencia de Middleware

**Problema:**
```
The "middleware" file convention is deprecated. Please use "proxy" instead.
```

Esta advertencia indica que el archivo `middleware.ts` está obsoleto en Next.js 16 y debería ser reemplazado por `proxy.ts`.

**Solución pendiente:**
- En una futura actualización, migrar de `middleware.ts` a `proxy.ts` siguiendo la nueva convención de Next.js 16

### 4. Advertencia de Turbopack

**Problema:**
```
Warning: Next.js inferred your workspace root, but it may not be correct.
```

Esta advertencia ocurre porque Turbopack detecta múltiples archivos package-lock.json y no puede determinar correctamente la raíz del proyecto.

**Solución pendiente:**
- Configurar `turbopack.root` en next.config.ts para especificar la raíz del proyecto

## Estilo Visual

La aplicación sigue un diseño premium con modo oscuro:

- **Fondo base:** `bg-zinc-950` con gradiente radial `from-indigo-900/10 via-zinc-950 to-zinc-950`
- **Efecto Glassmorphism:** Fondos semitransparentes con desenfoque para tarjetas y componentes
- **Jerarquía de texto:**
  - Títulos: `text-zinc-50` (máximo contraste)
  - Subtítulos/Cuerpo: `text-zinc-400` (contraste suave)
- **Botones primarios:** `bg-indigo-500` con `text-zinc-950` y estados hover/focus
- **Estados visuales de hábitos:**
  - Completado: Verde celeste (Cyan-400)
  - Pendiente: Indigo-500
  - Urgente: Rojo con animación de pulso

### 5. Sincronización de Tipos y Base de Datos

**Problema:**
La aplicación estaba utilizando `last_completed_at` en las actualizaciones de hábitos, pero la estructura de la base de datos requiere usar estrictamente `status: 'completed'` o `status: 'pending'`.

**Solución:**
- Eliminamos todas las referencias a `last_completed_at` en el servicio de hábitos
- Simplificamos el objeto de actualización para usar solo `{ status: 'completed' }` o `{ status: 'pending' }`

### 6. Error de Importación de Componentes del Servidor en Componentes del Cliente

**Problema:**
```
You're importing a component that needs "next/headers". That only works in a Server Component.
```

Este error ocurría porque estábamos exportando funciones del servidor (que utilizan `next/headers`) desde el archivo `index.ts` en `utils/supabase`, y luego importando ese archivo en componentes del cliente. En Next.js 16, las APIs del servidor como `cookies()` de `next/headers` solo pueden ser utilizadas en componentes del servidor.

**Solución:**
- Agregamos la directiva `'use server'` al inicio del archivo `server.ts` para marcar explícitamente que es un componente del servidor
- Modificamos el archivo `index.ts` en `utils/supabase` para que solo exporte funciones del cliente, eliminando las exportaciones de funciones del servidor
- Actualizamos todas las importaciones en componentes del cliente para que solo importen desde `@/utils/supabase` (cliente)
- Actualizamos todas las importaciones en componentes del servidor para que importen directamente desde `@/utils/supabase/server`
- Esta separación clara entre cliente y servidor evita que los componentes del cliente intenten importar código que usa APIs exclusivas del servidor

## Desarrollo Futuro

- Migración de `middleware.ts` a `proxy.ts`
- Configuración de `turbopack.root` en next.config.ts
- Implementación de temas claro/oscuro
- Añadir estadísticas y visualización de progreso
- Implementación de notificaciones push
- Soporte para categorías de hábitos
- Integración con calendario