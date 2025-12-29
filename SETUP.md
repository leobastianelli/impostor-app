# Setup - El Impostor

Esta guía te ayudará a configurar el proyecto paso a paso.

## 1. Configurar Pusher

El juego usa Pusher para la comunicación en tiempo real entre jugadores.

### Crear cuenta en Pusher

1. Ve a [https://dashboard.pusher.com/accounts/sign_up](https://dashboard.pusher.com/accounts/sign_up)
2. Crea una cuenta gratuita
3. Una vez dentro del dashboard, haz clic en "Create app"

### Configurar la aplicación

1. **Name your app**: Dale un nombre como "El Impostor"
2. **Select a cluster**: Elige el más cercano a tu ubicación (ej: `us2` o `us3`)
3. **Tech stack**:
   - Frontend: React
   - Backend: Node.js
4. Haz clic en "Create app"

### Obtener las credenciales

En el dashboard de tu app, ve a "App Keys" y encontrarás:
- `app_id`
- `key`
- `secret`
- `cluster`

## 2. Configurar Variables de Entorno

1. Copia el archivo `.env.local.example` a `.env.local`:

```bash
copy .env.local.example .env.local
```

2. Abre `.env.local` y completa con tus credenciales de Pusher:

```env
NEXT_PUBLIC_PUSHER_KEY=tu_pusher_key_aqui
PUSHER_APP_ID=tu_app_id_aqui
PUSHER_SECRET=tu_pusher_secret_aqui
NEXT_PUBLIC_PUSHER_CLUSTER=us2
```

**Importante**:
- Reemplaza `tu_pusher_key_aqui`, `tu_app_id_aqui`, etc. con tus valores reales
- El `cluster` debe coincidir con el que elegiste al crear la app

## 3. Instalar Dependencias

Si aún no lo hiciste, instala las dependencias:

```bash
npm install
```

## 4. Ejecutar el Proyecto

### Modo Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### Build de Producción

```bash
npm run build
npm start
```

## 5. Probar el Juego

### Probar localmente con múltiples dispositivos

1. Ejecuta `npm run dev`
2. Abre tu navegador en `http://localhost:3000`
3. Haz clic en "Crear Sala"
4. Completa tu nombre y selecciona personajes
5. Obtendrás un código de 6 caracteres

**Para probar con otro dispositivo:**

Opción A - Mismo computador:
- Abre otra ventana del navegador en modo incógnito
- Ve a `http://localhost:3000`
- Haz clic en "Unirse a Sala"
- Ingresa el código

Opción B - Otro dispositivo en la misma red:
- Averigua tu IP local (en Windows: `ipconfig`, en Mac/Linux: `ifconfig`)
- En el otro dispositivo, ve a `http://TU_IP_LOCAL:3000`
- Únete con el código

Opción C - Dispositivos en redes diferentes (usando ngrok):
- Instala ngrok: [https://ngrok.com/download](https://ngrok.com/download)
- Ejecuta: `ngrok http 3000`
- Comparte la URL que te da ngrok (ej: `https://abc123.ngrok.io`)

## 6. Desplegar a Producción (Vercel)

### Preparar el Despliegue

1. Asegúrate que tu código esté en GitHub
2. Ve a [https://vercel.com](https://vercel.com) y crea una cuenta
3. Haz clic en "New Project"
4. Importa tu repositorio

### Configurar Variables de Entorno en Vercel

En la configuración del proyecto en Vercel:

1. Ve a "Settings" → "Environment Variables"
2. Agrega las siguientes variables:
   - `NEXT_PUBLIC_PUSHER_KEY`
   - `PUSHER_APP_ID`
   - `PUSHER_SECRET`
   - `NEXT_PUBLIC_PUSHER_CLUSTER`

3. Usa los mismos valores que en tu `.env.local`

### Deploy

Haz clic en "Deploy" y espera a que termine.

## Troubleshooting

### Error: "Pusher connection failed"

- Verifica que las credenciales en `.env.local` sean correctas
- Asegúrate que el cluster coincida con el de tu app en Pusher
- Revisa que las variables empiecen con `NEXT_PUBLIC_` las que deben ser públicas

### Error: "Room not found"

- El código de sala es sensible a mayúsculas/minúsculas
- Las salas se eliminan después de 24 horas de inactividad
- Verifica que ingresaste el código correctamente

### Los jugadores no se ven en tiempo real

- Verifica la conexión a internet
- Abre la consola del navegador (F12) y busca errores
- Asegúrate que Pusher esté configurado correctamente

### Error al votar o enviar pistas

- Asegúrate que sea tu turno
- Verifica que no hayas enviado ya tu pista/voto
- Revisa la consola para más detalles del error

## Características del Free Tier de Pusher

El plan gratuito de Pusher incluye:

- 200,000 mensajes por día
- 100 conexiones concurrentes
- Soporte para presencia y canales privados

Esto es suficiente para:
- 8-10 salas de juego simultáneas
- ~100 partidas por día

Si necesitas más capacidad, Pusher ofrece planes pagos desde $49/mes.

## Próximos Pasos Recomendados

Una vez que tengas el juego funcionando:

1. **Agregar persistencia**: Implementar Redis/Upstash para guardar el estado
2. **Timer por ronda**: Agregar límite de tiempo para dar pistas
3. **Chat en tiempo real**: Implementar chat para la fase de debate
4. **Sistema de puntos**: Llevar estadísticas de partidas
5. **Más personajes**: Expandir la base de datos de personajes argentinos

## Soporte

Si tienes problemas, revisa:
- La documentación de Pusher: [https://pusher.com/docs](https://pusher.com/docs)
- La documentación de Next.js: [https://nextjs.org/docs](https://nextjs.org/docs)
