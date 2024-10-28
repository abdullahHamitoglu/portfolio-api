import { connect, connection } from "mongoose";

const mongoUri = process.env.MONGODB_URI as string;

// Connect to MongoDB
connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
    console.log(`Database Name: ${connection.name}`);
  })
  .catch(err => console.error(err));