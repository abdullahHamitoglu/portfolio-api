import fs from 'fs';
import { Router } from "express";
import { UsersRoutes } from "./user";
import { AuthRoutes } from "./auth";
import { ProjectRoutes } from "./project";
import { SkillsRouter } from "./skills";
import express from 'express';
import path from 'path';
import uploadMiddleware from '../middleware/uploadMiddleware';
import { uploadImages } from '../controllers/uploadImage';

const router: Router = Router();

router.use('', UsersRoutes);
router.use('/auth', AuthRoutes);
router.use('/projects', ProjectRoutes);
router.use('/skills', SkillsRouter);
router.post('/upload', uploadMiddleware, uploadImages);
// Serve static files
router.use(express.static(path.resolve(__dirname, '../../public')));

// Handle 404 errors
router.use((req, res) => (
    res.status(404).json({
        status: 404,
        message: 'Route Not Found',
        data: null,
    })

));

export const MainRouter: Router = router;