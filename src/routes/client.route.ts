import { Router } from 'express';
import { createClient, getClients, getClientById, updateClient, deleteClient,getClientsCount } from '../controllers/client.controller';
import { authenticateToken } from '../middleware/authToken';

const router = Router();

router.post('/', authenticateToken, createClient);
router.get('/', authenticateToken, getClients);
router.get('/:id', authenticateToken, getClientById);
router.put('/:id', authenticateToken, updateClient);
router.delete('/:id', authenticateToken, deleteClient);
router.delete('/count', getClientsCount);

export const ClientRoutes = router;