import { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Add, Edit, Delete, Circle } from '@mui/icons-material';
import { categoryAPI } from '../services/api';
import { motion } from 'framer-motion';

const Categories = () => {
    const [categories, setCategories] = useState([]);
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
            const response = await categoryAPI.getAll();
            setCategories(response.data);
        } catch (error) {
            console.error('Error loading categories:', error);
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
            await loadCategories();
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
            await loadCategories();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError('Error deleting category');
        }
    };

    const defaultCategories = categories.filter((c) => c.isDefault);
    const customCategories = categories.filter((c) => !c.isDefault);

    return (
        <Box>
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
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Default Categories
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {defaultCategories.map((category, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={category._id}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
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
                                    transformStyle: 'preserve-3d',
                                    transform: 'perspective(1000px) rotateX(3deg) rotateY(3deg) translateZ(10px)',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: `0 8px 24px rgba(0, 0, 0, 0.25), 0 2px 8px ${category.color}25`,
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
                                        transform: 'perspective(1000px) rotateX(-5deg) rotateY(-5deg) translateZ(25px) scale(1.03)',
                                        boxShadow: `0 16px 40px rgba(0, 0, 0, 0.35), 0 8px 20px ${category.color}45`,
                                        border: `1px solid ${category.color}50`,
                                    },
                                }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.15, rotate: 10 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <Circle
                                        sx={{
                                            color: category.color,
                                            fontSize: 36,
                                            filter: `drop-shadow(0 4px 12px ${category.color}60)`,
                                        }}
                                    />
                                </motion.div>
                                <Box sx={{ flex: 1, position: 'relative', zIndex: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                                        {category.name}
                                    </Typography>
                                    <Chip
                                        label="Default"
                                        size="small"
                                        sx={{
                                            bgcolor: `${category.color}20`,
                                            color: category.color,
                                            fontWeight: 600,
                                            border: `1px solid ${category.color}40`,
                                        }}
                                    />
                                </Box>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>

            {/* Custom Categories */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Custom Categories
            </Typography>
            <Grid container spacing={3}>
                {customCategories.length === 0 ? (
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
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: (defaultCategories.length + index) * 0.1, duration: 0.5 }}
                                style={{ height: '100%' }}
                            >
                                <Card
                                    sx={{
                                        p: 2.5,
                                        height: '100%',
                                        background: `linear-gradient(135deg, ${category.color}15 0%, ${category.color}05 100%)`,
                                        backdropFilter: 'blur(10px)',
                                        border: `1px solid ${category.color}30`,
                                        borderRadius: 3,
                                        position: 'relative',
                                        overflow: 'hidden',
                                        transformStyle: 'preserve-3d',
                                        transform: 'perspective(1000px) rotateX(3deg) rotateY(3deg) translateZ(10px)',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        boxShadow: `0 8px 24px rgba(0, 0, 0, 0.25), 0 2px 8px ${category.color}25`,
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
                                            transform: 'perspective(1000px) rotateX(-5deg) rotateY(-5deg) translateZ(25px) scale(1.03)',
                                            boxShadow: `0 16px 40px rgba(0, 0, 0, 0.35), 0 8px 20px ${category.color}45`,
                                            border: `1px solid ${category.color}50`,
                                        },
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, position: 'relative', zIndex: 1 }}>
                                        <motion.div
                                            whileHover={{ scale: 1.15, rotate: 10 }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                        >
                                            <Circle
                                                sx={{
                                                    color: category.color,
                                                    fontSize: 36,
                                                    filter: `drop-shadow(0 4px 12px ${category.color}60)`,
                                                }}
                                            />
                                        </motion.div>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, flex: 1 }}>
                                            {category.name}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1, position: 'relative', zIndex: 1 }}>
                                        <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleOpenDialog(category)}
                                                sx={{
                                                    bgcolor: `${category.color}20`,
                                                    color: category.color,
                                                    border: `1px solid ${category.color}30`,
                                                    '&:hover': {
                                                        bgcolor: `${category.color}30`,
                                                    },
                                                }}
                                            >
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </motion.div>
                                        <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(category._id)}
                                                sx={{
                                                    bgcolor: 'rgba(239, 68, 68, 0.15)',
                                                    color: '#ef4444',
                                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                                    '&:hover': {
                                                        bgcolor: 'rgba(239, 68, 68, 0.25)',
                                                    },
                                                }}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </motion.div>
                                    </Box>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))
                )}
            </Grid>

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
                <DialogTitle>
                    {editMode ? 'Edit Category' : 'Add New Category'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Category Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />

                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Select Color
                            </Typography>
                            <Grid container spacing={1}>
                                {colors.map((color) => (
                                    <Grid item key={color}>
                                        <IconButton
                                            onClick={() => setFormData({ ...formData, color })}
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                bgcolor: color,
                                                border: formData.color === color ? '3px solid' : 'none',
                                                borderColor: 'white',
                                                boxShadow: formData.color === color ? '0 0 0 2px ' + color : 'none',
                                                '&:hover': {
                                                    bgcolor: color,
                                                    opacity: 0.8,
                                                },
                                            }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!formData.name}
                        sx={{
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        }}
                    >
                        {editMode ? 'Update' : 'Add Category'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Categories;
