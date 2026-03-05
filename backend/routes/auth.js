import express from 'express';
import {
    signup,
    login,
    getProfile,
    updateProfile,
    forgotPassword,
    resetPassword,
    searchOwners
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/owners', searchOwners); // Public — for member signup
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;
