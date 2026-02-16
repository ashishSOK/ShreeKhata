import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: function () {
                return !this.isDefault;
            }
        },
        name: {
            type: String,
            required: [true, 'Please provide category name'],
            trim: true
        },
        color: {
            type: String,
            default: '#6366f1'
        },
        isDefault: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Create default categories
export const defaultCategories = [
    { name: 'Grocery', color: '#10b981', isDefault: true },
    { name: 'Electricity', color: '#f59e0b', isDefault: true },
    { name: 'Rent', color: '#3b82f6', isDefault: true },
    { name: 'Salary', color: '#8b5cf6', isDefault: true },
    { name: 'Transport', color: '#ec4899', isDefault: true },
    { name: 'Maintenance', color: '#14b8a6', isDefault: true },
    { name: 'Stock Purchase', color: '#6366f1', isDefault: true },
    { name: 'Personal Expense', color: '#ef4444', isDefault: true }
];

// Index for better query performance
categorySchema.index({ user: 1, isDefault: 1 });
categorySchema.index({ isDefault: 1 });

export default mongoose.model('Category', categorySchema);
