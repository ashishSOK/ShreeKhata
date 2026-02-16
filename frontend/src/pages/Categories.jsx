import { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    Grid,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    Stack,
    Skeleton,
    useTheme,
} from '@mui/material';
import { Add, Edit, Delete, Circle } from '@mui/icons-material';
import { categoryAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import PageLoader from '../components/common/PageLoader';

const CategoryCard = ({ category, index, onEdit, onDelete, isDefault }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        style={{ height: '100%' }}
    >
        <Card
            sx={{
                p: 2.5,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                background: `linear-gradient(135deg, ${category.color}15 0%, ${category.color}05 100%)`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${category.color}30`,
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: `0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px ${category.color}15`,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `radial-gradient(circle at top left, ${category.color}20, transparent 60%)`,
                    pointerEvents: 'none',
                },
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 24px rgba(0, 0, 0, 0.2), 0 4px 8px ${category.color}30`,
                    border: `1px solid ${category.color}50`,
                },
            }}
        >
            <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
            >
                <Circle
                    sx={{
                        color: category.color,
                        fontSize: 36,
                        filter: `drop-shadow(0 4px 8px ${category.color}40)`,
                    }}
                />
            </motion.div>

            <Box sx={{ flex: 1, position: 'relative', zIndex: 1, minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, noWrap: true }}>
                    {category.name}
                </Typography>
                {isDefault && (
                    <Chip
                        label="Default"
                        size="small"
                        sx={{
                            bgcolor: `${category.color}20`,
                            color: category.color,
                            fontWeight: 600,
                            border: `1px solid ${category.color}40`,
                            height: 20,
                            fontSize: '0.7rem'
                        }}
                    />
                )}
            </Box>

            {!isDefault && (
                <Box sx={{ display: 'flex', gap: 0.5, position: 'relative', zIndex: 1 }}>
                    <IconButton
                        size="small"
                        onClick={() => onEdit(category)}
                        sx={{
                            color: category.color,
                            opacity: 0.8,
                            '&:hover': { opacity: 1, bgcolor: `${category.color}15` },
                        }}
                    >
                        <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => onDelete(category._id)}
                        sx={{
                            color: '#ef4444',
                            opacity: 0.8,
                            '&:hover': { opacity: 1, bgcolor: 'rgba(239, 68, 68, 0.1)' },
                        }}
                    >
                        <Delete fontSize="small" />
                    </IconButton>
                </Box>
            )}
        </Card>
    </motion.div>
);

const CategorySkeleton = () => (
    <Card
        sx={{
            p: 2.5,
            height: '100%',
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
    >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Skeleton variant="circular" width={36} height={36} />
            <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="30%" height={16} />
            </Box>
        </Box>
    </Card>
);

const Categories = () => {
    const theme = useTheme();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', color: '#6366f1' });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const colors = [
        '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
        '#3b82f6', '#ef4444', '#14b8a6', '#f97316', '#8b5cf6',
    ];

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            // Promise.all ensures we wait for API but also respect min loading time
            const [response] = await Promise.all([
                categoryAPI.getAll()
            ]);
            setCategories(response.data);
        } catch (error) {
            console.error('Error loading categories:', error);
            setError('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (category = null) => {
        if (category) {
            setEditMode(true);
            setCurrentCategory(category);
            setFormData({ name: category.name, color: category.color });
        } else {
            setEditMode(false);
            setCurrentCategory(null);
            setFormData({ name: '', color: colors[0] });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setError('');
    };

    const handleSubmit = async () => {
        try {
            setError('');
            if (editMode) {
                await categoryAPI.update(currentCategory._id, formData);
                setSuccess('Category updated successfully!');
            } else {
                await categoryAPI.create(formData);
                setSuccess('Category created successfully!');
            }
            loadCategories();
            handleCloseDialog();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Error saving category');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            await categoryAPI.delete(id);
            setSuccess('Category deleted successfully!');
            loadCategories();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError('Error deleting category');
        }
    };

    const defaultCategories = useMemo(() => categories.filter((c) => c.isDefault), [categories]);
    const customCategories = useMemo(() => categories.filter((c) => !c.isDefault), [categories]);

    return (
        <Box>
            {loading && <PageLoader message="Loading Categories..." />}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Categories
                </Typography>
                <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98, y: 0 }}
                >
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => handleOpenDialog()}
                        sx={{
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4), 0 4px 12px rgba(139, 92, 246, 0.3)',
                            borderRadius: 2,
                            px: 3,
                            py: 1.2,
                            '&:hover': {
                                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                boxShadow: '0 12px 32px rgba(99, 102, 241, 0.5), 0 6px 16px rgba(139, 92, 246, 0.4)',
                            },
                        }}
                    >
                        Add Category
                    </Button>
                </motion.div>
            </Box>

            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* Default Categories */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Default Categories
                </Typography>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {loading ? (
                        Array.from(new Array(4)).map((_, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                <CategorySkeleton />
                            </Grid>
                        ))
                    ) : (
                        defaultCategories.map((category, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={category._id}>
                                <CategoryCard
                                    category={category}
                                    index={index}
                                    isDefault={true}
                                />
                            </Grid>
                        ))
                    )}
                </Grid>
            </motion.div>

            {/* Custom Categories */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Custom Categories
                </Typography>
                <Grid container spacing={3}>
                    {loading ? (
                        Array.from(new Array(4)).map((_, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                <CategorySkeleton />
                            </Grid>
                        ))
                    ) : customCategories.length === 0 ? (
                        <Grid item xs={12}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Card
                                    sx={{
                                        p: 6,
                                        textAlign: 'center',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: 3,
                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                                    }}
                                >
                                    <motion.div
                                        animate={{
                                            y: [0, -10, 0],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: 'easeInOut'
                                        }}
                                    >
                                        <Add sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                                    </motion.div>
                                    <Typography color="text.secondary" variant="h6" sx={{ fontWeight: 500 }}>
                                        No custom categories yet. Create your first category!
                                    </Typography>
                                </Card>
                            </motion.div>
                        </Grid>
                    ) : (
                        customCategories.map((category, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={category._id}>
                                <CategoryCard
                                    category={category}
                                    index={index}
                                    isDefault={false}
                                    onEdit={handleOpenDialog}
                                    onDelete={handleDelete}
                                // Reset index for custom categories so they stagger nicely from 0
                                // or continue? Let's restart stagger for this section
                                />
                            </Grid>
                        ))
                    )}
                </Grid>
            </motion.div>

            {/* Add/Edit Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        background: theme.palette.mode === 'dark'
                            ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
                            : 'white'
                    }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    {editMode ? 'Edit Category' : 'Add New Category'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            fullWidth
                            label="Category Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />

                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                                Select Color
                            </Typography>
                            <Grid container spacing={1.5}>
                                {colors.map((color) => (
                                    <Grid item key={color}>
                                        <motion.div
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Box
                                                onClick={() => setFormData({ ...formData, color })}
                                                sx={{
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: '50%',
                                                    bgcolor: color,
                                                    cursor: 'pointer',
                                                    border: formData.color === color ? '3px solid white' : '2px solid transparent',
                                                    boxShadow: formData.color === color ? `0 0 0 2px ${color}` : 'none',
                                                    transition: 'all 0.2s',
                                                }}
                                            />
                                        </motion.div>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!formData.name}
                        sx={{
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            px: 3
                        }}
                    >
                        {editMode ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Categories;
