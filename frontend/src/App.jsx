import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom'
import AdminView from './AdminView'
import ClientView from './ClientView'
import ClientView2 from './ClientView2'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminView />} />
        <Route path="/cliente" element={<ClientView />} />
        <Route path="/cliente2" element={<ClientView2 />} />
      </Routes>
    </Router>
  );
}

function Home() {
  const openNewWindow = (path) => {
    // Abrir en una nueva ventana usando window.open
    window.open(`${window.location.origin}${window.location.pathname}#${path}`, '_blank', 'width=1200,height=800');
  };

  return (
    <div className="home">
      <div className="home-container">
        <h1>📋 Sistema de Pedidos</h1>
        <p className="home-subtitle">Seleccione una opción</p>
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
        </div>
      </div>
    </div>
  );
}

export default App;
