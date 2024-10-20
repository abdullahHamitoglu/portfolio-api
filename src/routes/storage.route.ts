import { Router } from "express";
import uploadMiddleware from "../middleware/uploadMiddleware";
import { gallery, removeImages, uploadImages } from "../controllers/storage.controller";
import { authenticateToken } from "../middleware/authToken";
import { list, put } from "@vercel/blob";

const router = Router();

router.get('/', authenticateToken, gallery);
router.post('/', authenticateToken, uploadMiddleware, uploadImages);
router.delete('/:filename', authenticateToken, removeImages);
router.get('/vercel-blob', async (req, res) => {
    const response = await list();

    res.json({
        status: 'success',
        data: response,
        message: 'Vercel Blob Storage API',
    });
});
router.post('/vercel-blob', uploadMiddleware, async (req, res) => { // Apply uploadMiddleware here

    const files: Express.Multer.File[] = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
        return res.status(400).json({
            status: 'error',
            message: 'No files uploaded',
        });
    }

    const response = await put(
        'my-bucket',
        files[0].buffer,
        {
            contentType: req.body.contentType,
            access: "public"
        }
    );

    res.json({
        status: 'success',
        data: response,
        message: 'Vercel Blob Storage API',
    });
});

export const StorageRoutes = router;
