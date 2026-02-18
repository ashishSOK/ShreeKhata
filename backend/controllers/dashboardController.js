import Transaction from '../models/Transaction.js';

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private
export const getSummary = async (req, res) => {
    try {
        // Use client provided date if available, otherwise server time
        const today = req.query.date ? new Date(req.query.date) : new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);

        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);

        const userId = req.user._id;

        // Run all queries in parallel
        const [todayStats, weekStats, monthStats] = await Promise.all([
            // Today's stats
            Transaction.aggregate([
                {
                    $match: {
                        user: userId,
                        date: { $gte: today, $lt: tomorrow },
                        type: { $in: ['expense', 'purchase'] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        expense: { $sum: '$amount' },
                        cash: {
                            $sum: {
                                $cond: [{ $eq: ['$paymentMode', 'cash'] }, '$amount', 0]
                            }
                        },
                        online: {
                            $sum: {
                                $cond: [{ $ne: ['$paymentMode', 'cash'] }, '$amount', 0]
                            }
                        }
                    }
                }
            ]),

            // Weekly stats
            Transaction.aggregate([
                {
                    $match: {
                        user: userId,
                        date: { $gte: weekAgo, $lt: tomorrow },
                        type: { $in: ['expense', 'purchase'] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        expense: { $sum: '$amount' }
                    }
                }
            ]),

            // Monthly stats
            Transaction.aggregate([
                {
                    $match: {
                        user: userId,
                        date: { $gte: monthAgo, $lt: tomorrow }
                    }
                },
                {
                    $group: {
                        _id: null,
                        expense: {
                            $sum: {
                                $cond: [
                                    { $in: ['$type', ['expense', 'purchase']] },
                                    '$amount',
                                    0
                                ]
                            }
                        },
                        income: {
                            $sum: {
                                $cond: [
                                    { $in: ['$type', ['income', 'credit_received']] },
                                    '$amount',
                                    0
                                ]
                            }
                        },
                        cash: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $in: ['$type', ['expense', 'purchase']] },
                                            { $eq: ['$paymentMode', 'cash'] }
                                        ]
                                    },
                                    '$amount',
                                    0
                                ]
                            }
                        },
                        online: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $in: ['$type', ['expense', 'purchase']] },
                                            { $ne: ['$paymentMode', 'cash'] }
                                        ]
                                    },
                                    '$amount',
                                    0
                                ]
                            }
                        }
                    }
                }
            ])
        ]);

        // Net Balance (All time)
        const netBalanceStats = await Transaction.aggregate([
            {
                $match: {
                    user: userId
                }
            },
            {
                $group: {
                    _id: null,
                    totalIncome: {
                        $sum: {
                            $cond: [
                                { $in: ['$type', ['income', 'credit_received']] },
                                '$amount',
                                0
                            ]
                        }
                    },
                    totalExpense: {
                        $sum: {
                            $cond: [
                                { $in: ['$type', ['expense', 'purchase']] },
                                '$amount',
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        const netBalance = netBalanceStats.length > 0
            ? netBalanceStats[0].totalIncome - netBalanceStats[0].totalExpense
            : 0;

        res.json({
            netBalance,
            today: {
                expense: todayStats[0]?.expense || 0,
                cash: todayStats[0]?.cash || 0,
                online: todayStats[0]?.online || 0
            },
            week: {
                expense: weekStats[0]?.expense || 0
            },
            month: {
                expense: monthStats[0]?.expense || 0,
                income: monthStats[0]?.income || 0,
                cash: monthStats[0]?.cash || 0,
                online: monthStats[0]?.online || 0
            }
        });
    } catch (error) {
        console.error('Error in getSummary:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get spending trend (last 30 days)
// @route   GET /api/dashboard/trend
// @access  Private
// @desc    Get spending trend (last 30 days)
// @route   GET /api/dashboard/trend
// @access  Private
export const getSpendingTrend = async (req, res) => {
    try {
        const daysAgo = req.query.date ? new Date(req.query.date) : new Date();
        daysAgo.setDate(daysAgo.getDate() - 30);
        daysAgo.setHours(0, 0, 0, 0);

        const trend = await Transaction.aggregate([
            {
                $match: {
                    user: req.user._id,
                    date: { $gte: daysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$date' }
                    },
                    expense: {
                        $sum: {
                            $cond: [
                                { $in: ['$type', ['expense', 'purchase']] },
                                '$amount',
                                0
                            ]
                        }
                    },
                    income: {
                        $sum: {
                            $cond: [
                                { $in: ['$type', ['income', 'credit_received']] },
                                '$amount',
                                0
                            ]
                        }
                    }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    date: '$_id',
                    expense: 1,
                    income: 1,
                    _id: 0
                }
            }
        ]);

        res.json(trend);
    } catch (error) {
        console.error('Error in getSpendingTrend:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get category distribution
// @route   GET /api/dashboard/category-distribution
// @access  Private
// @desc    Get category distribution
// @route   GET /api/dashboard/category-distribution
// @access  Private
export const getCategoryDistribution = async (req, res) => {
    try {
        const monthAgo = req.query.date ? new Date(req.query.date) : new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);

        const distribution = await Transaction.aggregate([
            {
                $match: {
                    user: req.user._id,
                    date: { $gte: monthAgo },
                    type: { $in: ['expense', 'purchase'] }
                }
            },
            {
                $group: {
                    _id: '$category',
                    value: { $sum: '$amount' }
                }
            },
            {
                $project: {
                    name: '$_id',
                    value: 1,
                    _id: 0
                }
            }
        ]);

        res.json(distribution);
    } catch (error) {
        console.error('Error in getCategoryDistribution:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get monthly comparison (last 6 months)
// @route   GET /api/dashboard/monthly-comparison
// @access  Private
// @desc    Get monthly comparison (last 6 months)
// @route   GET /api/dashboard/monthly-comparison
// @access  Private
export const getMonthlyComparison = async (req, res) => {
    try {
        const sixMonthsAgo = req.query.date ? new Date(req.query.date) : new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        sixMonthsAgo.setDate(1); // Start from first day
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const comparison = await Transaction.aggregate([
            {
                $match: {
                    user: req.user._id,
                    date: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$date' },
                        year: { $year: '$date' }
                    },
                    expense: {
                        $sum: {
                            $cond: [
                                { $in: ['$type', ['expense', 'purchase']] },
                                '$amount',
                                0
                            ]
                        }
                    },
                    income: {
                        $sum: {
                            $cond: [
                                { $in: ['$type', ['income', 'credit_received']] },
                                '$amount',
                                0
                            ]
                        }
                    }
                }
            },
            {
                $sort: {
                    '_id.year': 1,
                    '_id.month': 1
                }
            },
            {
                $project: {
                    month: {
                        $concat: [
                            { $toString: '$_id.year' },
                            '-',
                            {
                                $cond: {
                                    if: { $lt: ['$_id.month', 10] },
                                    then: { $concat: ['0', { $toString: '$_id.month' }] },
                                    else: { $toString: '$_id.month' }
                                }
                            }
                        ]
                    },
                    expense: 1,
                    income: 1,
                    _id: 0
                }
            }
        ]);

        res.json(comparison);
    } catch (error) {
        console.error('Error in getMonthlyComparison:', error);
        res.status(500).json({ message: error.message });
    }
};
