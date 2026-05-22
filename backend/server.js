const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Inisialisasi Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

// Endpoint chat
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    
    if (!message) {
        return res.status(400).json({ error: 'Pesan tidak boleh kosong' });
    }
    
    try {
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();
        
        res.json({ success: true, response: text });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Gagal mendapatkan respons dari Gemini' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    console.log(`Buka browser dan akses: http://localhost:${PORT}`);
});