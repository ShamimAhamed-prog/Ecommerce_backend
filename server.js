require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000', // frontend URL
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const AuthRoutes = require('./app/routes/Auth.routes');
const ProductRoutes = require('./app/routes/Product.routes');

app.use('/auth', AuthRoutes);
app.use('/products', ProductRoutes);

// Start
const PORT = process.env.APP_PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
