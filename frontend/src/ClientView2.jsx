import { useState, useEffect } from 'react'
import { useAppConfig } from './useAppConfig'
import './ClientView2.css'

// En Electron, el backend siempre corre en localhost:3001
const API_URL = 'http://127.0.0.1:3001/api/pedidos';

function ClientView2() {
  const config = useAppConfig();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar pedidos al iniciar
  useEffect(() => {
    fetchPedidos();
    // Actualizar cada 5 segundos
    const interval = setInterval(fetchPedidos, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchPedidos = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      // Filtrar solo pedidos en preparación o listos para retirar
      const pedidosFiltrados = data.filter(pedido => 
        pedido.estado === 'En preparación' || pedido.estado === 'Listo para retirar'
      );
      setPedidos(pedidosFiltrados);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      setLoading(false);
    }
  };

  // Separar pedidos por estado
  const pedidosEnPreparacion = pedidos.filter(p => p.estado === 'En preparación');
  const pedidosListos = pedidos.filter(p => p.estado === 'Listo para retirar');

  if (loading) {
    return <div className="loading">Cargando pedidos...</div>;
  }

  const cardStyle = {
    background: `linear-gradient(135deg, ${config.colorTarjetaFondo1}, ${config.colorTarjetaFondo2})`
  };

  return (
    <div className="client-view2" style={{ 
      background: config.colorFondoClientView2,
      minHeight: '100vh',
      padding: '0',
      margin: '0',
      boxSizing: 'border-box'
    }}>
      <div className="columnas-container">
        {/* Columna En Preparación */}
        <div className="columna en-preparacion">
          <div className="columna-header" style={{ background: config.colorEncabezadoPreparacion }}>
            <h2>En Preparación</h2>
          </div>
          <div className="columna-content">
            {pedidosEnPreparacion.length === 0 ? (
              <p className="sin-pedidos">-</p>
            ) : (
              pedidosEnPreparacion.map((pedido) => (
                <div key={pedido.id} className="pedido-card" style={cardStyle}>
                  <div className="pedido-numero">N° {pedido.numero_pedido}</div>
                  <div className="pedido-cliente">{pedido.nombre_cliente}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Columna Listo para Retirar */}
        <div className="columna listo">
          <div className="columna-header" style={{ background: config.colorEncabezadoListo }}>
            <h2>Para Retirar</h2>
          </div>
          <div className="columna-content">
            {pedidosListos.length === 0 ? (
              <p className="sin-pedidos">-</p>
            ) : (
              pedidosListos.map((pedido) => (
                <div key={pedido.id} className="pedido-card" style={cardStyle}>
                  <div className="pedido-numero">N° {pedido.numero_pedido}</div>
                  <div className="pedido-cliente">{pedido.nombre_cliente}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientView2;
