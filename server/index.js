const express = require('express');
const cors = require('cors');
const connectionPromise = require('./db');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Mock data to be used if the database is not available
const mockProducts = [
  {
    id: 1,
    name: 'T-Shirt (Mock)',
    description: 'A nice t-shirt',
    price: 19.99,
    image_url: 'https://via.placeholder.com/150'
  },
  {
    id: 2,
    name: 'Jeans (Mock)',
    description: 'A pair of jeans',
    price: 49.99,
    image_url: 'https://via.placeholder.com/150'
  },
  {
    id: 3,
    name: 'Jacket (Mock)',
    description: 'A cool jacket',
    price: 89.99,
    image_url: 'https://via.placeholder.com/150'
  }
];

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Endpoint to get all products
app.get('/api/products', async (req, res) => {
  try {
    const connection = await connectionPromise;
    // Check if the connection object is valid
    if (connection && connection.query) {
      const [rows] = await connection.query('SELECT * FROM products');
      res.json(rows);
    } else {
      // Fallback to mock data if the database connection failed
      console.log('Database connection not available. Serving mock data.');
      res.json(mockProducts);
    }
  } catch (err) {
    console.error('Error getting products:', err);
    console.log('Serving mock data due to error.');
    res.json(mockProducts);
  }
});

let server;
connectionPromise.then(conn => {
  if (conn) {
    server = app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  } else {
    throw new Error('Database connection failed to initialize.');
  }
}).catch(err => {
  console.error('Failed to initialize server with DB connection, falling back to mock data.');
  server = app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port} with mock data only.`);
  });
});
