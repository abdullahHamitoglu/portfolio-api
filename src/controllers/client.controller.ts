import { Request, Response } from 'express';
import Client from '../database/models/Client.model';
import { IClient } from '../database/models/Client.model';

export const createClient = async (req: Request, res: Response): Promise<void> => {
    try {
        const client: IClient = new Client(req.body);
        const newClient = await client.save();
        res.status(201).json(newClient);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getClients = async (req: Request, res: Response): Promise<void> => {
    try {
        const clients = await Client.find();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getClientById = async (req: Request, res: Response): Promise<void> => {
    try {
        const client = await Client.findById(req.params.id);
        if (client) {
            res.status(200).json(client);
        } else {
            res.status(404).json({ message: 'Client not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateClient = async (req: Request, res: Response): Promise<void> => {
    try {
        const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (client) {
            res.status(200).json(client);
        } else {
            res.status(404).json({ message: 'Client not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteClient = async (req: Request, res: Response): Promise<void> => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        if (client) {
            res.status(200).json({ message: 'Client deleted' });
        } else {
            res.status(404).json({ message: 'Client not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get clients count
export const getClientsCount = async (req: Request, res: Response): Promise<void> => {
    try {
        const count = await Client.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};