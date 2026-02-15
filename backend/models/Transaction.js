import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        type: {
            type: String,
            enum: ['expense', 'purchase', 'income', 'credit_given', 'credit_received'],
            required: [true, 'Please specify transaction type']
        },
        date: {
            type: Date,
            required: [true, 'Please provide transaction date'],
            default: Date.now
        },
        amount: {
            type: Number,
            required: [true, 'Please provide amount'],
            min: [0, 'Amount cannot be negative']
        },
        category: {
            type: String,
            required: [true, 'Please provide category']
        },
        paymentMode: {
            type: String,
            enum: ['cash', 'upi', 'bank', 'card'],
            required: [true, 'Please select payment mode']
        },
        vendor: {
            type: String,
            trim: true
        },
        notes: {
            type: String,
            trim: true
        },
        balance: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

// Index for better query performance
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, category: 1 });
transactionSchema.index({ user: 1, vendor: 1 });

export default mongoose.model('Transaction', transactionSchema);
