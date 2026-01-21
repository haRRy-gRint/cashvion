const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const transactionRoutes = require('./routes/transactions');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Request logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/budget', require('./routes/budget'));
app.use('/api/transactions', transactionRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
