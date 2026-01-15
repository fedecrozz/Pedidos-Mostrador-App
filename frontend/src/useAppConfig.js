import { useState, useEffect } from 'react';

export const useAppConfig = () => {
  const defaultConfig = {
    colorFondoPrincipal: '#667eea',
    colorFondoSecundario: '#764ba2',
    colorTexto: '#ffffff',
    colorTitulo: '#333333',
    colorPendiente: '#f44336',
    colorPreparacion: '#ff9800',
    colorListo: '#4caf50',
    colorEntregado: '#9e9e9e',
    colorFondoAdmin: '#667eea',
    colorFondoSecundarioAdmin: '#764ba2',
    colorEncabezadoAdmin: '#ffffff',
    colorTituloAdmin: '#333333',
    colorEncabezadoTablaAdmin: '#667eea',
    colorBotonCrear: '#667eea',
    colorBotonEliminar: '#f44336',
    colorFondoClientView2: '#f0f0f0',
    colorEncabezadoPreparacion: '#9e9e9e',
    colorEncabezadoListo: '#e91e63',
    colorTarjetaFondo1: '#667eea',
    colorTarjetaFondo2: '#764ba2',
    logoUrl: ''
  };

  const [config, setConfig] = useState(defaultConfig);

  useEffect(() => {
    // Cargar configuración
    const loadConfig = () => {
      const savedConfig = localStorage.getItem('appConfig');
      if (savedConfig) {
        setConfig({ ...defaultConfig, ...JSON.parse(savedConfig) });
      }
    };

    loadConfig();

    // Escuchar cambios de configuración
    const handleConfigUpdate = () => {
      loadConfig();
    };

    window.addEventListener('configUpdated', handleConfigUpdate);
    window.addEventListener('storage', handleConfigUpdate);

    return () => {
      window.removeEventListener('configUpdated', handleConfigUpdate);
      window.removeEventListener('storage', handleConfigUpdate);
    };
  }, []);

  return config;
};
