"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRoutes = void 0;
const express_1 = require("express");
const client_controller_1 = require("../controllers/client.controller");
const authToken_1 = require("../middleware/authToken");
const router = (0, express_1.Router)();
router.post('/', authToken_1.authenticateToken, client_controller_1.createClient);
router.get('/', authToken_1.authenticateToken, client_controller_1.getClients);
router.get('/:id', authToken_1.authenticateToken, client_controller_1.getClientById);
router.put('/:id', authToken_1.authenticateToken, client_controller_1.updateClient);
router.delete('/:id', authToken_1.authenticateToken, client_controller_1.deleteClient);
router.delete('/count', client_controller_1.getClientsCount);
exports.ClientRoutes = router;
//# sourceMappingURL=client.route.js.map