import { i18nextMiddleware, setLanguage } from './i18n';
import express from 'express';
import { MainRouter } from './routes';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

dotenv.config();

// Initialize database
import './database';
import bodyParser from 'body-parser';
import multer from 'multer';
const app = express();

const forms = multer();

// Middleware to parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS options
const corsOptions = {
  origin: '*', // You can specify specific origins if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
};
app.use(cors(corsOptions));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Initialize i18next middleware
app.use(i18nextMiddleware);
app.use(setLanguage); // Use middleware to set language based on query parameter

// Use main router
app.use('', MainRouter);

const port = process.env.PORT || 3000;

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
