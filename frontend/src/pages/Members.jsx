import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Avatar,
    Button,
    Chip,
    Divider,
    Stack,
    Alert,
    CircularProgress,
    Tabs,
    Tab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Grid,
} from '@mui/material';
import {
    CheckCircle,
    Cancel,
    Group,
    HourglassEmpty,
    PersonOff,
    Close,
    TrendingUp,
    Receipt,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { membersAPI, reportAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const statusConfig = {
    pending: { label: 'Pending', color: 'warning', icon: <HourglassEmpty fontSize="small" /> },
    approved: { label: 'Active', color: 'success', icon: <CheckCircle fontSize="small" /> },
    rejected: { label: 'Rejected', color: 'error', icon: <PersonOff fontSize="small" /> },
};

const Members = () => {
    const { isOwner } = useAuth();
    const navigate = useNavigate();

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState('');
    const [error, setError] = useState('');
    const [tab, setTab] = useState(0); // 0=pending, 1=active, 2=all

    // Stats dialog
    const [statsOpen, setStatsOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(false);

    useEffect(() => {
        if (!isOwner) { navigate('/dashboard'); return; }
        fetchMembers();
    }, [isOwner]);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const res = await membersAPI.getAll();
            setMembers(res.data || []);
        } catch {
            setError('Failed to load members');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (memberId) => {
        setActionLoading(memberId);
        try {
            await membersAPI.approve(memberId);
            setMembers(prev => prev.map(m => m._id === memberId ? { ...m, membershipStatus: 'approved' } : m));
        } catch {
            setError('Failed to approve member');
        } finally {
            setActionLoading('');
        }
    };

    const handleReject = async (memberId) => {
        setActionLoading(memberId + '_reject');
        try {
            await membersAPI.reject(memberId);
            setMembers(prev => prev.map(m => m._id === memberId ? { ...m, membershipStatus: 'rejected' } : m));
        } catch {
            setError('Failed to reject member');
        } finally {
            setActionLoading('');
        }
    };

    const handleViewStats = async (member) => {
        setSelectedMember(member);
        setStatsOpen(true);
        setStatsLoading(true);
        try {
            const res = await membersAPI.getStats(member._id);
            setStats(res.data.stats);
        } catch {
            setStats(null);
        } finally {
            setStatsLoading(false);
        }
    };

    const pending = members.filter(m => m.membershipStatus === 'pending');
    const active = members.filter(m => m.membershipStatus === 'approved');
    const all = members;

    const displayed = tab === 0 ? pending : tab === 1 ? active : all;

    const fmt = (n) => `₹${(n || 0).toLocaleString('en-IN')}`;

    return (
        <Box>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' }, letterSpacing: '-0.02em' }} gutterBottom>
                            Team Members
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Manage who has access to your ShreeKhata account
                        </Typography>
                    </Box>
                </Box>

                {/* Summary Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {[
                        { label: 'Pending Requests', value: pending.length, gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', shadow: 'rgba(245, 158, 11, 0.2)' },
                        { label: 'Active Members', value: active.length, gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', shadow: 'rgba(16, 185, 129, 0.2)' },
                        { label: 'Total Members', value: all.length, gradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', shadow: 'rgba(99, 102, 241, 0.2)' },
                    ].map((card, index) => (
                        <Grid item xs={12} sm={4} key={card.label}>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                                <Paper elevation={0} sx={{
                                    p: 3,
                                    borderRadius: 4,
                                    background: card.gradient,
                                    color: 'white',
                                    boxShadow: `0 10px 30px ${card.shadow}`,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: '-50%',
                                        right: '-20%',
                                        width: '100%',
                                        height: '200%',
                                        background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%)',
                                        transform: 'rotate(30deg)',
                                        pointerEvents: 'none',
                                    }
                                }}>
                                    <Typography variant="h3" fontWeight={800} sx={{ mb: 1, textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                                        {card.value}
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600} sx={{ opacity: 0.9 }}>
                                        {card.label}
                                    </Typography>
                                </Paper>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>

                {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>{error}</Alert>}

                {/* Tabs */}
                <Paper elevation={0} sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}>
                    <Tabs
                        value={tab}
                        onChange={(_, v) => setTab(v)}
                        sx={{
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            px: 2,
                            '& .MuiTab-root': { fontWeight: 600, textTransform: 'none', fontSize: '1rem', py: 2.5 },
                            '& .Mui-selected': { color: '#6366F1' },
                            '& .MuiTabs-indicator': { backgroundColor: '#6366F1', height: 3, borderRadius: '3px 3px 0 0' }
                        }}
                    >
                        <Tab label={`Pending (${pending.length})`} />
                        <Tab label={`Active (${active.length})`} />
                        <Tab label={`All (${all.length})`} />
                    </Tabs>

                    {loading ? (
                        <Box sx={{ py: 8, textAlign: 'center' }}><CircularProgress sx={{ color: '#6366F1' }} /></Box>
                    ) : displayed.length === 0 ? (
                        <Box sx={{ py: 10, textAlign: 'center' }}>
                            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
                                <Group sx={{ fontSize: 64, color: 'text.disabled', mb: 2, opacity: 0.5 }} />
                                <Typography variant="h6" color="text.secondary" fontWeight={600}>
                                    {tab === 0 ? 'No pending requests' : tab === 1 ? 'No active members yet' : 'No members found'}
                                </Typography>
                            </motion.div>
                        </Box>
                    ) : (
                        <Stack divider={<Divider sx={{ opacity: 0.5 }} />}>
                            {displayed.map((member, i) => {
                                const status = statusConfig[member.membershipStatus];
                                return (
                                    <motion.div key={member._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                                        <Box sx={{
                                            p: 3,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 3,
                                            flexWrap: 'wrap',
                                            transition: 'all 0.2s ease',
                                            '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.04)' }
                                        }}>
                                            <Avatar sx={{
                                                bgcolor: member.membershipStatus === 'pending' ? '#F59E0B' : member.membershipStatus === 'approved' ? '#10B981' : '#6366F1',
                                                width: 56,
                                                height: 56,
                                                fontSize: '1.5rem',
                                                fontWeight: 700,
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                            }}>
                                                {member.name?.[0]?.toUpperCase()}
                                            </Avatar>
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography variant="h6" fontWeight={700}>{member.name}</Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{member.email}</Typography>
                                                <Typography variant="caption" color="text.disabled" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    Joined {new Date(member.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                                <Chip
                                                    icon={status.icon}
                                                    label={status.label}
                                                    color={status.color}
                                                    size="small"
                                                    variant={member.membershipStatus === 'pending' ? 'filled' : 'outlined'}
                                                    sx={{
                                                        fontWeight: 700,
                                                        px: 1,
                                                        ...(member.membershipStatus === 'pending' && {
                                                            bgcolor: 'warning.light',
                                                            color: 'warning.dark',
                                                            border: 'none'
                                                        })
                                                    }}
                                                />

                                                {member.membershipStatus === 'approved' && (
                                                    <Button
                                                        size="small"
                                                        variant="text"
                                                        startIcon={<TrendingUp />}
                                                        onClick={() => handleViewStats(member)}
                                                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, color: '#6366F1' }}
                                                    >
                                                        View Stats
                                                    </Button>
                                                )}

                                                {member.membershipStatus === 'pending' && (
                                                    <Stack direction="row" spacing={1}>
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            color="success"
                                                            startIcon={actionLoading === member._id ? <CircularProgress size={16} color="inherit" /> : <CheckCircle />}
                                                            onClick={() => handleApprove(member._id)}
                                                            disabled={!!actionLoading}
                                                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)' }}
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            color="error"
                                                            startIcon={actionLoading === member._id + '_reject' ? <CircularProgress size={16} color="inherit" /> : <Cancel />}
                                                            onClick={() => handleReject(member._id)}
                                                            disabled={!!actionLoading}
                                                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </Stack>
                                                )}
                                            </Box>
                                        </Box>
                                    </motion.div>
                                );
                            })}
                        </Stack>
                    )}
                </Paper>
            </motion.div>

            {/* Stats Dialog */}
            <Dialog open={statsOpen} onClose={() => setStatsOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography fontWeight={700}>{selectedMember?.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{selectedMember?.email}</Typography>
                    </Box>
                    <IconButton onClick={() => setStatsOpen(false)}><Close /></IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {statsLoading ? (
                        <Box sx={{ py: 4, textAlign: 'center' }}><CircularProgress /></Box>
                    ) : stats ? (
                        <Grid container spacing={2}>
                            {[
                                { label: 'Total Transactions', value: stats.totalTransactions, icon: <Receipt />, color: '#6366F1' },
                                { label: 'Total Income', value: fmt(stats.totalIncome), icon: <TrendingUp />, color: '#10B981' },
                                { label: 'Total Expense', value: fmt(stats.totalExpense), icon: <Receipt />, color: '#EF4444' },
                            ].map((s) => (
                                <Grid item xs={12} sm={4} key={s.label}>
                                    <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                                        <Box sx={{ color: s.color, mb: 1 }}>{s.icon}</Box>
                                        <Typography variant="h6" fontWeight={800} sx={{ color: s.color }}>{s.value}</Typography>
                                        <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                                    </Paper>
                                </Grid>
                            ))}
                            {stats.lastActivity && (
                                <Grid item xs={12}>
                                    <Typography variant="caption" color="text.secondary">
                                        Last activity: {new Date(stats.lastActivity).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    ) : (
                        <Typography color="text.secondary">No transactions recorded.</Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setStatsOpen(false)} sx={{ textTransform: 'none' }}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Members;
