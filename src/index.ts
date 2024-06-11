import fs from 'fs';
import express from 'express';
import { MainRouter } from './routes';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

dotenv.config();

// Initialize database
import './database';
import uploadMiddleware from './middleware/uploadMiddleware';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS options
const corsOptions = {
  origin: '*', // You can specify specific origins if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
};
app.use(cors(corsOptions));

app.use('', MainRouter);

const port = process.env.PORT || 3000;

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});