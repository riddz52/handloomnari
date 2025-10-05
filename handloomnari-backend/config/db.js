const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'shortline.proxy.rlwy.net',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'okiMSvbLqUQfqJvTGNCgueNoihPEIBGs',
  database: process.env.DB_NAME || 'railway',
  port: process.env.DB_PORT || 23311,
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Connected to Railway MySQL database');
  }
});

module.exports = connection;

