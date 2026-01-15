import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './ConfigView.css'

function ConfigView() {
  const [config, setConfig] = useState({
    // Colores generales
    colorFondoPrincipal: '#667eea',
    colorFondoSecundario: '#764ba2',
    colorTexto: '#ffffff',
    colorTitulo: '#333333',
    
    // Colores de estados
    colorPendiente: '#f44336',
    colorPreparacion: '#ff9800',
    colorListo: '#4caf50',
    colorEntregado: '#9e9e9e',
    
    // Colores AdminView
    colorFondoAdmin: '#667eea',
    colorFondoSecundarioAdmin: '#764ba2',
    colorEncabezadoAdmin: '#ffffff',
    colorTituloAdmin: '#333333',
    colorEncabezadoTablaAdmin: '#667eea',
    colorBotonCrear: '#667eea',
    colorBotonEliminar: '#f44336',
    
    // Colores ClientView2
    colorFondoClientView2: '#f0f0f0',
    colorEncabezadoPreparacion: '#9e9e9e',
    colorEncabezadoListo: '#e91e63',
    colorTarjetaFondo1: '#667eea',
    colorTarjetaFondo2: '#764ba2',
    
    // Logo
    logoUrl: ''
  });

  // Cargar configuración al iniciar
  useEffect(() => {
    const savedConfig = localStorage.getItem('appConfig');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  // Guardar configuración
  const saveConfig = () => {
    localStorage.setItem('appConfig', JSON.stringify(config));
    // Disparar evento para que otras ventanas se actualicen
    window.dispatchEvent(new Event('configUpdated'));
    alert('Configuración guardada exitosamente');
  };

  // Manejar cambio de color
  const handleColorChange = (field, value) => {
    setConfig({ ...config, [field]: value });
  };

  // Manejar carga de logo
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setConfig({ ...config, logoUrl: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Resetear configuración
  const resetConfig = () => {
    if (confirm('¿Está seguro de que desea restablecer la configuración predeterminada?')) {
      localStorage.removeItem('appConfig');
      window.location.reload();
    }
  };

  // Exportar configuración
  const exportConfig = () => {
    const configData = JSON.stringify(config, null, 2);
    const blob = new Blob([configData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pedidos-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert('Configuración exportada exitosamente');
  };

  // Importar configuración
  const importConfig = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedConfig = JSON.parse(event.target.result);
          setConfig(importedConfig);
          localStorage.setItem('appConfig', JSON.stringify(importedConfig));
          window.dispatchEvent(new Event('configUpdated'));
          alert('Configuración importada exitosamente. La página se recargará.');
          window.location.reload();
        } catch (error) {
          alert('Error al importar el archivo de configuración. Asegúrese de que sea un archivo válido.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="config-view">
      <div className="config-header">
        <h1>⚙️ Configuración</h1>
        <Link to="/" className="btn-volver">← Volver al Inicio</Link>
      </div>

      <div className="config-container">
        <div className="config-section">
          <h2>🎨 Colores de la Aplicación</h2>
          
          <div className="config-group">
            <h3>Colores Principales</h3>
            <div className="config-row">
              <label>Color de Fondo Principal:</label>
              <input 
                type="color" 
                value={config.colorFondoPrincipal}
                onChange={(e) => handleColorChange('colorFondoPrincipal', e.target.value)}
              />
              <span className="color-value">{config.colorFondoPrincipal}</span>
            </div>
            
            <div className="config-row">
              <label>Color de Fondo Secundario:</label>
              <input 
                type="color" 
                value={config.colorFondoSecundario}
                onChange={(e) => handleColorChange('colorFondoSecundario', e.target.value)}
              />
              <span className="color-value">{config.colorFondoSecundario}</span>
            </div>
            
            <div className="config-row">
              <label>Color de Texto:</label>
              <input 
                type="color" 
                value={config.colorTexto}
                onChange={(e) => handleColorChange('colorTexto', e.target.value)}
              />
              <span className="color-value">{config.colorTexto}</span>
            </div>
            
            <div className="config-row">
              <label>Color de Títulos:</label>
              <input 
                type="color" 
                value={config.colorTitulo}
                onChange={(e) => handleColorChange('colorTitulo', e.target.value)}
              />
              <span className="color-value">{config.colorTitulo}</span>
            </div>
          </div>

          <div className="config-group">
            <h3>Colores de Estados de Pedidos</h3>
            <div className="config-row">
              <label>Pendiente:</label>
              <input 
                type="color" 
                value={config.colorPendiente}
                onChange={(e) => handleColorChange('colorPendiente', e.target.value)}
              />
              <span className="color-value">{config.colorPendiente}</span>
            </div>
            
            <div className="config-row">
              <label>En Preparación:</label>
              <input 
                type="color" 
                value={config.colorPreparacion}
                onChange={(e) => handleColorChange('colorPreparacion', e.target.value)}
              />
              <span className="color-value">{config.colorPreparacion}</span>
            </div>
            
            <div className="config-row">
              <label>Listo:</label>
              <input 
                type="color" 
                value={config.colorListo}
                onChange={(e) => handleColorChange('colorListo', e.target.value)}
              />
              <span className="color-value">{config.colorListo}</span>
            </div>
            
            <div className="config-row">
              <label>Entregado:</label>
              <input 
                type="color" 
                value={config.colorEntregado}
                onChange={(e) => handleColorChange('colorEntregado', e.target.value)}
              />
              <span className="color-value">{config.colorEntregado}</span>
            </div>
          </div>
        </div>

        <div className="config-section">
          <h2>�️ Panel de Administración</h2>
          
          <div className="config-group">
            <div className="config-row">
              <label>Fondo Principal:</label>
              <input 
                type="color" 
                value={config.colorFondoAdmin}
                onChange={(e) => handleColorChange('colorFondoAdmin', e.target.value)}
              />
              <span className="color-value">{config.colorFondoAdmin}</span>
            </div>
            
            <div className="config-row">
              <label>Fondo Secundario:</label>
              <input 
                type="color" 
                value={config.colorFondoSecundarioAdmin}
                onChange={(e) => handleColorChange('colorFondoSecundarioAdmin', e.target.value)}
              />
              <span className="color-value">{config.colorFondoSecundarioAdmin}</span>
            </div>
            
            <div className="config-row">
              <label>Encabezado:</label>
              <input 
                type="color" 
                value={config.colorEncabezadoAdmin}
                onChange={(e) => handleColorChange('colorEncabezadoAdmin', e.target.value)}
              />
              <span className="color-value">{config.colorEncabezadoAdmin}</span>
            </div>
            
            <div className="config-row">
              <label>Color del Título:</label>
              <input 
                type="color" 
                value={config.colorTituloAdmin}
                onChange={(e) => handleColorChange('colorTituloAdmin', e.target.value)}
              />
              <span className="color-value">{config.colorTituloAdmin}</span>
            </div>
            
            <div className="config-row">
              <label>Encabezado de Tabla:</label>
              <input 
                type="color" 
                value={config.colorEncabezadoTablaAdmin}
                onChange={(e) => handleColorChange('colorEncabezadoTablaAdmin', e.target.value)}
              />
              <span className="color-value">{config.colorEncabezadoTablaAdmin}</span>
            </div>
            
            <div className="config-row">
              <label>Botón Crear:</label>
              <input 
                type="color" 
                value={config.colorBotonCrear}
                onChange={(e) => handleColorChange('colorBotonCrear', e.target.value)}
              />
              <span className="color-value">{config.colorBotonCrear}</span>
            </div>
            
            <div className="config-row">
              <label>Botón Eliminar:</label>
              <input 
                type="color" 
                value={config.colorBotonEliminar}
                onChange={(e) => handleColorChange('colorBotonEliminar', e.target.value)}
              />
              <span className="color-value">{config.colorBotonEliminar}</span>
            </div>
          </div>
        </div>

        <div className="config-section">
          <h2>📺 Pantalla Cliente 2 (Columnas)</h2>
          
          <div className="config-group">
            <div className="config-row">
              <label>Color de Fondo:</label>
              <input 
                type="color" 
                value={config.colorFondoClientView2}
                onChange={(e) => handleColorChange('colorFondoClientView2', e.target.value)}
              />
              <span className="color-value">{config.colorFondoClientView2}</span>
            </div>
            
            <div className="config-row">
              <label>Encabezado "En Preparación":</label>
              <input 
                type="color" 
                value={config.colorEncabezadoPreparacion}
                onChange={(e) => handleColorChange('colorEncabezadoPreparacion', e.target.value)}
              />
              <span className="color-value">{config.colorEncabezadoPreparacion}</span>
            </div>
            
            <div className="config-row">
              <label>Encabezado "Para Retirar":</label>
              <input 
                type="color" 
                value={config.colorEncabezadoListo}
                onChange={(e) => handleColorChange('colorEncabezadoListo', e.target.value)}
              />
              <span className="color-value">{config.colorEncabezadoListo}</span>
            </div>
            
            <div className="config-row">
              <label>Tarjeta Fondo 1 (Gradiente):</label>
              <input 
                type="color" 
                value={config.colorTarjetaFondo1}
                onChange={(e) => handleColorChange('colorTarjetaFondo1', e.target.value)}
              />
              <span className="color-value">{config.colorTarjetaFondo1}</span>
            </div>
            
            <div className="config-row">
              <label>Tarjeta Fondo 2 (Gradiente):</label>
              <input 
                type="color" 
                value={config.colorTarjetaFondo2}
                onChange={(e) => handleColorChange('colorTarjetaFondo2', e.target.value)}
              />
              <span className="color-value">{config.colorTarjetaFondo2}</span>
            </div>
          </div>
        </div>

        <div className="config-section">
          <h2>�🖼️ Logo del Negocio</h2>
          <div className="logo-section">
            <div className="logo-upload">
              <label htmlFor="logo-input" className="btn-upload">
                📁 Seleccionar Logo
              </label>
              <input 
                id="logo-input"
                type="file" 
                accept="image/*"
                onChange={handleLogoUpload}
                style={{ display: 'none' }}
              />
            </div>
            
            {config.logoUrl && (
              <div className="logo-preview">
                <img src={config.logoUrl} alt="Logo del negocio" />
              </div>
            )}
          </div>
        </div>

        <div className="config-actions">
          <button onClick={saveConfig} className="btn-save">
            💾 Guardar Configuración
          </button>
          <button onClick={resetConfig} className="btn-reset">
            🔄 Restablecer Predeterminado
          </button>
          <button onClick={exportConfig} className="btn-export">
            📤 Exportar Configuración
          </button>
          <label className="btn-import">
            📥 Importar Configuración
            <input 
              type="file" 
              accept=".json"
              onChange={importConfig}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default ConfigView;
