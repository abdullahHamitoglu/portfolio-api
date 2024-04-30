import { Router } from "express";
import { UsersRoutes } from "./user";
import { AuthRoutes } from "./auth";
import { ProjectRoutes } from "./project";
import { SkillsRouter } from "./skills";


const router: Router = Router();

router.use('/', UsersRoutes);
router.use('/auth', AuthRoutes);
router.use('/projects', ProjectRoutes);
router.use('/skills', SkillsRouter);

export const MainRouter: Router = router;