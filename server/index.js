const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const connectionPromise = require('./db');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// 1. CONFIGURAR CARPETA DE FOTOS
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, 'uploads/'); },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => res.send('¡Backend Tienda Ropa Funcionando! 🚀'));

/* ==========================================================================
   MÓDULO DE PRODUCTOS
   ========================================================================== */

// GET: Obtener Productos
app.get('/api/products', async (req, res) => {
  try {
    const connection = await connectionPromise;
    if (connection) {
      const [rows] = await connection.query('SELECT * FROM productos');
      const productos = rows.map(row => ({
        id: row.idProductos,
        name: row.Nombre_prod,
        price: Number(row.Precio),
        description: `Marca: ${row.Marca} - Color: ${row.Color}`,
        image_url: row.Imagen && row.Imagen.startsWith('http') ? row.Imagen : `http://192.168.1.39:${port}/uploads/${row.Imagen}`,
        category: row.Talla,
        stock: row.Stock,
        marca: row.Marca
      }));
      res.json(productos);
    } else { res.status(500).json([]); }
  } catch (err) { res.status(500).json([]); }
});

// POST: Crear Producto (Con Foto)
app.post('/api/products', upload.single('imageFile'), async (req, res) => {
  const { name, price, category, stock, color, marca, provider, image: imageUrl } = req.body;
  let finalImage = 'https://via.placeholder.com/300';
  if (req.file) finalImage = req.file.filename;
  else if (imageUrl) finalImage = imageUrl;

  try {
    const connection = await connectionPromise;
    await connection.query('CALL sp_crear_producto(?, ?, ?, ?, ?, ?, ?, ?)', 
      [name, provider || 'Genérico', stock, color, marca, price, category, finalImage]);
    res.status(201).json({ message: 'Producto creado' });
  } catch (err) { res.status(500).json({ error: 'Error al crear' }); }
});

// PUT: Actualizar Producto
app.put('/api/products/:id', upload.single('imageFile'), async (req, res) => {
  const { id } = req.params;
  const { name, price, stock, image: imageUrl } = req.body;
  let finalImage = imageUrl;
  if (req.file) finalImage = req.file.filename;

  try {
    const connection = await connectionPromise;
    await connection.query('UPDATE productos SET Nombre_prod = ?, Precio = ?, Stock = ?, Imagen = ? WHERE idProductos = ?', 
      [name, price, stock, finalImage, id]);
    res.json({ message: 'Actualizado' });
  } catch (err) { res.status(500).json({ error: 'Error al actualizar' }); }
});

// DELETE: Eliminar Producto
app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await connectionPromise;
        // Desactivamos FK temporalmente para poder borrar aunque tenga historial
        await connection.query('SET FOREIGN_KEY_CHECKS=0');
        await connection.query('DELETE FROM productos WHERE idProductos = ?', [id]);
        await connection.query('SET FOREIGN_KEY_CHECKS=1');
        res.json({ message: 'Eliminado' });
    } catch (e) { res.status(500).json({error: 'Error'}); }
});

/* ==========================================================================
   MÓDULO DE PEDIDOS (VENTAS)
   ========================================================================== */

// GET: Listar Pedidos
app.get('/api/orders', async (req, res) => {
  try {
    const connection = await connectionPromise;
    const [rows] = await connection.query('SELECT * FROM pedidos ORDER BY fecha DESC');
    const pedidos = rows.map(p => ({
      id: `#${p.idPedido}`,
      realId: p.idPedido,
      customerName: p.cliente,
      date: p.fecha,
      totalAmount: Number(p.total),
      status: p.estado
    }));
    res.json(pedidos);
  } catch (err) { res.status(500).json([]); }
});

// GET: Detalles de un Pedido
app.get('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await connectionPromise;
    const query = `
      SELECT dp.cantidad, dp.precio_unitario, p.Nombre_prod, p.Imagen
      FROM detalle_pedido dp
      JOIN productos p ON dp.idProducto = p.idProductos
      WHERE dp.idPedido = ?
    `;
    const [rows] = await connection.query(query, [id]);
    const detalles = rows.map(row => ({
      name: row.Nombre_prod,
      quantity: row.cantidad,
      price: Number(row.precio_unitario),
      image: row.Imagen && row.Imagen.startsWith('http') ? row.Imagen : `http://192.168.1.39:${port}/uploads/${row.Imagen}`
    }));
    res.json(detalles);
  } catch (err) { res.status(500).json({ error: 'Error' }); }
});

// PUT: Cambiar Estatus Pedido
app.put('/api/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const connection = await connectionPromise;
    await connection.query('UPDATE pedidos SET estado = ? WHERE idPedido = ?', [status, id]);
    res.json({ message: 'Estatus actualizado' });
  } catch (err) { res.status(500).json({ error: 'Error' }); }
});

// POST: Crear Pedido (Checkout)
app.post('/api/orders', async (req, res) => {
  const { customer, cart, total } = req.body;
  try {
    const connection = await connectionPromise;
    await connection.beginTransaction();
    const [result] = await connection.query('INSERT INTO pedidos (cliente, total) VALUES (?, ?)', [customer || 'Cliente Web', total]);
    const idPedido = result.insertId;

    for (const item of cart) {
      await connection.query('INSERT INTO detalle_pedido (idPedido, idProducto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)', 
        [idPedido, item.id, item.quantity, item.price]);
      // Opcional: Actualizar stock aquí
    }
    await connection.commit();
    res.status(201).json({ message: 'Compra exitosa', orderId: idPedido });
  } catch (err) {
    const connection = await connectionPromise;
    await connection.rollback();
    res.status(500).json({ error: 'Error en compra' });
  }
});

