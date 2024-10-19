"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientsCount = exports.deleteClient = exports.updateClient = exports.getClientById = exports.getClients = exports.createClient = void 0;
const client_model_1 = __importDefault(require("../database/models/client.model"));
const createClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = new client_model_1.default(req.body);
        const newClient = yield client.save();
        res.status(201).json(newClient);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createClient = createClient;
const getClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clients = yield client_model_1.default.find();
        res.status(200).json(clients);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getClients = getClients;
const getClientById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield client_model_1.default.findById(req.params.id);
        if (client) {
            res.status(200).json(client);
        }
        else {
            res.status(404).json({ message: 'Client not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getClientById = getClientById;
const updateClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield client_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (client) {
            res.status(200).json(client);
        }
        else {
            res.status(404).json({ message: 'Client not found' });
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.updateClient = updateClient;
const deleteClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield client_model_1.default.findByIdAndDelete(req.params.id);
        if (client) {
            res.status(200).json({ message: 'Client deleted' });
        }
        else {
            res.status(404).json({ message: 'Client not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteClient = deleteClient;
const getClientsCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield client_model_1.default.countDocuments();
        res.status(200).json({ count });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getClientsCount = getClientsCount;
//# sourceMappingURL=client.controller.js.map