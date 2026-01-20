const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Conexión a la base de datos
// En producción (empaquetado), la base de datos está en la raíz del proyecto
// En desarrollo, está un nivel arriba del backend
const dbPath = path.join(__dirname, '..', 'pedidos.db');
console.log('Intentando conectar a la base de datos en:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite en:', dbPath);
    
    // Crear la tabla si no existe
    db.run(`CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero_pedido TEXT NOT NULL,
      nombre_cliente TEXT,
      estado TEXT NOT NULL,
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error al crear la tabla pedidos:', err.message);
      } else {
        console.log('Tabla pedidos verificada/creada correctamente');
      }
    });
  }
});

// Obtener todos los pedidos
app.get('/api/pedidos', (req, res) => {
  db.all('SELECT * FROM pedidos', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Obtener el último número de pedido
app.get('/api/pedidos/ultimo-numero', (req, res) => {
  db.get('SELECT numero_pedido FROM pedidos ORDER BY CAST(numero_pedido AS INTEGER) DESC LIMIT 1', [], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      const ultimoNumero = row ? parseInt(row.numero_pedido) || 0 : 0;
      const siguienteNumero = ultimoNumero + 1;
      res.json({ siguienteNumero });
    }
  });
});

// Crear un nuevo pedido
app.post('/api/pedidos', (req, res) => {
  const { nombre_cliente, estado, numero_pedido } = req.body;
  
  // Verificar si ya existe un pedido con ese número
  db.get('SELECT id FROM pedidos WHERE numero_pedido = ?', [numero_pedido], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (row) {
      res.status(400).json({ error: 'Ya existe un pedido con ese número' });
      return;
    }
    
    // Crear el pedido si no existe duplicado
    db.run(
      'INSERT INTO pedidos (nombre_cliente, estado, numero_pedido) VALUES (?, ?, ?)',
      [nombre_cliente, estado, numero_pedido],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json({ id: this.lastID });
        }
      }
    );
  });
});

// Cambiar estado de un pedido
app.put('/api/pedidos/:id', (req, res) => {
  const { estado } = req.body;
  db.run(
    'UPDATE pedidos SET estado = ? WHERE id = ?',
    [estado, req.params.id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ updated: this.changes });
      }
    }
  );
});

// Eliminar un pedido
app.delete('/api/pedidos/:id', (req, res) => {
  db.run('DELETE FROM pedidos WHERE id = ?', [req.params.id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ deleted: this.changes });
    }
  });
});

// Eliminar todos los pedidos entregados
app.delete('/api/pedidos/entregados/todos', (req, res) => {
  db.run('DELETE FROM pedidos WHERE estado = ?', ['Entregado'], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ deleted: this.changes });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
});