/* ==========================================================================
   MÓDULO DE CLIENTES Y EMPLEADOS
   ========================================================================== */

// GET EMPLEADOS (Excluye Admin y Clientes)
app.get('/api/employees', async (req, res) => {
  try {
    const connection = await connectionPromise;
    const [rows] = await connection.query(
      "SELECT id, nombre_completo, usuario, rol FROM usuarios WHERE usuario != 'admin' AND rol != 'Cliente'"
    );
    const empleados = rows.map(u => ({
      id: `E${u.id}`,
      realId: u.id,
      name: u.nombre_completo,
      email: `${u.usuario}@tienda.com`,
      role: u.rol,
      hireDate: new Date().toISOString()
    }));
    res.json(empleados);
  } catch (err) { res.status(500).json([]); }
});

// POST EMPLEADO
app.post('/api/employees', async (req, res) => {
  const { name, username, password, role } = req.body;
  try {
    const connection = await connectionPromise;
    await connection.query('INSERT INTO usuarios (nombre_completo, usuario, password, rol) VALUES (?, ?, ?, ?)', 
      [name, username, password, role]);
    res.status(201).json({ message: 'Creado' });
  } catch (err) { res.status(500).json({ error: 'Error' }); }
});

// DELETE EMPLEADO
app.delete('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await connectionPromise;
    await connection.query('DELETE FROM usuarios WHERE id = ?', [id]);
    res.json({ message: 'Eliminado' });
  } catch (err) { res.status(500).json({ error: 'Error' }); }
});

// GET CLIENTES (Reales que compraron)
app.get('/api/customers', async (req, res) => {
  try {
    const connection = await connectionPromise;
    const query = `
      SELECT u.id, u.nombre_completo, u.usuario, MAX(p.fecha) as lastOrder, COALESCE(SUM(p.total), 0) as totalSpent 
      FROM usuarios u
      LEFT JOIN pedidos p ON u.nombre_completo = p.cliente
      WHERE u.rol = 'Cliente'
      GROUP BY u.id
    `;
    const [rows] = await connection.query(query);
    const clientes = rows.map(row => ({
      id: `C${row.id}`,
      name: row.nombre_completo,
      email: `${row.usuario}@gmail.com`,
      phone: '555-0000',
      lastOrder: row.lastOrder || null,
      totalSpent: row.totalSpent
    }));
    res.json(clientes);
  } catch (err) { res.status(500).json([]); }
});

// REGISTRO DE CLIENTES (Público)
app.post('/api/register-client', async (req, res) => {
  const { name, username, password } = req.body;
  try {
    const connection = await connectionPromise;
    await connection.query('INSERT INTO usuarios (nombre_completo, usuario, password, rol) VALUES (?, ?, ?, ?)', 
      [name, username, password, 'Cliente']);
    res.status(201).json({ success: true });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ success: false, message: 'Usuario existe' });
    res.status(500).json({ success: false });
  }
});

/* ==========================================================================
   MÓDULO DE REPORTES Y RESERVAS
   ========================================================================== */

// GET REPORTE VENTAS
app.get('/api/sales-report', async (req, res) => {
  try {
    const connection = await connectionPromise;
    const [totales] = await connection.query(`SELECT SUM(total) as totalRevenue, COUNT(*) as totalOrders, AVG(total) as averageTicket FROM pedidos`);
    const [porDia] = await connection.query(`
      SELECT DATE_FORMAT(fecha, '%Y-%m-%d') as fullDate, DATE_FORMAT(fecha, '%a') as day, SUM(total) as ingresos 
      FROM pedidos WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) GROUP BY fullDate, day ORDER BY fullDate ASC
    `);
    const [topProductos] = await connection.query(`
      SELECT p.Nombre_prod as name, SUM(dp.cantidad) as value FROM detalle_pedido dp JOIN productos p ON dp.idProducto = p.idProductos GROUP BY p.idProductos ORDER BY value DESC LIMIT 5
    `);
    res.json({ stats: totales[0], chartData: porDia, topProducts: topProductos });
  } catch (err) { res.status(500).json({ error: 'Error' }); }
});

// GET RESERVAS
app.get('/api/reservations', async (req, res) => {
  try {
    const connection = await connectionPromise;
    const [rows] = await connection.query('SELECT * FROM reservas ORDER BY fecha_reserva DESC');
    const reservas = rows.map(r => ({
      id: `R${r.idReserva}`,
      customerName: r.cliente,
      productName: r.producto,
      reservationDate: r.fecha_reserva,
      pickupDate: r.fecha_recogida,
      status: r.estado,
      amount: Number(r.monto)
    }));
    res.json(reservas);
  } catch (err) { res.status(500).json([]); }
});

/* ==========================================================================
   AUTENTICACIÓN (LOGIN)
   ========================================================================== */
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const connection = await connectionPromise;
    if (!connection) return res.status(500).json({ message: 'Sin conexión' });
    
    const [rows] = await connection.query('CALL sp_validar_login(?, ?)', [username, password]);
    const resultados = rows[0];

    if (resultados.length > 0) {
      const usuario = resultados[0];
      // BUSCAR PERMISOS
      const [permisos] = await connection.query('SELECT menu_id FROM permisos_menu WHERE rol = ?', [usuario.rol]);
      const listaMenues = permisos.map(p => p.menu_id);

      res.json({ 
        success: true, 
        user: { name: usuario.nombre_completo, role: usuario.rol, allowedMenus: listaMenues } 
      });
    } else {
      res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }
  } catch (err) { res.status(500).json({ success: false, message: 'Error servidor' }); }
});

// START SERVER
connectionPromise.then(() => {
  app.listen(port, () => console.log(`✅ Servidor Backend corriendo en http://192.168.1.39:${port}`));
});