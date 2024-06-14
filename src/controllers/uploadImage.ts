import fs from 'fs';
import { Response } from 'express';
import path from "path";

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
export const removeImages = async (req: any, res: Response, next: any) => {
    const files = req.files;
    const dir = path.join(__dirname, '../../public/uploads');
    if (!files) return next();
    for (const file of files) {
        fs.unlink(`${dir}/${file.filename}`, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }

    next();
};