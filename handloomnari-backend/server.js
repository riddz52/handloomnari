const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db'); // Your updated Railway db.js

const app = express();
const PORT = process.env.PORT || 5050; // Node server port (not MySQL)

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Root route
app.get('/', (req, res) => {
    res.send('🚀 Handloom Nari Backend is running!');
});

// ✅ Test database connection route
app.get('/test-db', (req, res) => {
    db.query('SELECT NOW() AS time', (err, result) => {
        if (err) {
            console.error('❌ Database test failed:', err);
            return res.status(500).json({ message: 'Database connection failed', error: err });
        }
        res.json({ message: '✅ Database connection successful!', currentTime: result[0].time });
    });
});

// Place order API
app.post('/place-order', (req, res) => {
    const { customer_name, customer_address, phone, cart } = req.body;

    if (!customer_name || !customer_address || !phone || !cart || cart.length === 0) {
        return res.status(400).json({ message: '❌ Invalid order data' });
    }

    const totalAmount = cart.reduce((sum, item) => sum + item.rate * item.quantity, 0);

    const orderQuery = `
        INSERT INTO orders (customer_name, customer_address, phone, total_amount)
        VALUES (?, ?, ?, ?)
    `;

    db.query(orderQuery, [customer_name, customer_address, phone, totalAmount], (err, result) => {
        if (err) {
            console.error('❌ Error inserting order:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }

        const orderId = result.insertId;

        const cartValues = cart.map(item => [
            orderId,
            item.product_name,
            item.quantity,
            item.rate,
            item.quantity * item.rate
        ]);

        const cartQuery = `
            INSERT INTO cart_details (order_id, product_name, quantity, rate, total_amount)
            VALUES ?
        `;

        db.query(cartQuery, [cartValues], (err2) => {
            if (err2) {
                console.error('❌ Error inserting cart items:', err2);
                return res.status(500).json({ message: 'Database error', error: err2 });
            }

            res.status(201).json({ message: '✅ Order placed successfully', orderId });
        });
    });
});

// Get all orders
app.get('/orders', (req, res) => {
    db.query('SELECT * FROM orders', (err, results) => {
        if (err) {
            console.error('❌ Error fetching orders:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.json(results);
    });
});

// Test route to insert a sample order
app.get('/test-order', (req, res) => {
    const sampleOrder = {
        customer_name: 'Riddhima',
        customer_address: '123 Street, Pune',
        phone: '9876543210',
        cart: [
            { product_name: 'Chanderi Saree', quantity: 1, rate: 1200 },
            { product_name: 'Silk Saree', quantity: 2, rate: 1500 }
        ]
    };

    const totalAmount = sampleOrder.cart.reduce((sum, item) => sum + item.rate * item.quantity, 0);

    const orderQuery = `
        INSERT INTO orders (customer_name, customer_address, phone, total_amount)
        VALUES (?, ?, ?, ?)
    `;

    db.query(orderQuery, [sampleOrder.customer_name, sampleOrder.customer_address, sampleOrder.phone, totalAmount], (err, result) => {
        if (err) return res.status(500).send('Error inserting order: ' + err);

        const orderId = result.insertId;

        const cartValues = sampleOrder.cart.map(item => [
            orderId,
            item.product_name,
            item.quantity,
            item.rate,
            item.quantity * item.rate
        ]);

        const cartQuery = `
            INSERT INTO cart_details (order_id, product_name, quantity, rate, total_amount)
            VALUES ?
        `;

        db.query(cartQuery, [cartValues], (err2) => {
            if (err2) return res.status(500).send('Error inserting cart items: ' + err2);

            res.send(`✅ Test order inserted successfully. Order ID: ${orderId}`);
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${5050}`);
});
