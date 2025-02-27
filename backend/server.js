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
    origin: (origin, callback) => {
      // Allow localhost and any Vercel preview/production URL
      if (!origin || 
          origin === 'http://localhost:3000' || 
          origin.endsWith('-joos-projects-206a02bd.vercel.app') || 
          origin === 'https://stylgenie-bqoxnupnv-joos-projects-206a02bd.vercel.app'|| 
          origin === 'https://stylgenie.vercel.app') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
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
