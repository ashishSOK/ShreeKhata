import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    getMembers,
    approveMember,
    rejectMember,
    getMemberStats,
    getPendingCount
} from '../controllers/membersController.js';

const router = express.Router();

router.use(protect); // All member routes require auth

router.get('/', getMembers);
router.get('/pending-count', getPendingCount);
router.get('/:memberId/stats', getMemberStats);
router.put('/:memberId/approve', approveMember);
router.put('/:memberId/reject', rejectMember);

export default router;
