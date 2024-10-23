import { Router } from "express";
import multer from "multer"; // File operations will be performed using multer
import { gallery, getVercelBlob, removeImages, removeVercelBlob, uploadImages, uploadVercelBlob } from "../controllers/storage.controller";
import { authenticateToken } from "../middleware/authToken";

const router = Router();

// Memory storage setting, allows multer to keep the file in memory
const uploadMiddleware = multer({ storage: multer.memoryStorage() }).single('file'); // Single file upload

// Gallery route, accessible with token authentication
router.get('/', authenticateToken, gallery);

// File upload route, with token authentication and middleware
router.post('/', authenticateToken, uploadMiddleware, uploadImages);

// File delete route, accessible with token authentication
router.delete('/:filename', authenticateToken, removeImages);

// File upload route, uploading files to Vercel Blob
router.post('/vercel-blob', authenticateToken, uploadMiddleware, uploadVercelBlob);

// Listing files from Vercel Blob
router.get('/vercel-blob', authenticateToken, getVercelBlob);

// delete file from vercel Blob
router.delete('/vercel-blob/:file', authenticateToken, removeVercelBlob);


/**
 * @swagger
 * /storage/vercel-blob:
 *   get:
 *     summary: Retrieve a list of items from Vercel Blob Storage
 *     tags:
 *       - Vercel Blob Storage
 *     security:
 *      - Bearer: []
 *     responses:
 *       200:
 *         description: A list of items from Vercel Blob Storage
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 message:
 *                   type: string
 *                   example: Vercel Blob Storage API
 * 
 *   post:
 *     summary: Upload a file to Vercel Blob Storage
 *     tags:
 *       - Vercel Blob Storage
 *     security:
 *      - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               contentType:
 *                 type: string
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *                   example: Vercel Blob Storage API
 *       400:
 *         description: No files uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: No files uploaded
 *   delete:
 *     summary: Delete a file from Vercel Blob Storage
 *     tags:
 *       - Vercel Blob Storage
 *     security:
 *      - Bearer: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the file to delete
 *     responses:
 *       200:
 *         description: File deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: File deleted successfully
 *       404:
 *         description: File not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: File not found
 */



export const StorageRoutes = router;
