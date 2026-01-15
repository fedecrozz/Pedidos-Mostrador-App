import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom'
import AdminView from './AdminView'
import ClientView from './ClientView'
import ClientView2 from './ClientView2'
import ConfigView from './ConfigView'
import { useAppConfig } from './useAppConfig'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminView />} />
        <Route path="/cliente" element={<ClientView />} />
        <Route path="/cliente2" element={<ClientView2 />} />
        <Route path="/config" element={<ConfigView />} />
      </Routes>
    </Router>
  );
}

function Home() {
  const config = useAppConfig();

  const openNewWindow = (path) => {
    // Abrir en una nueva ventana usando window.open
    window.open(`${window.location.origin}${window.location.pathname}#${path}`, '_blank', 'width=1200,height=800');
  };

  const homeStyle = {
    background: `linear-gradient(135deg, ${config.colorFondoPrincipal} 0%, ${config.colorFondoSecundario} 100%)`
  };

  return (
    <div className="home" style={homeStyle}>
      <div className="home-container">
        {config.logoUrl && (
          <div className="home-logo">
            <img src={config.logoUrl} alt="Logo" />
          </div>
        )}
        <h1 style={{ color: config.colorTexto }}>📋 Sistema de Pedidos</h1>
        <p className="home-subtitle" style={{ color: config.colorTexto }}>Seleccione una opción</p>
        <div className="home-buttons">
          <Link to="/admin" className="home-btn admin-btn">
            <span className="btn-icon">⚙️</span>
            <span className="btn-text">Administración</span>
            <span className="btn-desc">Crear y gestionar pedidos</span>
          </Link>
          <button onClick={() => openNewWindow('/cliente')} className="home-btn client-btn">
            <span className="btn-icon">📊</span>
            <span className="btn-text">Vista Cliente (Tabla)</span>
            <span className="btn-desc">Consultar estado de pedidos</span>
          </button>
          <button onClick={() => openNewWindow('/cliente2')} className="home-btn client-btn">
            <span className="btn-icon">📺</span>
            <span className="btn-text">Vista Cliente (Pantalla)</span>
            <span className="btn-desc">Visualización en columnas</span>
          </button>
          <Link to="/config" className="home-btn config-btn">
            <span className="btn-icon">🎨</span>
            <span className="btn-text">Configuración</span>
            <span className="btn-desc">Personalizar colores y logo</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;
