   const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',          // Your MySQL username
    password: 'tictactoe', // <-- Put your MySQL root password here
    database: 'handloomnari'  // Your database name
});

db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err);
    } else {
        console.log('✅ Connected to MySQL database');
    }
});

module.exports = db;
