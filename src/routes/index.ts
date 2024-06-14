import fs from 'fs';
import { Router } from "express";
import { UsersRoutes } from "./user.route";
import { AuthRoutes } from "./auth.route";
import { ProjectRoutes } from "./project.route";
import { SkillsRouter } from "./skills.route";
import express from 'express';
import path from 'path';
import uploadMiddleware from '../middleware/uploadMiddleware';
import { uploadImages } from '../controllers/uploadImage';
import { ClientRoutes } from './client.route';
import { ContactRoutes } from './contact.route';
import { ExperienceRoute } from './experience.route';
import { OrderRoutes } from './order.route';

const router: Router = Router();

router.use('', UsersRoutes);
router.use('/auth', AuthRoutes);
router.use('/projects', ProjectRoutes);
router.use('/skills', SkillsRouter);
router.use('/experiences', ExperienceRoute);
router.use('/clients', ClientRoutes);
router.use('/contact', ContactRoutes);
router.post('/upload', uploadMiddleware, uploadImages);
router.use('/orders', OrderRoutes); // Use order routes

// Serve static files

// Handle 404 errors
router.use((req, res) => (
    res.status(404).json({
        status: 404,
        message: 'Route Not Found',
        data: null,
    })

));

export const MainRouter: Router = router;