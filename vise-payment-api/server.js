const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const clientRoutes = require('./src/routes/client');
const purchaseRoutes = require('./src/routes/purchase');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/client', clientRoutes);
app.use('/purchase', purchaseRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});