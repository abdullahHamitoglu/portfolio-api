import express from 'express';
import { MainRouter } from './routes';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

import './database'; // initialize database

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS'); // Allow specified methods
  // Allow specific headers including 'Authorization'
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(express.json());
app.use('/api', MainRouter);
app.use(express.static(path.resolve('./public')));

app.use('/', (req, res) => {
  res.sendFile(path.resolve('./public/index.html'));
});
const port = process.env.PORT || 3000;
// Start server
app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
