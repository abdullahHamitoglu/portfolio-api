import { Request, Response, NextFunction } from 'express';
import multer, { Multer } from 'multer';
import fs from 'fs';
import path from 'path';

// Configure multer storage and file name
const storage: multer.StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, 'public/uploads');
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Create multer upload instance
const upload: Multer = multer({ storage: storage });

// Custom file upload middleware
const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Use multer upload instance
  upload.array('files', 5)(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    // Retrieve uploaded files
    const files: Express.Multer.File[] = req.files as Express.Multer.File[];
    const errors: string[] = [];

    // Validate file types and sizes
    files.forEach((file: Express.Multer.File) => {
      const allowedTypes: string[] = ['image/jpeg', 'image/png','image/svg'];
      const maxSize: number = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.mimetype)) {
        errors.push(`Invalid file type: ${file.originalname}`);
      }

      if (file.size > maxSize) {
        errors.push(`File too large: ${file.originalname}`);
      }
    });

    // Handle validation errors
    if (errors.length > 0) {
      // Remove uploaded files
      files.forEach((file: Express.Multer.File) => {
        fs.unlinkSync(file.path);
      });

      return res.status(400).json({ errors });
    }

    // Attach files to the request object
    req.files = files;

    // Proceed to the next middleware or route handler
    next();
  });
};

export default uploadMiddleware;