import express from 'express';
import {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getDailySummary
} from '../controllers/transactionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(protect, getTransactions)
    .post(protect, createTransaction);

router.get('/summary/daily', protect, getDailySummary);

router.route('/:id')
    .get(protect, getTransactionById)
    .put(protect, updateTransaction)
    .delete(protect, deleteTransaction);

export default router;
