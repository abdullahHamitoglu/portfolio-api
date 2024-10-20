// swagger route
import express from 'express';
const router = express.Router();
import { specs } from '../controllers/swagger.controller';
import swaggerUi from 'swagger-ui-express';

router.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);

// Define routes here

export const swaggerRoutes = router;
