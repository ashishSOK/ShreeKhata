import Category, { defaultCategories } from '../models/Category.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
export const getCategories = async (req, res) => {
    try {
        // Get user's custom categories
        const userCategories = await Category.find({ user: req.user._id });

        // Get default categories
        const defaults = await Category.find({ isDefault: true });

        // If no default categories exist, create them
        if (defaults.length === 0) {
            await Category.insertMany(defaultCategories);
            const newDefaults = await Category.find({ isDefault: true });
            res.json([...newDefaults, ...userCategories]);
        } else {
            res.json([...defaults, ...userCategories]);
        }
    } catch (error) {
        console.error('Error in getCategories:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private
export const createCategory = async (req, res) => {
    try {
        const { name, color } = req.body;

        const category = await Category.create({
            user: req.user._id,
            name,
            color: color || '#6366f1',
            isDefault: false
        });

        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        if (category.isDefault) {
            return res.status(400).json({ message: 'Cannot edit default categories' });
        }

        category.name = req.body.name || category.name;
        category.color = req.body.color || category.color;

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        if (category.isDefault) {
            return res.status(400).json({ message: 'Cannot delete default categories' });
        }

        await category.deleteOne();
        res.json({ message: 'Category removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
