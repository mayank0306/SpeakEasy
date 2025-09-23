require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    const apiKey = process.env.ASSEMBLYAI_API_KEY?.trim();
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        apiKey: apiKey ? 'Set' : 'Not set'
    });
});

// Routes
const analysisRoutes = require('./routes/analysisRoutes');
app.use('/api', analysisRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


