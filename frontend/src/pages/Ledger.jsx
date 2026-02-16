import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    MenuItem,
    InputAdornment,
    Stack,
    Fab,
    useMediaQuery,
    useTheme,
    Alert,
    Tooltip,
} from '@mui/material';
import {
    Add,
    Edit,
    Delete,
    CloudUpload,
    Search,
    FilterList,
    Image as ImageIcon,
    Download,
    Visibility,
} from '@mui/icons-material';
import { transactionAPI, receiptAPI, categoryAPI } from '../services/api';
import { formatCurrency, formatDate, getTransactionTypeColor } from '../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import PageLoader from '../components/common/PageLoader';

const Ledger = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
    const [currentReceipts, setCurrentReceipts] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState(null);
    const [formData, setFormData] = useState({
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
        amount: '',
        category: '',
        paymentMode: 'cash',
        vendor: '',
        notes: '',
    });
    const [images, setImages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1); // Reset to page 1 on search
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        loadTransactions();
        loadCategories();

        // Check for ?add=true query parameter
        const params = new URLSearchParams(location.search);
        if (params.get('add') === 'true') {
            handleOpenDialog();
            // Remove the query parameter
            navigate('/ledger', { replace: true });
        }
    }, [location.search, page, debouncedSearch]);

    const loadTransactions = async () => {
        try {
            setLoading(true);
            // Add artificial delay for smoother loading experience
            await new Promise(resolve => setTimeout(resolve, 500));

            const response = await transactionAPI.getAll({
                page,
                limit: 10,
                search: debouncedSearch
            });
            setTransactions(response.data.transactions || []);
            setTotalPages(response.data.totalPages);
            setTotalTransactions(response.data.total);
        } catch (error) {
            console.error('Error loading transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await categoryAPI.getAll();
            setCategories(response.data);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const handleOpenDialog = (transaction = null) => {
        if (transaction) {
            setEditMode(true);
            setCurrentTransaction(transaction);
            setFormData({
                type: transaction.type,
                date: new Date(transaction.date).toISOString().split('T')[0],
                amount: transaction.amount,
                category: transaction.category,
                paymentMode: transaction.paymentMode,
                vendor: transaction.vendor || '',
                notes: transaction.notes || '',
            });
        } else {
            setEditMode(false);
            setCurrentTransaction(null);
            setFormData({
                type: 'expense',
                date: new Date().toISOString().split('T')[0],
                amount: '',
                category: '',
                paymentMode: 'cash',
                vendor: '',
                notes: '',
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditMode(false);
        setCurrentTransaction(null);
        setImages([]);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 5) {
            alert('You can only upload up to 5 images');
            return;
        }
        setImages([...images, ...files]);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            let transactionId;

            if (editMode && currentTransaction) {
                await transactionAPI.update(currentTransaction._id, formData);
                transactionId = currentTransaction._id;
                setSuccess('Transaction updated successfully');
            } else {
                const response = await transactionAPI.create(formData);
                transactionId = response.data._id;
                // Don't set success yet if we have images
                if (images.length === 0) {
                    setSuccess('Transaction added successfully');
                }
            }

            // Upload receipts if any
            if (images.length > 0) {
                try {
                    const formDataUpload = new FormData();
                    formDataUpload.append('transactionId', transactionId);
                    images.forEach((image) => {
                        formDataUpload.append('receipts', image); // Changed 'images' to 'receipts' to match backend
                    });

                    const uploadResponse = await receiptAPI.upload(formDataUpload);

                    if (editMode) {
                        setSuccess('Transaction and receipts updated successfully');
                    } else {
                        setSuccess('Transaction and receipts added successfully');
                    }
                } catch (uploadError) {
                    console.error('Error uploading receipts:', uploadError);
                    // Transaction was saved, but receipts failed
                    setSuccess('Transaction saved, but failed to upload receipts. Please try adding them later.');
                    // Don't set main error, as transaction was saved
                }
            }

            handleCloseDialog();
            loadTransactions();
        } catch (error) {
            console.error('Error saving transaction:', error);
            setError('Failed to save transaction');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            // Optimistic UI update
            const checkTransactions = [...transactions];
            const updatedTransactions = transactions.filter(t => t._id !== id);
            setTransactions(updatedTransactions);

            // Show success immediately for better UX
            setSuccess('Transaction deleted successfully');

            try {
                await transactionAPI.delete(id);
                // Background reload to ensure consistency (optional, but good for sync)
                // loadTransactions(); 
            } catch (error) {
                console.error('Error deleting transaction:', error);
                // Revert changes if API fails
                setTransactions(checkTransactions);
                setError('Failed to delete transaction');
                setSuccess(''); // Clear the success message
            }
        }
    };

    const handleViewReceipts = async (transactionId) => {
        try {
            const response = await receiptAPI.getByTransaction(transactionId);
            setCurrentReceipts(response.data);
            setOpenReceiptDialog(true);
        } catch (error) {
            console.error('Error loading receipts:', error);
        }
    };

    // handlers end

    return (
        <Box>
            {loading && <PageLoader message="Loading Ledger..." />}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' }
                    }}
                >
                    Ledger
                </Typography>
                {!isMobile && (
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => handleOpenDialog()}
                        sx={{
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            px: 3,
                            py: 1,
                            borderRadius: 2,
                            boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                boxShadow: '0 6px 20px 0 rgba(99, 102, 241, 0.5)',
                            }
                        }}
                    >
                        Add Transaction
                    </Button>
                )}
            </Box>

            <AnimatePresence>
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                    >
                        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
                            {success}
                        </Alert>
                    </motion.div>
                )}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                    >
                        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                            {error}
                        </Alert>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search Bar */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Card
                    sx={{
                        mb: 3,
                        p: 2.5,
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    }}
                >
                    <TextField
                        fullWidth
                        placeholder="Search by vendor, category, or notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ color: '#6366f1' }} />
                                </InputAdornment>
                            ),
                        }}
                    // ... styles ...
                    />
                </Card>
            </motion.div>

            {/* Transactions Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <Card
                    sx={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        overflow: isMobile ? 'visible' : 'hidden',
                        mb: 3
                    }}
                >
                    <TableContainer sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'rgba(99, 102, 241, 0.08)' }}>
                                    <TableCell><strong>Date</strong></TableCell>
                                    <TableCell><strong>Type</strong></TableCell>
                                    <TableCell><strong>Category</strong></TableCell>
                                    <TableCell><strong>Vendor</strong></TableCell>
                                    <TableCell><strong>Notes</strong></TableCell>
                                    <TableCell align="right"><strong>Amount</strong></TableCell>
                                    <TableCell><strong>Payment</strong></TableCell>
                                    <TableCell align="right"><strong>Actions</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <AnimatePresence>
                                    {transactions.map((transaction, index) => (
                                        <motion.tr
                                            key={transaction._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: index * 0.05, duration: 0.3 }}
                                            component={TableRow}
                                            sx={{
                                                cursor: 'pointer',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                '&:hover': {
                                                    transform: 'translateZ(10px) scale(1.01)',
                                                    bgcolor: 'rgba(99, 102, 241, 0.05)',
                                                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.2)',
                                                },
                                            }}
                                        >
                                            <TableCell>{formatDate(transaction.date)}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={transaction.type}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: `${getTransactionTypeColor(transaction.type)}20`,
                                                        color: getTransactionTypeColor(transaction.type),
                                                        fontWeight: 600,
                                                        textTransform: 'capitalize',
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>{transaction.category}</TableCell>
                                            <TableCell>{transaction.vendor || '-'}</TableCell>
                                            <TableCell>
                                                {transaction.notes ? (
                                                    <Tooltip title={transaction.notes}>
                                                        <Typography variant="body2" sx={{ maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            {transaction.notes}
                                                        </Typography>
                                                    </Tooltip>
                                                ) : '-'}
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700 }}>
                                                {formatCurrency(transaction.amount)}
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={transaction.paymentMode} size="small" variant="outlined" />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                    <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleViewReceipts(transaction._id)}
                                                            sx={{
                                                                color: '#3b82f6',
                                                                '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.1)' },
                                                            }}
                                                            title="View Receipts"
                                                        >
                                                            <Visibility fontSize="small" />
                                                        </IconButton>
                                                    </motion.div>
                                                    <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleOpenDialog(transaction)}
                                                            sx={{
                                                                color: '#6366f1',
                                                                '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.1)' },
                                                            }}
                                                            title="Edit"
                                                        >
                                                            <Edit fontSize="small" />
                                                        </IconButton>
                                                    </motion.div>
                                                    <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleDelete(transaction._id)}
                                                            sx={{
                                                                color: '#ef4444',
                                                                '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' },
                                                            }}
                                                            title="Delete"
                                                        >
                                                            <Delete fontSize="small" />
                                                        </IconButton>
                                                    </motion.div>
                                                </Stack>
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                                {transactions.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <Add sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                                                <Typography color="text.secondary" variant="h6">
                                                    {searchQuery ? 'No transactions match your search' : 'No transactions yet. Add your first transaction!'}
                                                </Typography>
                                            </motion.div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Mobile Card View */}
                    <Box sx={{ display: { xs: 'block', sm: 'none' }, p: 2 }}>
                        <AnimatePresence>
                            {transactions.map((transaction, index) => (
                                <motion.div
                                    key={transaction._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card
                                        sx={{
                                            mb: 2,
                                            p: 2,
                                            background: 'rgba(99, 102, 241, 0.05)',
                                            border: `1px solid ${getTransactionTypeColor(transaction.type)}40`,
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    {formatDate(transaction.date)}
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                                                    {formatCurrency(transaction.amount)}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={transaction.type}
                                                size="small"
                                                sx={{
                                                    bgcolor: `${getTransactionTypeColor(transaction.type)}20`,
                                                    color: getTransactionTypeColor(transaction.type),
                                                    fontWeight: 600,
                                                    textTransform: 'capitalize',
                                                }}
                                            />
                                        </Box>

                                        <Box sx={{ mb: 1.5 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Category: <strong>{transaction.category}</strong>
                                            </Typography>
                                            {transaction.vendor && (
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                    Vendor: <strong>{transaction.vendor}</strong>
                                                </Typography>
                                            )}
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                Payment: <Chip label={transaction.paymentMode} size="small" variant="outlined" sx={{ ml: 0.5 }} />
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleViewReceipts(transaction._id)}
                                                sx={{ color: '#3b82f6' }}
                                            >
                                                <Visibility fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleOpenDialog(transaction)}
                                                sx={{ color: '#6366f1' }}
                                            >
                                                <Edit fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(transaction._id)}
                                                sx={{ color: '#ef4444' }}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {transactions.length === 0 && (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Add sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                                </motion.div>
                                <Typography variant="h6" color="text.secondary">
                                    {searchQuery ? 'No transactions match your search' : 'No transactions yet'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Click the + button below to add a transaction
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Card>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
                        <Button
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            variant="outlined"
                        >
                            Previous
                        </Button>
                        <Chip label={`Page ${page} of ${totalPages}`} variant="outlined" />
                        <Button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            variant="outlined"
                        >
                            Next
                        </Button>
                    </Stack>
                )}
            </motion.div>



            {/* Add/Edit Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                fullScreen={isMobile}
                PaperProps={{
                    sx: {
                        borderRadius: isMobile ? 0 : 3,
                        background: theme.palette.mode === 'dark'
                            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)'
                            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(249, 250, 251, 0.98) 100%)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    }
                }}
            >
                {/* Modern Gradient Header */}
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        p: { xs: 2.5, md: 3 },
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                            background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2), transparent 70%)',
                            pointerEvents: 'none',
                        },
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 0.5, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                                {editMode ? '✏️ Edit Transaction' : '➕ Add New Transaction'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: { xs: '0.875rem', md: '1rem' } }}>
                                {editMode ? 'Update transaction details' : 'Record your income or expense'}
                            </Typography>
                        </Box>
                        <IconButton
                            onClick={handleCloseDialog}
                            sx={{
                                color: 'white',
                                background: 'rgba(255,255,255,0.1)',
                                '&:hover': {
                                    background: 'rgba(255,255,255,0.2)',
                                }
                            }}
                        >
                            <Delete />
                        </IconButton>
                    </Box>
                </Box>
                <DialogContent sx={{ pb: isMobile ? 12 : 3, pt: 3, px: { xs: 2, md: 3 } }}>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                            >
                                <MenuItem value="expense">Expense</MenuItem>
                                <MenuItem value="income">Income</MenuItem>
                                <MenuItem value="purchase">Purchase</MenuItem>
                                <MenuItem value="credit_given">Credit Given</MenuItem>
                                <MenuItem value="credit_received">Credit Received</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Amount"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category._id} value={category.name}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box
                                                sx={{
                                                    width: 12,
                                                    height: 12,
                                                    borderRadius: '50%',
                                                    bgcolor: category.color,
                                                }}
                                            />
                                            {category.name}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Payment Mode"
                                name="paymentMode"
                                value={formData.paymentMode}
                                onChange={handleChange}
                            >
                                <MenuItem value="cash">Cash</MenuItem>
                                <MenuItem value="upi">UPI</MenuItem>
                                <MenuItem value="bank">Bank Transfer</MenuItem>
                                <MenuItem value="card">Card</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Vendor/Party Name"
                                name="vendor"
                                value={formData.vendor}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                multiline
                                rows={2}
                            />
                        </Grid>

                        {/* Bill Upload */}
                        <Grid item xs={12}>
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<CloudUpload />}
                                fullWidth
                                sx={{ py: 1.5 }}
                            >
                                Upload Bills/Receipts (Max 5)
                                <input
                                    type="file"
                                    hidden
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    max="5"
                                />
                            </Button>
                            {images.length > 0 && (
                                <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {images.map((file, index) => (
                                        <Chip
                                            key={index}
                                            icon={<ImageIcon />}
                                            label={file.name}
                                            size="small"
                                            onDelete={() => setImages(images.filter((_, i) => i !== index))}
                                        />
                                    ))}
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading || !formData.amount || !formData.category}
                        sx={{
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        }}
                    >
                        {loading ? 'Saving...' : editMode ? 'Update' : 'Add Transaction'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Receipt Viewer Dialog */}
            <Dialog
                open={openReceiptDialog}
                onClose={() => setOpenReceiptDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Transaction Receipts</DialogTitle>
                <DialogContent>
                    {currentReceipts.length === 0 ? (
                        <Box sx={{ py: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">
                                No receipts uploaded for this transaction.
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            {currentReceipts.map((receipt) => (
                                <Grid item xs={12} sm={6} key={receipt._id}>
                                    <Box
                                        component="img"
                                        src={receipt.imageUrl}
                                        alt="Receipt"
                                        sx={{
                                            width: '100%',
                                            height: 'auto',
                                            borderRadius: 2,
                                            border: '1px solid #e5e7eb',
                                        }}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenReceiptDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Ledger;
