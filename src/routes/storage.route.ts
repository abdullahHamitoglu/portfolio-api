import { Router } from "express";
import uploadMiddleware from "../middleware/uploadMiddleware";
import { gallery, removeImages, uploadImages } from "../controllers/storage.controller";
import { authenticateToken } from "../middleware/authToken";

const router = Router();

router.get('/', authenticateToken, gallery);
router.post('/', authenticateToken, uploadMiddleware, uploadImages);
router.delete('/:filename', authenticateToken, removeImages);

export const StorageRoutes = router;
