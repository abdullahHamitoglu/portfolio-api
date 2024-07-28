import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serviceName = process.argv[2];

if (!serviceName) {
  console.error("Please provide a service name");
  process.exit(1);
}

const routesContent = `// ${serviceName} route
import express from 'express';
const router = express.Router();
import ${serviceName}Controller from '../controllers/${serviceName}.controller';

// Define routes here

export const ${serviceName}Routes = router;
`;

const controllerContent = `// ${serviceName} controller
import ${serviceName}Model from '../database/models/${serviceName}.model';

// Define controller methods here

export default {};
`;

const modelContent = `// ${serviceName} model
import mongoose from 'mongoose';

type ${
  serviceName.slice(0, 1).toUpperCase() +
  serviceName.slice(1, serviceName.length)
} = {
  // Define model properties here
};
const ${serviceName}Schema = new mongoose.Schema({
  // Define schema here
});

const ${serviceName} = mongoose.model('${serviceName}', ${serviceName}Schema);

export default ${serviceName};
`;

const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

const routesPath = path.join(__dirname, "routes", `${serviceName}.route.ts`);
const controllerPath = path.join(
  __dirname,
  "controllers",
  `${serviceName}.controller.ts`
);
const modelPath = path.join(
  __dirname,
  "database",
  "models",
  `${serviceName}.model.ts`
);

ensureDirectoryExistence(routesPath);
ensureDirectoryExistence(controllerPath);
ensureDirectoryExistence(modelPath);

fs.writeFileSync(routesPath, routesContent);
fs.writeFileSync(controllerPath, controllerContent);
fs.writeFileSync(modelPath, modelContent);

console.log(`Service ${serviceName} created successfully!`);
