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
router.use((req, res) => {
    res.status(404).send('Not found');
});

export const MainRouter: Router = router;