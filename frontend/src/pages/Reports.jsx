import { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    Grid,
    TextField,
    Button,
    MenuItem,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Alert,
} from '@mui/material';
import { PictureAsPdf, TableChart, Assessment } from '@mui/icons-material';
import { reportAPI } from '../services/api';
import { formatCurrency, formatDate, downloadBlob } from '../utils/formatters';
import { motion } from 'framer-motion';

const Reports = () => {
    const [reportType, setReportType] = useState('monthly');
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
    const [vendor, setVendor] = useState('');
    const [category, setCategory] = useState('');
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const generateReport = async () => {
        try {
            setLoading(true);
            setError('');
            let response;

            if (reportType === 'monthly') {
                const [year, monthNum] = month.split('-');
                response = await reportAPI.getMonthly({ year, month: monthNum });
            } else if (reportType === 'vendor') {
                response = await reportAPI.getVendor({ vendor });
            } else if (reportType === 'category') {
                response = await reportAPI.getCategory({ category });
            }

            setReportData(response.data);
        } catch (error) {
            setError('Error generating report');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getReportDates = () => {
        const [year, monthNum] = month.split('-');
        const startDate = new Date(year, monthNum - 1, 1).toISOString();
        const endDate = new Date(year, monthNum, 0, 23, 59, 59).toISOString();
        return { startDate, endDate };
    };

    const exportPDF = async () => {
        try {
            setLoading(true);
            const { startDate, endDate } = getReportDates();
            const response = await reportAPI.exportPDF({ startDate, endDate, title: `Report ${month}` });
            downloadBlob(response.data, `report-${month}.pdf`);
        } catch (error) {
            setError('Error exporting PDF');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const exportExcel = async () => {
        try {
            setLoading(true);
            const { startDate, endDate } = getReportDates();
            const response = await reportAPI.exportExcel({ startDate, endDate });
            downloadBlob(response.data, `report-${month}.xlsx`);
        } catch (error) {
            setError('Error exporting Excel');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography
                variant="h4"
                sx={{
                    mb: { xs: 2, md: 3 },
                    fontWeight: 700,
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' }
                }}
            >
                Reports & Analytics
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Grid container spacing={{ xs: 2, md: 3 }}>
                {/* Report Configuration */}
                <Grid item xs={12} lg={4}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Card
                            sx={{
                                p: 3,
                                background: 'rgba(255, 255, 255, 0.03)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: 3,
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Generate Report
                            </Typography>

                            <Stack spacing={3}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Report Type"
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                >
                                    <MenuItem value="monthly">Monthly Report</MenuItem>
                                    <MenuItem value="vendor">Vendor Report</MenuItem>
                                    <MenuItem value="category">Category Report</MenuItem>
                                </TextField>

                                {reportType === 'monthly' && (
                                    <TextField
                                        fullWidth
                                        type="month"
                                        label="Select Month"
                                        value={month}
                                        onChange={(e) => setMonth(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                )}

                                {reportType === 'vendor' && (
                                    <TextField
                                        fullWidth
                                        label="Vendor Name"
                                        value={vendor}
                                        onChange={(e) => setVendor(e.target.value)}
                                        placeholder="Enter vendor name"
                                    />
                                )}

                                {reportType === 'category' && (
                                    <TextField
                                        fullWidth
                                        label="Category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        placeholder="Enter category"
                                    />
                                )}

                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        variant="contained"
                                        startIcon={<Assessment />}
                                        onClick={generateReport}
                                        disabled={loading}
                                        fullWidth
                                        sx={{
                                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
                                            py: 1.2,
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                                boxShadow: '0 12px 32px rgba(99, 102, 241, 0.5)',
                                            },
                                        }}
                                    >
                                        Generate Report
                                    </Button>
                                </motion.div>

                                {reportType === 'monthly' && (
                                    <>
                                        <motion.div
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Button
                                                variant="outlined"
                                                startIcon={<PictureAsPdf />}
                                                onClick={exportPDF}
                                                disabled={loading}
                                                fullWidth
                                                sx={{
                                                    borderColor: '#ef4444',
                                                    color: '#ef4444',
                                                    '&:hover': {
                                                        borderColor: '#dc2626',
                                                        bgcolor: 'rgba(239, 68, 68, 0.1)',
                                                    },
                                                }}
                                            >
                                                Export PDF
                                            </Button>
                                        </motion.div>

                                        <motion.div
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Button
                                                variant="outlined"
                                                startIcon={<TableChart />}
                                                onClick={exportExcel}
                                                disabled={loading}
                                                fullWidth
                                                sx={{
                                                    borderColor: '#10b981',
                                                    color: '#10b981',
                                                    '&:hover': {
                                                        borderColor: '#059669',
                                                        bgcolor: 'rgba(16, 185, 129, 0.1)',
                                                    },
                                                }}
                                            >
                                                Export Excel
                                            </Button>
                                        </motion.div>
                                    </>
                                )}
                            </Stack>
                        </Card>
                    </motion.div>
                </Grid>

                {/* Report Display */}
                <Grid item xs={12} lg={8}>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card
                            sx={{
                                p: 3,
                                background: 'rgba(255, 255, 255, 0.03)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: 3,
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Report Results
                            </Typography>

                            {!reportData ? (
                                <Box sx={{ py: 8, textAlign: 'center' }}>
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                    >
                                        <Assessment sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                                    </motion.div>
                                    <Typography color="text.secondary">
                                        Select report parameters and click "Generate Report" to view results
                                    </Typography>
                                </Box>
                            ) : (
                                <Box>
                                    {/* Summary Cards */}
                                    <Grid container spacing={2} sx={{ mb: 3 }}>
                                        <Grid item xs={12} sm={4}>
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.1 }}
                                                whileHover={{ scale: 1.03, y: -5 }}
                                            >
                                                <Card
                                                    sx={{
                                                        p: 2.5,
                                                        background: 'linear-gradient(135deg, #ef444420 0%, #ef444408 100%)',
                                                        border: '1px solid #ef444430',
                                                        boxShadow: '0 4px 16px rgba(239, 68, 68, 0.2)',
                                                    }}
                                                >
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>Total Expense</Typography>
                                                    <Typography
                                                        variant="h5"
                                                        sx={{
                                                            fontWeight: 700,
                                                            color: '#ef4444',
                                                            mt: 0.5,
                                                        }}
                                                    >
                                                        {formatCurrency(reportData.summary?.totalExpense || 0)}
                                                    </Typography>
                                                </Card>
                                            </motion.div>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.2 }}
                                                whileHover={{ scale: 1.03, y: -5 }}
                                            >
                                                <Card
                                                    sx={{
                                                        p: 2.5,
                                                        background: 'linear-gradient(135deg, #10b98120 0%, #10b98108 100%)',
                                                        border: '1px solid #10b98130',
                                                        boxShadow: '0 4px 16px rgba(16, 185, 129, 0.2)',
                                                    }}
                                                >
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>Total Income</Typography>
                                                    <Typography
                                                        variant="h5"
                                                        sx={{
                                                            fontWeight: 700,
                                                            color: '#10b981',
                                                            mt: 0.5,
                                                        }}
                                                    >
                                                        {formatCurrency(reportData.summary?.totalIncome || 0)}
                                                    </Typography>
                                                </Card>
                                            </motion.div>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.3 }}
                                                whileHover={{ scale: 1.03, y: -5 }}
                                            >
                                                <Card
                                                    sx={{
                                                        p: 2.5,
                                                        background: 'linear-gradient(135deg, #3b82f620 0%, #3b82f608 100%)',
                                                        border: '1px solid #3b82f630',
                                                        boxShadow: '0 4px 16px rgba(59, 130, 246, 0.2)',
                                                    }}
                                                >
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>Net Balance</Typography>
                                                    <Typography
                                                        variant="h5"
                                                        sx={{
                                                            fontWeight: 700,
                                                            color: '#3b82f6',
                                                            mt: 0.5,
                                                        }}
                                                    >
                                                        {formatCurrency(
                                                            (reportData.summary?.totalIncome || 0) -
                                                            (reportData.summary?.totalExpense || 0)
                                                        )}
                                                    </Typography>
                                                </Card>
                                            </motion.div>
                                        </Grid>
                                    </Grid>

                                    {/* Transactions Table */}
                                    {reportData.transactions && reportData.transactions.length > 0 && (
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell><strong>Date</strong></TableCell>
                                                        <TableCell><strong>Type</strong></TableCell>
                                                        <TableCell><strong>Category</strong></TableCell>
                                                        <TableCell><strong>Vendor</strong></TableCell>
                                                        <TableCell align="right"><strong>Amount</strong></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {reportData.transactions.map((transaction) => (
                                                        <TableRow key={transaction._id}>
                                                            <TableCell>{formatDate(transaction.date)}</TableCell>
                                                            <TableCell sx={{ textTransform: 'capitalize' }}>
                                                                {transaction.type}
                                                            </TableCell>
                                                            <TableCell>{transaction.category}</TableCell>
                                                            <TableCell>{transaction.vendor || '-'}</TableCell>
                                                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                                                                {formatCurrency(transaction.amount)}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )}

                                    {/* Category Breakdown */}
                                    {reportData.categoryBreakdown && (
                                        <Box sx={{ mt: 3 }}>
                                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                                Category Breakdown
                                            </Typography>
                                            <Grid container spacing={2}>
                                                {reportData.categoryBreakdown.map((item, index) => (
                                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                                        <Card sx={{ p: 2 }}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {item.category}
                                                            </Typography>
                                                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                                                {formatCurrency(item.total)}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {item.count} transactions
                                                            </Typography>
                                                        </Card>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </Card>
                    </motion.div>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Reports;
