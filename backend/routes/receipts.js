import express from 'express';
import multer from 'multer';
import {
    uploadReceipt,
    getReceiptsByTransaction,
    deleteReceipt
} from '../controllers/receiptController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/', protect, (req, res, next) => {
    upload.array('receipts', 5)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            return res.status(400).json({ message: `Upload error: ${err.message}` });
        } else if (err) {
            // An unknown error occurred when uploading.
            return res.status(400).json({ message: err.message });
        }
        // Everything went fine.
        next();
    });
}, uploadReceipt);
router.get('/transaction/:transactionId', protect, getReceiptsByTransaction);
router.delete('/:id', protect, deleteReceipt);

export default router;
