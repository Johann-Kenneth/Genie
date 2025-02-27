const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const chatbotRoutes = require('./routes/chatbot');
dotenv.config();
connectDB();
const app = express();
const corsOptions = {
    origin: 'https://stylgenie-bqoxnupnv-joos-projects-206a02bd.vercel.app',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  
  app.use(cors(corsOptions));
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/upload', uploadRoutes);
app.use('/chatbot', chatbotRoutes);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
