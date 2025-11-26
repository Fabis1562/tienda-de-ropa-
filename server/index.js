const express = require('express');
const cors = require('cors');
const multer = require('multer'); // <--- NUEVO
const path = require('path');     // <--- NUEVO
const fs = require('fs');         // <--- NUEVO
const connectionPromise = require('./db');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// 1. CONFIGURAR DÓNDE SE GUARDAN LAS FOTOS
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir); // Crear la carpeta si no existe
}

// Configuración de Multer (Nombre del archivo y destino)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Carpeta destino
    },
    filename: function (req, file, cb) {
        // Le ponemos la fecha al nombre para que no se repitan
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // ej: 12345678-foto.jpg
    }
});

const upload = multer({ storage: storage });

// 2. HACER LA CARPETA PÚBLICA (Para que el navegador vea la foto)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/', (req, res) => {
  res.send('¡Backend con subida de archivos funcionando!');
});

// --- ENDPOINTS ---

app.get('/api/products', async (req, res) => {
  try {
    const connection = await connectionPromise;
    if (connection) {
      const [rows] = await connection.query('SELECT * FROM productos');
      const productosAdaptados = rows.map(row => ({
        id: row.idProductos,
        name: row.Nombre_prod,
        price: Number(row.Precio),
        description: `Marca: ${row.Marca} - Color: ${row.Color}`,
        // Si la imagen es una URL web, la dejamos. Si es un archivo local, le pegamos el dominio
        image_url: row.Imagen.startsWith('http') ? row.Imagen : `http://localhost:${port}/uploads/${row.Imagen}`,
        category: row.Talla,
        stock: row.Stock,
        marca: row.Marca
      }));
      res.json(productosAdaptados);
    } else {
      res.status(500).json([]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

// CREAR PRODUCTO CON ARCHIVO (POST)
// 'imageFile' es el nombre del campo que enviaremos desde React
app.post('/api/products', upload.single('imageFile'), async (req, res) => {
  // Multer pone el archivo en req.file y los textos en req.body
  const { name, price, category, stock, color, marca, provider, image: imageUrl } = req.body;
  
  // Si subieron archivo, usamos esa ruta. Si no, usamos la URL escrita o el default.
  let finalImage = 'https://via.placeholder.com/300';
  
  if (req.file) {
      finalImage = req.file.filename; // Guardamos solo el nombre del archivo en la BD
  } else if (imageUrl) {
      finalImage = imageUrl;
  }

  try {
    const connection = await connectionPromise;
    await connection.query(
      'CALL sp_crear_producto(?, ?, ?, ?, ?, ?, ?, ?)', 
      [name, provider || 'Genérico', stock, color, marca, price, category, finalImage]
    );
    res.status(201).json({ message: 'Producto creado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear' });
  }
});

// ACTUALIZAR PRODUCTO CON ARCHIVO (PUT)
app.put('/api/products/:id', upload.single('imageFile'), async (req, res) => {
  const { id } = req.params;
  const { name, price, stock, image: imageUrl } = req.body;

  let finalImage = imageUrl; // Por defecto mantenemos la URL que ya tenía
  if (req.file) {
      finalImage = req.file.filename; // Si subieron nueva foto, la reemplazamos
  }

  try {
    const connection = await connectionPromise;
    await connection.query(
      'UPDATE productos SET Nombre_prod = ?, Precio = ?, Stock = ?, Imagen = ? WHERE idProductos = ?',
      [name, price, stock, finalImage, id]
    );
    res.json({ message: 'Actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar' });
  }
});

// Login y Delete (se quedan igual)
app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await connectionPromise;
        await connection.query('DELETE FROM productos WHERE idProductos = ?', [id]);
        res.json({ message: 'Eliminado' });
    } catch (e) { res.status(500).json({error: 'Error'}); }
});

// ENDPOINT: CREAR PEDIDO (COMPRA)
app.post('/api/orders', async (req, res) => {
  const { customer, cart, total } = req.body;

  try {
    const connection = await connectionPromise;
    if (!connection) return res.status(500).json({ error: 'Sin conexión' });

    // 1. Empezamos una transacción (todo o nada)
    await connection.beginTransaction();

    // 2. Insertamos el Pedido (Cabecera)
    const [resultPedido] = await connection.query(
      'INSERT INTO pedidos (cliente, total) VALUES (?, ?)',
      [customer || 'Cliente Web', total]
    );
    const idPedido = resultPedido.insertId;

    // 3. Insertamos cada producto del carrito y restamos stock
    for (const item of cart) {
      // Guardar detalle
      await connection.query(
        'INSERT INTO detalle_pedido (idPedido, idProducto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [idPedido, item.id, item.quantity, item.price]
      );

      // Restar stock (Llamando al SP que creamos)
      await connection.query('CALL sp_restar_stock(?, ?)', [item.id, item.quantity]);
    }

    // 4. Confirmamos todo
    await connection.commit();
    
    res.status(201).json({ message: 'Compra realizada con éxito', orderId: idPedido });

  } catch (err) {
    // Si algo falla, deshacemos todo
    const connection = await connectionPromise;
    await connection.rollback();
    console.error('Error en compra:', err);
    res.status(500).json({ error: 'Error al procesar la compra' });
  }
});

app.post('/api/login', async (req, res) => { /* ... tu código de login ... */ });

connectionPromise.then(() => {
  app.listen(port, () => {
    console.log(`✅ Servidor Backend corriendo en http://localhost:${port}`);
  });
});