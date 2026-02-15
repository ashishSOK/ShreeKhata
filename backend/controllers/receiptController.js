import Receipt from '../models/Receipt.js';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'auto',
                transformation: [
                    { quality: 'auto:good' },
                    { fetch_format: 'auto' }
                ]
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );

        const readableStream = Readable.from(buffer);
        readableStream.pipe(uploadStream);
    });
};

// @desc    Upload receipt
// @route   POST /api/receipts
// @access  Private
export const uploadReceipt = async (req, res) => {
    try {
        const { transactionId } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Please upload at least one file' });
        }

        const uploadPromises = req.files.map(async (file) => {
            const result = await uploadToCloudinary(
                file.buffer,
                `shreekhata/receipts/${req.user._id}`
            );

            return await Receipt.create({
                transaction: transactionId,
                user: req.user._id,
                imageUrl: result.secure_url,
                cloudinaryId: result.public_id,
                fileType: file.mimetype
            });
        });

        const receipts = await Promise.all(uploadPromises);

        res.status(201).json(receipts);
    } catch (error) {
        console.error('Error in uploadReceipt:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get receipts for a transaction
// @route   GET /api/receipts/transaction/:transactionId
// @access  Private
export const getReceiptsByTransaction = async (req, res) => {
    try {
        const receipts = await Receipt.find({
            transaction: req.params.transactionId,
            user: req.user._id
        }).sort({ createdAt: -1 });

        res.json(receipts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete receipt
// @route   DELETE /api/receipts/:id
// @access  Private
export const deleteReceipt = async (req, res) => {
    try {
        const receipt = await Receipt.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!receipt) {
            return res.status(404).json({ message: 'Receipt not found' });
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(receipt.cloudinaryId);

        // Delete from database
        await receipt.deleteOne();

        res.json({ message: 'Receipt removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
