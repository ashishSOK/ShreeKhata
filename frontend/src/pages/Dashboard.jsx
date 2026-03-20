import { useState, useEffect, memo } from 'react';
import {
    Box, Grid, Card, CardContent, Typography,
    useTheme, useMediaQuery,
} from '@mui/material';
import {
    TrendingUp, TrendingDown, AccountBalance,
    LocalAtm, PhoneIphone, Home,
} from '@mui/icons-material';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer,
} from 'recharts';
import { dashboardAPI } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { motion } from 'framer-motion';
import PageLoader from '../components/common/PageLoader';

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = memo(({ title, value, icon, color, delay, isDark }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay, type: 'spring', stiffness: 130 }}
        style={{ height: '100%' }}
    >
        <Card sx={{
            height: '100%',
            background: isDark
                ? `linear-gradient(145deg, ${color}1a 0%, ${color}08 100%)`
                : `linear-gradient(145deg, ${color}22 0%, ${color}12 100%)`,
            border: `1px solid ${isDark ? `${color}28` : `${color}30`}`,
            borderRadius: 3,
            boxShadow: isDark
                ? `0 4px 20px ${color}14`
                : `0 4px 20px ${color}18`,
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: isDark
                    ? `0 10px 32px ${color}28`
                    : `0 10px 32px ${color}30`,
            },
            '&::after': {
                content: '""',
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: 3,
                background: `linear-gradient(90deg, ${color}, ${color}88)`,
                borderRadius: '3px 3px 0 0',
            },
        }}>
            <CardContent sx={{ p: { xs: '14px !important', sm: '20px !important' } }}>
                <Box sx={{
                    width: { xs: 36, sm: 48 },
                    height: { xs: 36, sm: 48 },
                    bgcolor: `${color}${isDark ? '18' : '28'}`,
                    borderRadius: { xs: 2, sm: 2.5 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: { xs: 1, sm: 1.5 },
                    boxShadow: `0 2px 10px ${color}20`,
                }}>
                    {icon}
                </Box>
                <Typography sx={{
                    fontWeight: 800,
                    fontSize: { xs: '1.05rem', sm: '1.55rem', md: '1.75rem' },
                    lineHeight: 1.1,
                    color: color,
                    letterSpacing: '-0.02em',
                    mb: 0.3,
                }}>
                    {value}
                </Typography>
                <Typography sx={{
                    fontSize: { xs: '0.65rem', sm: '0.78rem' },
                    fontWeight: 600,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                }}>
                    {title}
                </Typography>
            </CardContent>
        </Card>
    </motion.div>
));

