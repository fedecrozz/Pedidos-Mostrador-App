import { useState, useEffect } from 'react'
import './ClientView.css'

// En Electron, el backend siempre corre en localhost:3001
const API_URL = 'http://127.0.0.1:3001/api/pedidos';

function ClientView() {
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

  // Obtener clase de color según estado
  const getEstadoClass = (estado) => {
    switch (estado) {
      case 'Pendiente de entrega':
        return 'estado-pendiente';
      case 'En preparación':
        return 'estado-preparacion';
      case 'Listo para retirar':
        return 'estado-listo';
      case 'Entregado':
        return 'estado-entregado';
      default:
        return '';
    }
  };

  if (loading) {
    return <div className="loading">Cargando pedidos...</div>;
  }

  return (
    <div className="client-view">
      <div className="container">
        {/* Tabla de pedidos */}
        <div className="tabla-container">
          <table className="tabla-pedidos-cliente">
            <thead>
              <tr>
                <th>N° Pedido</th>
                <th>Cliente</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.length === 0 ? (
                <tr>
                  <td colSpan="3" className="no-pedidos">No hay pedidos en este momento</td>
                </tr>
              ) : (
                pedidos.map((pedido) => (
                  <tr key={pedido.id} className={getEstadoClass(pedido.estado)}>
                    <td className="numero-pedido">{pedido.numero_pedido}</td>
                    <td className="cliente-nombre">{pedido.nombre_cliente}</td>
                    <td>
                      <span className={`estado-badge ${getEstadoClass(pedido.estado)}`}>
                        {pedido.estado}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ClientView;
