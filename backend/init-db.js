const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../pedidos.db');

// Eliminar base de datos existente si existe
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Base de datos anterior eliminada');
}

// Crear nueva base de datos
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al crear la base de datos:', err.message);
  } else {
    console.log('Base de datos creada exitosamente');
  }
});

// Crear tabla
db.run(`
  CREATE TABLE pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero_pedido TEXT NOT NULL,
    nombre_cliente TEXT NOT NULL,
    estado TEXT NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error('Error al crear la tabla:', err.message);
  } else {
    console.log('Tabla pedidos creada exitosamente');
  }
  
  // Cerrar la base de datos
  db.close((err) => {
    if (err) {
      console.error('Error al cerrar la base de datos:', err.message);
    } else {
      console.log('Base de datos inicializada correctamente');
    }
  });
});
