import Transaction from '../models/Transaction.js';

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private
export const getSummary = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);

        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);

        // Today's summary
        const todayTransactions = await Transaction.find({
            user: req.user._id,
            date: { $gte: today, $lt: tomorrow }
        });

        let todayExpense = 0;
        let todayCash = 0;
        let todayOnline = 0;

        todayTransactions.forEach((txn) => {
            if (txn.type !== 'income' && txn.type !== 'credit_received') {
                todayExpense += txn.amount;
                if (txn.paymentMode === 'cash') {
                    todayCash += txn.amount;
                } else {
                    todayOnline += txn.amount;
                }
            }
        });

        // Weekly summary
        const weekTransactions = await Transaction.find({
            user: req.user._id,
            date: { $gte: weekAgo, $lt: tomorrow }
        });

        let weekExpense = 0;
        weekTransactions.forEach((txn) => {
            if (txn.type !== 'income' && txn.type !== 'credit_received') {
                weekExpense += txn.amount;
            }
        });

        // Monthly summary
        const monthTransactions = await Transaction.find({
            user: req.user._id,
            date: { $gte: monthAgo, $lt: tomorrow }
        });

        let monthExpense = 0;
        let monthCash = 0;
        let monthOnline = 0;
        let monthIncome = 0;

        monthTransactions.forEach((txn) => {
            if (txn.type === 'income' || txn.type === 'credit_received') {
                monthIncome += txn.amount;
            } else {
                monthExpense += txn.amount;
                if (txn.paymentMode === 'cash') {
                    monthCash += txn.amount;
                } else {
                    monthOnline += txn.amount;
                }
            }
        });

        res.json({
            today: {
                expense: todayExpense,
                cash: todayCash,
                online: todayOnline
            },
            week: {
                expense: weekExpense
            },
            month: {
                expense: monthExpense,
                income: monthIncome,
                cash: monthCash,
                online: monthOnline
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get spending trend (last 30 days)
// @route   GET /api/dashboard/trend
// @access  Private
export const getSpendingTrend = async (req, res) => {
    try {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - 30);

        const transactions = await Transaction.find({
            user: req.user._id,
            date: { $gte: daysAgo }
        }).sort({ date: 1 });

        // Group by date
        const trendData = {};
        transactions.forEach((txn) => {
            const dateKey = txn.date.toISOString().split('T')[0];
            if (!trendData[dateKey]) {
                trendData[dateKey] = { date: dateKey, expense: 0, income: 0 };
            }

            if (txn.type === 'income' || txn.type === 'credit_received') {
                trendData[dateKey].income += txn.amount;
            } else {
                trendData[dateKey].expense += txn.amount;
            }
        });

        const trend = Object.values(trendData);
        res.json(trend);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get category distribution
// @route   GET /api/dashboard/category-distribution
// @access  Private
export const getCategoryDistribution = async (req, res) => {
    try {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);

        const transactions = await Transaction.find({
            user: req.user._id,
            date: { $gte: monthAgo },
            type: { $in: ['expense', 'purchase'] }
        });

        // Group by category
        const categoryData = {};
        transactions.forEach((txn) => {
            if (!categoryData[txn.category]) {
                categoryData[txn.category] = 0;
            }
            categoryData[txn.category] += txn.amount;
        });

        const distribution = Object.entries(categoryData).map(([name, value]) => ({
            name,
            value
        }));

        res.json(distribution);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get monthly comparison (last 6 months)
// @route   GET /api/dashboard/monthly-comparison
// @access  Private
export const getMonthlyComparison = async (req, res) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const transactions = await Transaction.find({
            user: req.user._id,
            date: { $gte: sixMonthsAgo }
        }).sort({ date: 1 });

        // Group by month
        const monthlyData = {};
        transactions.forEach((txn) => {
            const monthKey = `${txn.date.getFullYear()}-${String(txn.date.getMonth() + 1).padStart(2, '0')}`;

            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { month: monthKey, expense: 0, income: 0 };
            }

            if (txn.type === 'income' || txn.type === 'credit_received') {
                monthlyData[monthKey].income += txn.amount;
            } else {
                monthlyData[monthKey].expense += txn.amount;
            }
        });

        const comparison = Object.values(monthlyData);
        res.json(comparison);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
