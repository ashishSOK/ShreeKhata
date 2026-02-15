import express from 'express';
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(protect, getCategories)
    .post(protect, createCategory);

router.route('/:id')
    .put(protect, updateCategory)
    .delete(protect, deleteCategory);

export default router;
