import express from 'express';
import './database'; // initialize database
import { MainRouter } from './routes';
import path from 'path';
import { configDotenv } from 'dotenv';

const app = express();
const port = process.env.PORT || 3000;

configDotenv();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
  // Allow specific headers including 'Authorization'
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(express.json());
app.use('/api', MainRouter);
app.use(express.static(path.resolve('./public')));

// Start server
app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
