import { connect } from "mongoose";

const mongoUri = 'mongodb://portfolio:DJK3lhoqjL9H2RiK@SG-tall-locket-7551-62424.servers.mongodirector.com:27017/portfolio';

// Connect to MongoDB
connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));