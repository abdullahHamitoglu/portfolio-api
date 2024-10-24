import { i18nextMiddleware, setLanguage } from './i18n';
import express from 'express';
import { MainRouter } from './routes';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

dotenv.config();

// Initialize database
import './database';
import swaggerOptions from './controllers/swagger.controller';

const app = express();

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/swagger-ui', express.static(path.join(__dirname, 'public')));

// Swagger arayüzünü oluştururken swagger-ui-express'i kullanabilirsiniz
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, { swaggerOptions: { url: '/swagger-ui-init.js' } }));
// Middleware to parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
