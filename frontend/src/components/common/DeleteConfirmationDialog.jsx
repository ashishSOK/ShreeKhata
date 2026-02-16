import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Box,
    Typography,
    useTheme
} from '@mui/material';
import { Warning, Delete } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const DeleteConfirmationDialog = ({ open, onClose, onConfirm, title, description, itemName }) => {
    const theme = useTheme();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                component: motion.div,
                initial: { opacity: 0, scale: 0.9 },
                animate: { opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: 0.9 },
                sx: {
                    borderRadius: 3,
                    background: theme.palette.mode === 'dark'
                        ? 'rgba(30, 41, 59, 0.95)'
                        : 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    maxWidth: 400,
                    width: '100%',
                    m: 2
                }
            }}
        >
            <Box sx={{ textAlign: 'center', pt: 3, pb: 1 }}>
                <Box
                    sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        bgcolor: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2
                    }}
                >
                    <Delete sx={{ fontSize: 32 }} />
                </Box>
                <DialogTitle sx={{ p: 0, mb: 1, fontWeight: 700 }}>
                    {title || 'Delete Item?'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ textAlign: 'center', color: 'text.secondary' }}>
                        {description || 'Are you sure you want to delete this item? This action cannot be undone.'}
                        {itemName && (
                            <Typography component="span" display="block" sx={{ mt: 1, fontWeight: 600, color: 'text.primary' }}>
                                "{itemName}"
                            </Typography>
                        )}
                    </DialogContentText>
                </DialogContent>
            </Box>
            <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center', gap: 1.5 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        textTransform: 'none',
                        borderColor: 'divider',
                        color: 'text.primary',
                        '&:hover': {
                            borderColor: 'text.secondary',
                            bgcolor: 'action.hover'
                        }
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="error"
                    autoFocus
                    startIcon={<Delete />}
                    sx={{
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        textTransform: 'none',
                        bgcolor: '#ef4444',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                        '&:hover': {
                            bgcolor: '#dc2626',
                            boxShadow: '0 6px 16px rgba(239, 68, 68, 0.4)'
                        }
                    }}
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmationDialog;
