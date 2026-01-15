const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    icon: path.join(__dirname, 'build', 'icon.png')
  });

  // Maximizar la ventana al iniciar
  mainWindow.maximize();

  // Manejar la apertura de nuevas ventanas
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    return {
      action: 'allow',
      overrideBrowserWindowOptions: {
        width: 1200,
        height: 800,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true
        }
      }
    };
  });

  // En desarrollo, carga desde el servidor de Vite
  // En producción, carga los archivos estáticos compilados
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
  }

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

function startBackend() {
  const isDev = process.env.NODE_ENV === 'development';
  
  // En desarrollo, asume que el backend ya está corriendo
  if (isDev) {
    console.log('Modo desarrollo: asumiendo que el backend está corriendo en puerto 3001');
    return;
  }

  // En producción, inicia el servidor backend
  const backendPath = path.join(__dirname, 'backend', 'server.js');
  
  console.log('Iniciando backend desde:', backendPath);
  console.log('Directorio de trabajo:', __dirname);
  console.log('Ejecutable Node.js:', process.execPath);
  
  // Usar process.execPath para obtener el ejecutable de Electron que tiene Node.js integrado
  backendProcess = spawn(process.execPath, [backendPath], {
    cwd: __dirname,
    stdio: 'pipe',
    env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' }
  });

  // Capturar y mostrar la salida del backend
  backendProcess.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data}`);
  });

  backendProcess.on('error', (err) => {
    console.error('Error al iniciar el backend:', err);
  });

  backendProcess.on('exit', (code) => {
    console.log(`Proceso backend finalizado con código ${code}`);
  });
}

app.on('ready', () => {
  startBackend();
  
  // Espera un poco para que el backend se inicie antes de abrir la ventana
  setTimeout(createWindow, 2000);
});

app.on('window-all-closed', function () {
  if (backendProcess) {
    backendProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('will-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});
