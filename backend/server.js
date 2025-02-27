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
app.use(cors({
    origin: 'https://stylgenie-ovgfzfbd1-joos-projects-206a02bd.vercel.app', // Allow the frontend to make requests
    credentials: true,
  }));
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/upload', uploadRoutes);
app.use('/chatbot', chatbotRoutes);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
