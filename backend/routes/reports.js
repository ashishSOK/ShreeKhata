import express from 'express';
import {
    getMonthlyReport,
    getVendorReport,
    getCategoryReport,
    exportToPDF,
    exportToExcel
} from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/monthly', protect, getMonthlyReport);
router.get('/vendor', protect, getVendorReport);
router.get('/category', protect, getCategoryReport);
router.get('/export/pdf', protect, exportToPDF);
router.get('/export/excel', protect, exportToExcel);

export default router;