// ─── Chart Card wrapper ───────────────────────────────────────────────────────
const ChartCard = memo(({ title, emoji, accent, delay, isDark, children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        style={{ height: '100%' }}
    >
        <Card sx={{
            background: isDark
                ? 'rgba(255,255,255,0.025)'
                : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(20px)',
            border: isDark
                ? '1px solid rgba(255,255,255,0.07)'
                : '1px solid rgba(0,0,0,0.08)',
            borderRadius: 3,
            boxShadow: isDark
                ? '0 6px 28px rgba(0,0,0,0.22)'
                : '0 4px 20px rgba(0,0,0,0.08)',
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: 3,
                background: `linear-gradient(90deg, ${accent[0]}, ${accent[1]})`,
            },
        }}>
            <CardContent sx={{ p: { xs: '16px !important', sm: '24px !important' } }}>
                <Typography sx={{
                    fontWeight: 700,
                    fontSize: { xs: '0.82rem', sm: '1rem' },
                    mb: { xs: 1.5, sm: 2 },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    background: `linear-gradient(135deg, ${accent[0]}, ${accent[1]})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                }}>
                    <span style={{ WebkitTextFillColor: 'initial' }}>{emoji}</span>
                    {title}
                </Typography>
                {children}
            </CardContent>
        </Card>
    </motion.div>
));

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <Box sx={{
            background: 'rgba(10,10,20,0.92)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 2.5,
            p: '10px 14px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
            <Typography sx={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', mb: 0.5, fontWeight: 600 }}>
                {label}
            </Typography>
            {payload.map((entry, i) => (
                <Typography key={i} sx={{ fontSize: '0.72rem', color: entry.color, fontWeight: 700 }}>
                    {entry.name}: {formatCurrency(entry.value)}
                </Typography>
            ))}
        </Box>
    );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isDark = theme.palette.mode === 'dark';

    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState(null);
    const [trend, setTrend] = useState([]);
    const [categoryDist, setCategoryDist] = useState([]);
    const [monthlyComp, setMonthlyComp] = useState([]);

    useEffect(() => { loadDashboardData(); }, []);

    const loadDashboardData = async () => {
        try {
            const localDate = new Date().toLocaleDateString('en-CA');
            const [sRes, tRes, cRes, mRes] = await Promise.all([
                dashboardAPI.getSummary(localDate),
                dashboardAPI.getTrend(localDate),
                dashboardAPI.getCategoryDistribution(localDate),
                dashboardAPI.getMonthlyComparison(localDate),
            ]);
            setSummary(sRes.data);
            setTrend(tRes.data);
            setCategoryDist(cRes.data);
            setMonthlyComp(mRes.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6'];

    if (loading) return <PageLoader message="Loading Dashboard..." />;

    const todayExp = Number(summary?.today?.expense || 0);
    const iconSz = { fontSize: isMobile ? 20 : 26 };

    const statCards = [
        { title: "Today's Expense", value: formatCurrency(todayExp), color: todayExp > 0 ? '#ef4444' : '#10b981', icon: todayExp > 0 ? <TrendingDown sx={{ ...iconSz, color: '#ef4444' }} /> : <TrendingUp sx={{ ...iconSz, color: '#10b981' }} /> },
        { title: 'Net Balance', value: formatCurrency(summary?.netBalance || 0), color: '#3b82f6', icon: <AccountBalance sx={{ ...iconSz, color: '#3b82f6' }} /> },
        { title: 'Monthly Expense', value: formatCurrency(summary?.month?.expense || 0), color: '#ec4899', icon: <TrendingDown sx={{ ...iconSz, color: '#ec4899' }} /> },
        { title: 'Monthly Income', value: formatCurrency(summary?.month?.income || 0), color: '#10b981', icon: <TrendingUp sx={{ ...iconSz, color: '#10b981' }} /> },
        { title: 'Monthly Rent Exp.', value: formatCurrency(summary?.month?.rent || 0), color: '#f59e0b', icon: <Home sx={{ ...iconSz, color: '#f59e0b' }} /> },
        { title: 'Monthly Rent Inc.', value: formatCurrency(summary?.month?.rentIncome || 0), color: '#8b5cf6', icon: <Home sx={{ ...iconSz, color: '#8b5cf6' }} /> },
    ];

    const fmtTrend = trend.map(d => ({
        ...d,
        date: new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    }));

    const fmtMonthly = monthlyComp.map(d => ({
        ...d,
        month: new Date(d.month + '-01').toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
    }));

    // Theme-aware chart styles
    const gridStroke = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';
    const axisStyle = { fontSize: isMobile ? 9 : 11, fill: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.5)' };
    const legendStyle = { fontSize: isMobile ? 10 : 12, paddingTop: 6, color: isDark ? '#cbd5e1' : '#64748b' };

    return (
        <Box sx={{ pb: { xs: 3, md: 4 } }}>
            {/* Header */}
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                <Typography sx={{
                    mb: { xs: 2, md: 3 },
                    fontWeight: 800,
                    fontSize: { xs: '1.5rem', sm: '1.8rem' },
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6 50%, #ec4899)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.025em',
                }}>
                    Dashboard
                </Typography>
            </motion.div>

            {/* ── Stat Cards ── */}
            <Grid container spacing={{ xs: 1.25, sm: 1.5, md: 2 }} sx={{ mb: { xs: 2, md: 3.5 } }}>
                {statCards.map((card, i) => (
                    <Grid item xs={6} sm={4} lg={2} key={i}>
                        <StatCard {...card} isDark={isDark} delay={i * 0.07} />
                    </Grid>
                ))}
            </Grid>

            {/* ── Charts ── */}
            <Grid container spacing={{ xs: 1.5, md: 2.5 }}>

                {/* Spending Trend */}
                <Grid item xs={12} md={8}>
                    <ChartCard title="Spending Trend (30 Days)" emoji="📈" accent={['#6366f1', '#8b5cf6']} delay={0.32} isDark={isDark}>
                        <ResponsiveContainer width="100%" height={isMobile ? 170 : 220}>
                            <AreaChart data={fmtTrend} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#ef4444" stopOpacity={0.35} />
                                        <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="gInc" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                                        <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                                <XAxis dataKey="date" tick={axisStyle} axisLine={false} tickLine={false} interval={isMobile ? 5 : 2} />
                                <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend iconType="circle" iconSize={8} wrapperStyle={legendStyle} />
                                <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fill="url(#gExp)" dot={false} activeDot={{ r: 3 }} />
                                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fill="url(#gInc)" dot={false} activeDot={{ r: 3 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </Grid>

                {/* Category Distribution */}
                <Grid item xs={12} md={4}>
                    <ChartCard title="Category Split" emoji="🎯" accent={['#ec4899', '#8b5cf6']} delay={0.4} isDark={isDark}>
                        <ResponsiveContainer width="100%" height={isMobile ? 190 : 220}>
                            <PieChart>
                                <Pie
                                    data={categoryDist}
                                    cx="50%" cy="45%"
                                    outerRadius={isMobile ? 64 : 72}
                                    innerRadius={isMobile ? 30 : 36}
                                    dataKey="value"
                                    paddingAngle={3}
                                    stroke="none"
                                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                        if (percent < 0.05) return null;
                                        const R = Math.PI / 180;
                                        const r = innerRadius + (outerRadius - innerRadius) * 0.55;
                                        return (
                                            <text
                                                x={cx + r * Math.cos(-midAngle * R)}
                                                y={cy + r * Math.sin(-midAngle * R)}
                                                fill="white" textAnchor="middle" dominantBaseline="central"
                                                fontSize={isMobile ? 10 : 12} fontWeight="bold"
                                            >
                                                {`${(percent * 100).toFixed(0)}%`}
                                            </text>
                                        );
                                    }}
                                    labelLine={false}
                                >
                                    {categoryDist.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend iconType="circle" iconSize={7} wrapperStyle={{ ...legendStyle, paddingTop: 4 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </Grid>

                {/* Monthly Comparison */}
                <Grid item xs={12} md={7}>
                    <ChartCard title="Monthly Comparison" emoji="📊" accent={['#3b82f6', '#6366f1']} delay={0.48} isDark={isDark}>
                        <ResponsiveContainer width="100%" height={isMobile ? 190 : 260}>
                            <BarChart data={fmtMonthly} barGap={3} barCategoryGap="30%">
                                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                                <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
                                <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend iconType="circle" iconSize={8} wrapperStyle={{ ...legendStyle, paddingTop: 8 }} />
                                <Bar dataKey="expense" fill="#ef4444" radius={[5, 5, 0, 0]} maxBarSize={36} />
                                <Bar dataKey="income" fill="#10b981" radius={[5, 5, 0, 0]} maxBarSize={36} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </Grid>

                {/* Payment Mode */}
                <Grid item xs={12} md={5}>
                    <ChartCard title="Payment Mode" emoji="💳" accent={['#10b981', '#3b82f6']} delay={0.56} isDark={isDark}>
                        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                            {[
                                { label: 'Cash', value: summary?.month?.cash || 0, color: '#6366f1', icon: <LocalAtm sx={{ fontSize: { xs: 32, sm: 44 }, color: '#6366f1', mb: 0.75 }} /> },
                                { label: 'Online', value: summary?.month?.online || 0, color: '#8b5cf6', icon: <PhoneIphone sx={{ fontSize: { xs: 32, sm: 44 }, color: '#8b5cf6', mb: 0.75 }} /> },
                            ].map(({ label, value, color, icon }) => (
                                <Grid item xs={6} key={label}>
                                    <motion.div whileHover={{ scale: 1.03, y: -3 }} transition={{ type: 'spring', stiffness: 280 }}>
                                        <Box sx={{
                                            textAlign: 'center',
                                            py: { xs: 2, sm: 3 },
                                            px: { xs: 1, sm: 2 },
                                            background: isDark
                                                ? `linear-gradient(145deg, ${color}16 0%, ${color}06 100%)`
                                                : `linear-gradient(145deg, ${color}22 0%, ${color}12 100%)`,
                                            border: `1px solid ${isDark ? `${color}22` : `${color}28`}`,
                                            borderRadius: 3,
                                            boxShadow: isDark
                                                ? `0 4px 16px ${color}10`
                                                : `0 4px 16px ${color}15`,
                                            '&::after': {
                                                content: '""',
                                                display: 'block',
                                                width: '40%',
                                                height: 2,
                                                background: `${color}60`,
                                                margin: '8px auto 0',
                                                borderRadius: 1,
                                            },
                                        }}>
                                            {icon}
                                            <Typography sx={{ fontWeight: 800, color, fontSize: { xs: '1rem', sm: '1.5rem' }, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                                                {formatCurrency(value)}
                                            </Typography>
                                            <Typography sx={{ fontWeight: 600, color: 'text.secondary', fontSize: { xs: '0.65rem', sm: '0.8rem' }, textTransform: 'uppercase', letterSpacing: '0.05em', mt: 0.4 }}>
                                                {label}
                                            </Typography>
                                        </Box>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </ChartCard>
                </Grid>

            </Grid>
        </Box>
    );
};

export default Dashboard;
