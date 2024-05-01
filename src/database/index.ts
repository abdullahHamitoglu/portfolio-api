import { connect } from "mongoose";

const mongoUri = process.env.MONGODB_URI as string;

// Connect to MongoDB
connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));