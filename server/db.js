const mysql = require('mysql2/promise');
require('dotenv').config();

const dbName = process.env.DB_NAME;

const connectionConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

let connection;

async function initializeDatabase() {
  try {
    // Connect without a database selected
    let conn = await mysql.createConnection(connectionConfig);
    console.log('Connected to MySQL successfully.');

    // Create database if it doesn't exist
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`Database '${dbName}' is ready.`);
    await conn.end();

    // Connect to the specific database
    connection = await mysql.createConnection({
      ...connectionConfig,
      database: dbName,
    });
    console.log('Connected to the database as id ' + connection.threadId);

    // Create table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image_url VARCHAR(255)
      )
    `;
    await connection.query(createTableQuery);
    console.log('\`products\` table is ready.');

    // Check if table is empty before inserting data
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM products');
    if (rows[0].count === 0) {
      console.log('Seeding products table...');
      const insertQuery = `
        INSERT INTO products (name, description, price, image_url) VALUES
        ('T-Shirt', 'A nice t-shirt', 19.99, 'https://via.placeholder.com/150'),
        ('Jeans', 'A pair of jeans', 49.99, 'https://via.placeholder.com/150'),
        ('Jacket', 'A cool jacket', 89.99, 'https://via.placeholder.com/150')
      `;
      await connection.query(insertQuery);
      console.log('Products table seeded.');
    }

    return connection;
  } catch (err) {
    console.error('Database initialization error:', err.message);
    // Return null instead of exiting, so the server can fallback to mock data
    return null;
  }
}

const connectionPromise = initializeDatabase();

module.exports = connectionPromise;
