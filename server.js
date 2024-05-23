// backend/server.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import roundRobinRoutes from './routes/roundRobinRoutes.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGO_URI || 'your-mongodb-uri';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/round-robin', roundRobinRoutes);

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
