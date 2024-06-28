import { Router } from 'express';
import { getPages, getPageById, createPage, updatePage, deletePage, getPageBySlug } from '../controllers/pages.controller';
import { authenticateToken } from '../middleware/authToken';

const router = Router();

router.get('/', getPages);
router.get('/:id', getPageById);
router.get('/slug/:slug', getPageBySlug);
router.post('/', authenticateToken, createPage);
router.put('/:id', authenticateToken, updatePage);
router.delete('/:id', authenticateToken, deletePage);

export const PagesRoute = router;