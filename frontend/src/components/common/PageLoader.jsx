import React from 'react';
import { Box, Typography, CircularProgress, Stack } from '@mui/material';
import { motion } from 'framer-motion';

const PageLoader = ({ message = 'Loading...' }) => {
    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: '#ffffff', // Pure white background
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
            }}
        >
            <Stack alignItems="center" spacing={2}>
                <Box sx={{ position: 'relative', display: 'flex' }}>
                    <CircularProgress
                        size={50}
                        thickness={4}
                        sx={{
                            color: '#6366f1', // Primary brand color
                            '& .MuiCircularProgress-circle': {
                                strokeLinecap: 'round',
                            },
                        }}
                    />
                </Box>

                <Typography
                    variant="body1"
                    sx={{
                        color: '#475569', // Slate-600 for text
                        fontWeight: 500,
                        fontSize: '1rem',
                        letterSpacing: '0.01em'
                    }}
                >
                    {message}
                </Typography>
            </Stack>
        </Box>
    );
};

export default PageLoader;
