import { Router } from "express";
import multer from "multer"; // multer kullanılarak dosya işlemleri yapılacak
import { gallery, removeImages, uploadImages } from "../controllers/storage.controller";
import { authenticateToken } from "../middleware/authToken";
import { list, put } from "@vercel/blob";

const router = Router();

// Memory storage ayarı, multer'ın dosyayı bellekte tutmasını sağlar
const uploadMiddleware = multer({ storage: multer.memoryStorage() }).single('file'); // Tek dosya yükleme

// Galeri rotası, token doğrulaması ile erişim
router.get('/', authenticateToken, gallery);

// Dosya yükleme rotası, token doğrulaması ve middleware
router.post('/', authenticateToken, uploadMiddleware, uploadImages);

// Dosya silme rotası, token doğrulaması ile
router.delete('/:filename', authenticateToken, removeImages);

// Vercel Blob'dan dosya listeleme
router.get('/vercel-blob', async (req, res) => {
    try {
        const response = await list(); // Blob'dan dosya listele
        res.json({
            status: 'success',
            data: response,
            message: 'Vercel Blob Storage API',
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error retrieving files from Vercel Blob',
        });
    }
});

/**
 * @swagger
 * /storage/vercel-blob:
 *   get:
 *     summary: Retrieve a list of items from Vercel Blob Storage
 *     tags:
 *       - Vercel Blob Storage
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
 */

// Dosya yükleme rotası, Vercel Blob'a dosya yükleme
router.post('/vercel-blob', uploadMiddleware, async (req, res) => { 
    try {
        const file = req.file; // Tek dosya alınıyor

        if (!file) {
            return res.status(400).json({
                status: 'error',
                message: 'No files uploaded',
            });
        }

        // Dosyanın ismini ve içeriğini Vercel Blob'a yükle
        const response = await put(file.originalname, file.buffer, {
            access: "public",
        });

        res.json({
            status: 'success',
            data: response,
            message: 'File uploaded successfully to Vercel Blob Storage',
        });

    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({
            status: 'error',
            message: 'File upload failed',
        });
    }
});

export const StorageRoutes = router;
