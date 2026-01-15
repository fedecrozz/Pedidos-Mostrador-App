# Pedidos Mostrador App

Aplicación de escritorio para gestionar pedidos de mostrador en restaurantes.

## Estructura
- Frontend: React + Vite
- Backend: Node.js + Express
- Base de datos: SQLite
- Desktop: Electron

## Funcionalidades principales
- Panel de administración con todos los pedidos y su estado
- Vista de cliente para ver el estado del pedido
- Cambio de estado de pedidos
- Eliminación de pedidos
- Generación automática de números de pedido

## Desarrollo

### Instalación inicial
1. Instalar todas las dependencias:
   ```bash
   npm run postinstall
   ```

### Backend
1. Instalar dependencias:
   ```bash
   cd backend
   npm install
   ```
2. Iniciar servidor:
   ```bash
   npm start
   ```
   El servidor estará disponible en http://localhost:3001

### Frontend
1. Instalar dependencias:
   ```bash
   cd frontend
   npm install
   ```
2. Iniciar en modo desarrollo:
   ```bash
   npm run dev
   ```
   El frontend estará disponible en http://localhost:3000

## Crear ejecutable para Windows

### Requisitos previos
- Node.js instalado
- npm instalado

### Pasos para generar el ejecutable

1. **Instalar dependencias de Electron** (solo la primera vez):
   ```bash
   npm install
   ```

2. **(Opcional) Agregar un ícono personalizado**:
   - Coloca un archivo `icon.ico` en la carpeta `build/`
   - El ícono debe ser de 256x256 píxeles o mayor

3. **Compilar el frontend y crear el ejecutable**:
   ```bash
   npm run package:win
   ```

4. **Encontrar el ejecutable**:
   - La aplicación se generará en: `dist/PedidosMostrador-win32-x64/`
   - El ejecutable es: `PedidosMostrador.exe`
   - Tamaño aproximado de la carpeta: ~200 MB

### Distribuir la aplicación

Una vez generado el ejecutable:
- Comprime toda la carpeta `PedidosMostrador-win32-x64` en un archivo ZIP
- Puedes compartir ese ZIP con otros usuarios
- El usuario solo necesita:
  1. Descomprimir el ZIP
  2. Ejecutar `PedidosMostrador.exe`
- No requiere Node.js ni otras dependencias en la PC de destino
- La aplicación incluye todo lo necesario: backend, frontend y base de datos

### Comandos adicionales

```bash
# Iniciar la app en modo Electron (desarrollo)
npm start

# Solo compilar el frontend
npm run build:frontend
```

## Notas importantes

- La primera vez que compiles puede tardar varios minutos
- Asegúrate de tener espacio suficiente en disco (~500 MB)
- El ejecutable incluye todo: Node.js, Chromium, y tu aplicación
- La carpeta completa debe ser distribuida, no solo el .exe

---

## Autor
Fede
