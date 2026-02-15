import Transaction from '../models/Transaction.js';
import Receipt from '../models/Receipt.js';
import mongoose from 'mongoose';
import cloudinary from '../config/cloudinary.js';

// Helper function to calculate balance
const calculateBalance = async (userId, upToDate) => {
    const transactions = await Transaction.find({
        user: userId,
        date: { $lte: upToDate }
    }).sort({ date: 1 });

    let balance = 0;
    transactions.forEach((transaction) => {
        if (transaction.type === 'income' || transaction.type === 'credit_received') {
            balance += transaction.amount;
        } else {
            balance -= transaction.amount;
        }
    });

    return balance;
};

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req, res) => {
    try {
        const { type, date, amount, category, paymentMode, vendor, notes } = req.body;

        const transaction = await Transaction.create({
            user: req.user._id,
            type,
            date,
            amount,
            category,
            paymentMode,
            vendor,
            notes
        });

        // Calculate and update balance
        const balance = await calculateBalance(req.user._id, transaction.date);
        transaction.balance = balance;
        await transaction.save();

        // Update balances for all subsequent transactions
        const laterTransactions = await Transaction.find({
            user: req.user._id,
            date: { $gt: transaction.date }
        }).sort({ date: 1 });

        let runningBalance = balance;
        for (const laterTxn of laterTransactions) {
            if (laterTxn.type === 'income' || laterTxn.type === 'credit_received') {
                runningBalance += laterTxn.amount;
            } else {
                runningBalance -= laterTxn.amount;
            }
            laterTxn.balance = runningBalance;
            await laterTxn.save();
        }

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 50,
            startDate,
            endDate,
            category,
            paymentMode,
            vendor,
            type,
            minAmount,
            maxAmount,
            search
        } = req.query;

        // Build query
        const query = { user: req.user._id };

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        if (category) query.category = category;
        if (paymentMode) query.paymentMode = paymentMode;
        if (type) query.type = type;

        if (minAmount || maxAmount) {
            query.amount = {};
            if (minAmount) query.amount.$gte = Number(minAmount);
            if (maxAmount) query.amount.$lte = Number(maxAmount);
        }

        if (vendor) {
            query.vendor = { $regex: vendor, $options: 'i' };
        }

        if (search) {
            query.$or = [
                { vendor: { $regex: search, $options: 'i' } },
                { notes: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }

        const transactions = await Transaction.find(query)
            .sort({ date: -1, createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Transaction.countDocuments(query);

        res.json({
            transactions,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        console.error('Error in getTransactions:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
export const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        const { type, date, amount, category, paymentMode, vendor, notes } = req.body;

        transaction.type = type || transaction.type;
        transaction.date = date || transaction.date;
        transaction.amount = amount || transaction.amount;
        transaction.category = category || transaction.category;
        transaction.paymentMode = paymentMode || transaction.paymentMode;
        transaction.vendor = vendor !== undefined ? vendor : transaction.vendor;
        transaction.notes = notes !== undefined ? notes : transaction.notes;

        await transaction.save();

        // Recalculate all balances from the earliest affected date
        const earliestDate = new Date(Math.min(new Date(transaction.date), new Date(date || transaction.date)));
        const allTransactions = await Transaction.find({
            user: req.user._id,
            date: { $gte: earliestDate }
        }).sort({ date: 1 });

        let balance = await calculateBalance(req.user._id, earliestDate);

        for (const txn of allTransactions) {
            if (txn.type === 'income' || txn.type === 'credit_received') {
                balance += txn.amount;
            } else {
                balance -= txn.amount;
            }
            if (balance !== txn.balance) {
                txn.balance = balance;
                await txn.save();
            }
        }

        res.json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req, res) => {
    console.log('Attempting to delete transaction:', req.params.id);
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!transaction) {
            console.log('Transaction not found or unauthorized');
            return res.status(404).json({ message: 'Transaction not found' });
        }

        console.log('Found transaction, deleting associated receipts...');

        // Delete associated receipts
        const receipts = await Receipt.find({ transaction: transaction._id });

        // Delete from Cloudinary and DB
        const deletePromises = receipts.map(async (receipt) => {
            if (receipt.cloudinaryId) {
                try {
                    await cloudinary.uploader.destroy(receipt.cloudinaryId);
                } catch (err) {
                    console.error('Error deleting image from Cloudinary:', err);
                }
            }
            return receipt.deleteOne();
        });

        await Promise.all(deletePromises);
        console.log('Receipts deleted. Deleting transaction...');

        const transactionDate = transaction.date;
        await transaction.deleteOne();
        console.log('Transaction deleted. Recalculating balances...');

        // Recalculate balances for all subsequent transactions
        const laterTransactions = await Transaction.find({
            user: req.user._id,
            date: { $gte: transactionDate }
        }).sort({ date: 1 });

        let balance = await calculateBalance(req.user._id, transactionDate);

        for (const txn of laterTransactions) {
            if (txn.type === 'income' || txn.type === 'credit_received') {
                balance += txn.amount;
            } else {
                balance -= txn.amount;
            }
            txn.balance = balance;
            await txn.save();
        }

        console.log('Deletion complete.');
        res.json({ message: 'Transaction and associated receipts removed' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get daily summary
// @route   GET /api/transactions/summary/daily
// @access  Private
export const getDailySummary = async (req, res) => {
    try {
        const { date } = req.query;
        const targetDate = date ? new Date(date) : new Date();

        const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

        // Get opening balance (balance at end of previous day)
        const previousDay = new Date(startOfDay);
        previousDay.setDate(previousDay.getDate() - 1);
        const openingBalance = await calculateBalance(req.user._id, previousDay);

        // Get today's transactions
        const todayTransactions = await Transaction.find({
            user: req.user._id,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        let totalIncome = 0;
        let totalExpense = 0;

        todayTransactions.forEach((txn) => {
            if (txn.type === 'income' || txn.type === 'credit_received') {
                totalIncome += txn.amount;
            } else {
                totalExpense += txn.amount;
            }
        });

        const closingBalance = openingBalance + totalIncome - totalExpense;

        res.json({
            date: targetDate,
            openingBalance,
            totalIncome,
            totalExpense,
            closingBalance,
            transactionCount: todayTransactions.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
