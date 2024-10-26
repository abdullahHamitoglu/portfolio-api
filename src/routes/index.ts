import { Router } from "express";
import { UsersRoutes } from "./user.route";
import { AuthRoutes } from "./auth.route";
import { ProjectRoutes } from "./project.route";
import { SkillsRouter } from "./skills.route";
import { ClientRoutes } from './client.route';
import { ContactRoutes } from './contact.route';
import { ExperienceRoute } from './experience.route';
import { OrderRoutes } from './order.route';
import { CategoryRoutes } from './category.route';
import { PagesRoute } from "./pages.route";
import { StorageRoutes } from "./storage.route";
import swaggerOptions from "../controllers/swagger.controller";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const router: Router = Router();

const swaggerDocs = swaggerJSDoc(swaggerOptions);


router.use('', UsersRoutes);
router.use('/auth', AuthRoutes);
router.use('/projects', ProjectRoutes);
router.use('/categories', CategoryRoutes);
router.use('/skills', SkillsRouter);
router.use('/experiences', ExperienceRoute);
router.use('/clients', ClientRoutes);
router.use('/contact', ContactRoutes);
router.use('/orders', OrderRoutes);
router.use('/pages', PagesRoute);
router.use('/storage', StorageRoutes);
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
    swaggerOptions: {
        url: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-bundle.js',
    }
}));


// Handle 404 errors
router.use((req, res) => (
    res.status(404).json({
        status: 404,
        message: 'Route Not Found',
        data: null,
    })
));

export const MainRouter: Router = router;
