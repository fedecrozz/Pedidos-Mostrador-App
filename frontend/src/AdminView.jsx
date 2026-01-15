import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAppConfig } from './useAppConfig'
import './AdminView.css'

// En Electron, el backend siempre corre en localhost:3001
const API_URL = 'http://127.0.0.1:3001/api/pedidos';

function AdminView() {
  const config = useAppConfig();
  const [pedidos, setPedidos] = useState([]);
  const [nombreCliente, setNombreCliente] = useState('');
  const [numeroPedido, setNumeroPedido] = useState('');
  const [loading, setLoading] = useState(true);
  const [ordenamiento, setOrdenamiento] = useState({ campo: 'numero_pedido', direccion: 'desc' });
  const [ocultarEntregados, setOcultarEntregados] = useState(false);
  const numeroPedidoRef = useRef(null);

  // Cargar pedidos al iniciar
  useEffect(() => {
    fetchPedidos();
    obtenerSiguienteNumero().then(() => {
      // Setear foco en el campo de número de pedido al cargar
      setTimeout(() => {
        if (numeroPedidoRef.current) {
          numeroPedidoRef.current.focus();
        }
      }, 100);
    });
  }, []);

  const obtenerSiguienteNumero = async () => {
    try {
      const response = await fetch('http://127.0.0.1:3001/api/pedidos/ultimo-numero');
      const data = await response.json();
      setNumeroPedido(data.siguienteNumero.toString());
    } catch (error) {
      console.error('Error al obtener siguiente número:', error);
      setNumeroPedido('1');
    }
  };

  const fetchPedidos = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setPedidos(data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      setLoading(false);
    }
  };

  // Crear nuevo pedido
  const handleCrearPedido = async (e) => {
    e.preventDefault();
    if (!nombreCliente.trim() || !numeroPedido.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nombre_cliente: nombreCliente, 
          estado: 'Pendiente de entrega',
          numero_pedido: numeroPedido
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        alert(data.error || 'Error al crear pedido');
        return;
      }
      
      setNombreCliente('');
      fetchPedidos();
      
      // Obtener siguiente número y setear foco después de un delay
      setTimeout(async () => {
        await obtenerSiguienteNumero();
        if (numeroPedidoRef.current) {
          numeroPedidoRef.current.focus();
        }
      }, 100);
    } catch (error) {
      console.error('Error al crear pedido:', error);
      alert('Error al crear pedido');
    }
  };

  // Cambiar estado del pedido
  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      fetchPedidos();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  // Eliminar pedido
  const handleEliminarPedido = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este pedido?')) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      fetchPedidos();
    } catch (error) {
      console.error('Error al eliminar pedido:', error);
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
  // Manejar ordenamiento
  const handleOrdenar = (campo) => {
    setOrdenamiento(prev => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Ordenar pedidos
  const pedidosOrdenados = [...pedidos]
    .filter(pedido => !ocultarEntregados || pedido.estado !== 'Entregado')
    .sort((a, b) => {
    let valorA = a[ordenamiento.campo];
    let valorB = b[ordenamiento.campo];

    // Convertir a número si es numero_pedido
    if (ordenamiento.campo === 'numero_pedido') {
      valorA = parseInt(valorA) || 0;
      valorB = parseInt(valorB) || 0;
    }

    if (valorA < valorB) return ordenamiento.direccion === 'asc' ? -1 : 1;
    if (valorA > valorB) return ordenamiento.direccion === 'asc' ? 1 : -1;
    return 0;
  });
  if (loading) {
    return <div className="loading">Cargando pedidos...</div>;
  }

  const appStyle = {
    background: `linear-gradient(135deg, ${config.colorFondoAdmin} 0%, ${config.colorFondoSecundarioAdmin} 100%)`
  };

  const headerStyle = {
    background: config.colorEncabezadoAdmin
  };

  const titleStyle = {
    color: config.colorTituloAdmin
  };

  const tableHeaderStyle = {
    backgroundColor: config.colorEncabezadoTablaAdmin,
    color: '#ffffff'
  };

  const btnCrearStyle = {
    background: config.colorBotonCrear
  };

  return (
    <div className="app" style={appStyle}>
      <header className="header" style={headerStyle}>
        {config.logoUrl && (
          <div className="header-logo">
            <img src={config.logoUrl} alt="Logo" />
          </div>
        )}
        <h1 style={titleStyle}>📋 Administración de Pedidos</h1>
        <Link to="/" className="btn-volver">← Volver al Menú</Link>
      </header>

      <div className="container">
        {/* Formulario para crear pedido */}
        <form onSubmit={handleCrearPedido} className="form-crear">
          <input
            type="text"
            placeholder="Número de pedido"
            value={numeroPedido}
            onChange={(e) => setNumeroPedido(e.target.value)}
            className="input-pedido"
            ref={numeroPedidoRef}
            required
          />
          <input
            type="text"
            placeholder="Nombre del cliente"
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
            className="input-cliente"
            required
          />
          <button type="submit" className="btn-crear" style={btnCrearStyle}>
            Crear Pedido
          </button>
        </form>

        {/* Filtro de pedidos entregados */}
        <div className="filtro-container">
          <label className="filtro-checkbox">
            <input
              type="checkbox"
              checked={ocultarEntregados}
              onChange={(e) => setOcultarEntregados(e.target.checked)}
            />
            <span>Ocultar pedidos Entregados</span>
          </label>
        </div>

        {/* Tabla de pedidos */}
        <div className="tabla-container">
          <table className="tabla-pedidos">
            <thead>
              <tr style={tableHeaderStyle}>
                <th onClick={() => handleOrdenar('numero_pedido')} className="sortable">
                  N° Pedido {ordenamiento.campo === 'numero_pedido' && (ordenamiento.direccion === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleOrdenar('nombre_cliente')} className="sortable">
                  Cliente {ordenamiento.campo === 'nombre_cliente' && (ordenamiento.direccion === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleOrdenar('estado')} className="sortable">
                  Estado {ordenamiento.campo === 'estado' && (ordenamiento.direccion === 'asc' ? '↑' : '↓')}
                </th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidosOrdenados.length === 0 ? (
                <tr>
                  <td colSpan="4" className="no-pedidos">No hay pedidos en este momento</td>
                </tr>
              ) : (
                pedidosOrdenados.map((pedido) => (
                  <tr key={pedido.id} className={getEstadoClass(pedido.estado)}>
                    <td className="numero-pedido">{pedido.numero_pedido}</td>
                    <td className="cliente-nombre">{pedido.nombre_cliente}</td>
                    <td>
                      <span className={`estado-badge ${getEstadoClass(pedido.estado)}`}>
                        {pedido.estado}
                      </span>
                    </td>
                    <td className="acciones">
                      <div className="botonera-estados">
                        <button
                          onClick={() => handleCambiarEstado(pedido.id, 'Pendiente de entrega')}
                          className={`btn-estado ${pedido.estado === 'Pendiente de entrega' ? 'activo' : ''} estado-pendiente`}
                          title="Pendiente de entrega"
                        >
                          Pendiente
                        </button>
                        <button
                          onClick={() => handleCambiarEstado(pedido.id, 'En preparación')}
                          className={`btn-estado ${pedido.estado === 'En preparación' ? 'activo' : ''} estado-preparacion`}
                          title="En preparación"
                        >
                          Preparación
                        </button>
                        <button
                          onClick={() => handleCambiarEstado(pedido.id, 'Listo para retirar')}
                          className={`btn-estado ${pedido.estado === 'Listo para retirar' ? 'activo' : ''} estado-listo`}
                          title="Listo para retirar"
                        >
                          Listo
                        </button>
                        <button
                          onClick={() => handleCambiarEstado(pedido.id, 'Entregado')}
                          className={`btn-estado ${pedido.estado === 'Entregado' ? 'activo' : ''} estado-entregado`}
                          title="Entregado"
                        >
                          Entregado
                        </button>
                      </div>
                      <button
                        onClick={() => handleEliminarPedido(pedido.id)}
                        className="btn-eliminar"
                        style={{ background: config.colorBotonEliminar }}
                        title="Eliminar pedido"
                      >
                        ✕
                      </button>
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

export default AdminView;
