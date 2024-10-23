import fs from 'fs';
import { Request, Response } from 'express';
import path from "path";
import { list, put } from '@vercel/blob';
import { del } from '@vercel/blob';

// ** ===================  UPLOAD MULTIPLE IMAGES  ===================
export const uploadImages = async (req: any, res: Response) => {
    // Handle the uploaded files
    const files: Express.Multer.File[] = req.files as Express.Multer.File[];

    // Process and store the files as required
    // For example, save the files to a specific directory using fs module
    files.forEach((file: Express.Multer.File) => {
        const filePath = `public/uploads/${file.filename}`;
        fs.rename(file.path, filePath, (err) => {
            if (err) {
                // Handle error appropriately and send an error response
                return res.status(500).json({ error: 'Failed to store the file' });
            }
        });
    });
    const uploadedFiles = files.map((file: Express.Multer.File) => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
    // Send an appropriate response to the client
    res.status(200).json({
        message: 'File upload successful',
        files: uploadedFiles,
        status: 200,
    });
};

// remove images and background from /uploads 
export const removeImages = async (req: any, res: Response) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../public/uploads', filename);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ error: 'File not found' });
        }

        fs.unlink(filePath, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Unable to delete file' });
            }

            res.json({ message: 'File deleted successfully' });
        });
    });
};

// API endpoint to list all images in /public/uploads
export const gallery = async (req: Request, res: Response) => {
    const uploadsDir = path.join(__dirname, '../../public/uploads');
    // find image is not used in projects 

    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            console.log(err);

            return res.status(500).json({ error: 'Unable to scan directory' });
        }

        const images = files.filter(file => {
            return `${/\.(jpg|jpeg|png|gif|webp|svg)$/.test(file)}`;
        });

        res.json(images.map((image) => (
            `${req.protocol}://${req.get('host')}/uploads/${image}`
        )));
    });
}

// upload with vercel blob 
export const uploadVercelBlob = async (req: Request, res: Response) => {
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
}

export const getVercelBlob = async (req: Request, res: Response) => {
    try {
        const response = await list(); // List files from Blob
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
}

export const removeVercelBlob = async (req: Request, res: Response) => {
    try {
        const { file } = req.body;
        
        if (!file) {
            return res.status(400).json({
                status: 'error',
                message: 'Filename is required',
            });
        }

        // Delete the file from Vercel Blob
        await del(file.url);

        res.json({
            status: 'success',
            message: 'File deleted successfully from Vercel Blob Storage',
        });

    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({
            status: 'error',
            message: 'File deletion failed',
        });
    }
}