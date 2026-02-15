import express from 'express';
import {
    getSummary,
    getSpendingTrend,
    getCategoryDistribution,
    getMonthlyComparison
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/summary', protect, getSummary);
router.get('/trend', protect, getSpendingTrend);
router.get('/category-distribution', protect, getCategoryDistribution);
router.get('/monthly-comparison', protect, getMonthlyComparison);

export default router;
