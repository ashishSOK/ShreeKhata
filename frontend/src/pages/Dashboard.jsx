import { useState, useEffect, memo } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Skeleton,
    useTheme,
} from '@mui/material';
import {
    TrendingUp,
    TrendingDown,
    AccountBalance,
    CreditCard,
} from '@mui/icons-material';
import { LineChart, Line, PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { dashboardAPI } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { motion } from 'framer-motion';
import PageLoader from '../components/common/PageLoader';

const StatCard = memo(({ title, value, icon, color, trend, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 30, rotateX: -15 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{
            duration: 0.6,
            delay,
            type: 'spring',
            stiffness: 100
        }}
        style={{ height: '100%' }}
    >
        <Card
            sx={{
                height: '100%',
                background: `linear-gradient(135deg, ${color}20 0%, ${color}08 100%)`,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${color}40`,
                borderRadius: 3,
                transformStyle: 'preserve-3d',
                transform: 'perspective(1000px) rotateX(2deg) rotateY(2deg) translateZ(10px)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px ${color}30`,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `radial-gradient(circle at top right, ${color}15, transparent 70%)`,
                    pointerEvents: 'none',
                },
                '&:hover': {
                    transform: 'perspective(1000px) rotateX(-5deg) rotateY(-5deg) translateZ(30px) scale(1.02)',
                    boxShadow: `0 20px 60px rgba(0, 0, 0, 0.4), 0 8px 24px ${color}50`,
                    border: `1px solid ${color}60`,
                },
            }}
        >
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                    >
                        <Box
                            sx={{
                                bgcolor: `${color}25`,
                                borderRadius: 2.5,
                                p: 1.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 4px 16px ${color}40`,
                                border: `1px solid ${color}30`,
                            }}
                        >
                            {icon}
                        </Box>
                    </motion.div>
                    {trend && (
                        <motion.div
                            animate={{
                                y: [0, -3, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', color }}>
                                {trend > 0 ? <TrendingUp /> : <TrendingDown />}
                            </Box>
                        </motion.div>
                    )}
                </Box>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        mb: 0.5,
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                        background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    {value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {title}
                </Typography>
            </CardContent>
        </Card>
    </motion.div>
));

const CardSkeleton = () => (
    <Card
        sx={{
            height: '100%',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            p: 3
        }}
    >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Skeleton variant="rounded" width={50} height={50} sx={{ borderRadius: 2.5 }} />
            <Skeleton variant="circular" width={24} height={24} />
        </Box>
        <Skeleton variant="text" width="60%" height={50} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="40%" height={24} />
    </Card>
);

const ChartSkeleton = ({ height = 300 }) => (
    <Card
        sx={{
            height: '100%',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            p: 3
        }}
    >
        <Skeleton variant="text" width="40%" height={32} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" width="100%" height={height} sx={{ borderRadius: 2 }} />
    </Card>
);

const Dashboard = () => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState(null);
    const [trend, setTrend] = useState([]);
    const [categoryDist, setCategoryDist] = useState([]);
    const [monthlyComp, setMonthlyComp] = useState([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            // Artificial delay to prevent flash if response is too fast
            const [summaryRes, trendRes, catDistRes, monthlyRes] = await Promise.all([
                dashboardAPI.getSummary(),
                dashboardAPI.getTrend(),
                dashboardAPI.getCategoryDistribution(),
                dashboardAPI.getMonthlyComparison()
            ]);

            setSummary(summaryRes.data);
            setTrend(trendRes.data);
            setCategoryDist(catDistRes.data);
            setMonthlyComp(monthlyRes.data);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6'];

    if (loading) {
        return <PageLoader message="Loading Dashboard..." />;
    }

    return (
        <Box>
            <Typography
                variant="h4"
                sx={{
                    mb: { xs: 2, md: 3 },
                    fontWeight: 700,
                    fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' }
                }}
            >
                Dashboard
            </Typography>

            {/* Summary Cards */}
            <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="Today's Expense"
                        value={formatCurrency(summary?.today?.expense || 0)}
                        icon={<TrendingDown sx={{ color: '#ef4444' }} />}
                        color="#ef4444"
                        delay={0}
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="Weekly Expense"
                        value={formatCurrency(summary?.week?.expense || 0)}
                        icon={<TrendingDown sx={{ color: '#f59e0b' }} />}
                        color="#f59e0b"
                        delay={0.1}
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="Monthly Expense"
                        value={formatCurrency(summary?.month?.expense || 0)}
                        icon={<TrendingDown sx={{ color: '#ec4899' }} />}
                        color="#ec4899"
                        delay={0.2}
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="Monthly Income"
                        value={formatCurrency(summary?.month?.income || 0)}
                        icon={<TrendingUp sx={{ color: '#10b981' }} />}
                        color="#10b981"
                        delay={0.3}
                    />
                </Grid>
            </Grid>

            {/* Charts */}
            <Grid container spacing={{ xs: 2, md: 3 }}>
                {/* Spending Trend */}
                <Grid item xs={12} lg={8}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        style={{ height: '100%' }}
                    >
                        <Card
                            sx={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: 3,
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                                height: '100%',
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mb: 3,
                                        fontWeight: 700,
                                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    }}
                                >
                                    📈 Spending Trend (Last 30 Days)
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={trend}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" />
                                        <XAxis
                                            dataKey="date"
                                            stroke={theme.palette.text.secondary}
                                            style={{ fontSize: 12 }}
                                        />
                                        <YAxis
                                            stroke={theme.palette.text.secondary}
                                            style={{ fontSize: 12 }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                backdropFilter: 'blur(20px)',
                                                border: '1px solid rgba(99, 102, 241, 0.3)',
                                                borderRadius: 12,
                                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                                            }}
                                        />
                                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                        <Line
                                            type="monotone"
                                            dataKey="expense"
                                            stroke="#ef4444"
                                            strokeWidth={3}
                                            dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 6, strokeWidth: 0 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="income"
                                            stroke="#10b981"
                                            strokeWidth={3}
                                            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 6, strokeWidth: 0 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>

                {/* Category Distribution */}
                <Grid item xs={12} lg={4}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        style={{ height: '100%' }}
                    >
                        <Card
                            sx={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: 3,
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                                height: '100%',
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mb: 3,
                                        fontWeight: 700,
                                        background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    }}
                                >
                                    🎯 Category Distribution
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={categoryDist}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                                const RADIAN = Math.PI / 180;
                                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                                return percent > 0.05 ? (
                                                    <text
                                                        x={x}
                                                        y={y}
                                                        fill="white"
                                                        textAnchor="middle"
                                                        dominantBaseline="central"
                                                        fontSize={14}
                                                        fontWeight="bold"
                                                        style={{ filter: 'drop-shadow(0px 0px 2px rgba(0,0,0,0.5))' }}
                                                    >
                                                        {`${(percent * 100).toFixed(0)}%`}
                                                    </text>
                                                ) : null;
                                            }}
                                            outerRadius={85}
                                            innerRadius={40}
                                            fill="#8884d8"
                                            dataKey="value"
                                            paddingAngle={2}
                                        >
                                            {categoryDist.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                backdropFilter: 'blur(20px)',
                                                border: '1px solid rgba(99, 102, 241, 0.3)',
                                                borderRadius: 12,
                                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                                            }}
                                            formatter={(value) => formatCurrency(value)}
                                        />
                                        <Legend
                                            iconType="circle"
                                            layout="horizontal"
                                            verticalAlign="bottom"
                                            align="center"
                                            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>

                {/* Monthly Comparison */}
                <Grid item xs={12}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <Card
                            sx={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: 3,
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mb: 3,
                                        fontWeight: 700,
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    }}
                                >
                                    📊 Monthly Comparison (Last 6 Months)
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={monthlyComp}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" />
                                        <XAxis
                                            dataKey="month"
                                            stroke={theme.palette.text.secondary}
                                            style={{ fontSize: 12 }}
                                        />
                                        <YAxis
                                            stroke={theme.palette.text.secondary}
                                            style={{ fontSize: 12 }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                backdropFilter: 'blur(20px)',
                                                border: '1px solid rgba(99, 102, 241, 0.3)',
                                                borderRadius: 12,
                                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                                            }}
                                        />
                                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                        <Bar
                                            dataKey="expense"
                                            fill="#ef4444"
                                            radius={[8, 8, 0, 0]}
                                        />
                                        <Bar
                                            dataKey="income"
                                            fill="#10b981"
                                            radius={[8, 8, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>

                {/* Cash vs Online */}
                <Grid item xs={12} md={6}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                        style={{ height: '100%' }}
                    >
                        <Card
                            sx={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: 3,
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                                height: '100%',
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mb: 3,
                                        fontWeight: 700,
                                        background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    }}
                                >
                                    💳 Payment Mode (This Month)
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={6}>
                                        <motion.div
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                        >
                                            <Box
                                                sx={{
                                                    textAlign: 'center',
                                                    p: 3,
                                                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.05) 100%)',
                                                    border: '1px solid rgba(99, 102, 241, 0.3)',
                                                    borderRadius: 3,
                                                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.2)',
                                                    transition: 'all 0.3s ease',
                                                }}
                                            >
                                                <AccountBalance sx={{ fontSize: 56, color: '#6366f1', mb: 1.5 }} />
                                                <Typography
                                                    variant="h4"
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: '#6366f1',
                                                        mb: 0.5,
                                                    }}
                                                >
                                                    {formatCurrency(summary?.month?.cash || 0)}
                                                </Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                                    Cash
                                                </Typography>
                                            </Box>
                                        </motion.div>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <motion.div
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                        >
                                            <Box
                                                sx={{
                                                    textAlign: 'center',
                                                    p: 3,
                                                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)',
                                                    border: '1px solid rgba(139, 92, 246, 0.3)',
                                                    borderRadius: 3,
                                                    boxShadow: '0 4px 16px rgba(139, 92, 246, 0.2)',
                                                    transition: 'all 0.3s ease',
                                                }}
                                            >
                                                <CreditCard sx={{ fontSize: 56, color: '#8b5cf6', mb: 1.5 }} />
                                                <Typography
                                                    variant="h4"
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: '#8b5cf6',
                                                        mb: 0.5,
                                                    }}
                                                >
                                                    {formatCurrency(summary?.month?.online || 0)}
                                                </Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                                    Online
                                                </Typography>
                                            </Box>
                                        </motion.div>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
