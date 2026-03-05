import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import mongoose from 'mongoose';

// Helper: verify requester is an owner
const requireOwner = (req, res) => {
    if (req.user.role !== 'owner') {
        res.status(403).json({ message: 'Only owners can perform this action' });
        return false;
    }
    return true;
};

// @desc    Get all members for the current owner
// @route   GET /api/members
// @access  Private (owner only)
export const getMembers = async (req, res) => {
    try {
        if (!requireOwner(req, res)) return;

        const members = await User.find({ ownerId: req.user._id })
            .select('name email phone membershipStatus createdAt')
            .sort({ createdAt: -1 });

        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve a member request
// @route   PUT /api/members/:memberId/approve
// @access  Private (owner only)
export const approveMember = async (req, res) => {
    try {
        if (!requireOwner(req, res)) return;

        const member = await User.findOne({
            _id: req.params.memberId,
            ownerId: req.user._id,
            role: 'member'
        });

        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        member.membershipStatus = 'approved';
        await member.save();

        res.json({
            message: 'Member approved', member: {
                _id: member._id,
                name: member.name,
                email: member.email,
                membershipStatus: member.membershipStatus
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reject a member request
// @route   PUT /api/members/:memberId/reject
// @access  Private (owner only)
export const rejectMember = async (req, res) => {
    try {
        if (!requireOwner(req, res)) return;

        const member = await User.findOne({
            _id: req.params.memberId,
            ownerId: req.user._id,
            role: 'member'
        });

        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        member.membershipStatus = 'rejected';
        await member.save();

        res.json({
            message: 'Member rejected', member: {
                _id: member._id,
                name: member.name,
                email: member.email,
                membershipStatus: member.membershipStatus
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get stats for a specific member
// @route   GET /api/members/:memberId/stats
// @access  Private (owner only)
export const getMemberStats = async (req, res) => {
    try {
        if (!requireOwner(req, res)) return;

        const member = await User.findOne({
            _id: req.params.memberId,
            ownerId: req.user._id,
            role: 'member'
        }).select('name email membershipStatus createdAt');

        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        const stats = await Transaction.aggregate([
            {
                $match: {
                    user: req.user._id,
                    addedBy: new mongoose.Types.ObjectId(req.params.memberId)
                }
            },
            {
                $group: {
                    _id: null,
                    totalTransactions: { $sum: 1 },
                    totalIncome: {
                        $sum: {
                            $cond: [{ $in: ['$type', ['income', 'credit_received']] }, '$amount', 0]
                        }
                    },
                    totalExpense: {
                        $sum: {
                            $cond: [{ $in: ['$type', ['expense', 'purchase']] }, '$amount', 0]
                        }
                    },
                    lastActivity: { $max: '$date' }
                }
            }
        ]);

        res.json({
            member,
            stats: stats[0] || {
                totalTransactions: 0,
                totalIncome: 0,
                totalExpense: 0,
                lastActivity: null
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get pending member count for owner
// @route   GET /api/members/pending-count
// @access  Private (owner only)
export const getPendingCount = async (req, res) => {
    try {
        if (req.user.role !== 'owner') {
            return res.json({ count: 0 });
        }
        const count = await User.countDocuments({ ownerId: req.user._id, membershipStatus: 'pending' });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
