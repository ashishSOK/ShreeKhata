import mongoose from 'mongoose';

const receiptSchema = new mongoose.Schema(
    {
        transaction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction',
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        imageUrl: {
            type: String,
            required: true
        },
        cloudinaryId: {
            type: String,
            required: true
        },
        fileType: {
            type: String,
            enum: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Receipt', receiptSchema);
