import { Box, Typography, Stack, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#ffffff', // Pure white background
                zIndex: 9999,
            }}
        >
            <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Stack alignItems="center" spacing={3}>
                    <Box sx={{ position: 'relative', display: 'flex' }}>
                        <CircularProgress
                            size={60}
                            thickness={4}
                            sx={{
                                color: '#6366f1', // Primary brand color
                                '& .MuiCircularProgress-circle': {
                                    strokeLinecap: 'round',
                                },
                            }}
                        />
                    </Box>

                    <Box sx={{ textAlign: 'center' }}>
                        <Typography
                            variant="h5"
                            sx={{
                                color: '#1e293b',
                                fontWeight: 700,
                                mb: 1,
                                letterSpacing: '-0.02em'
                            }}
                        >
                            ShreeKhata
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#64748b',
                                fontWeight: 500,
                            }}
                        >
                            Loading your financial world...
                        </Typography>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
};

export default LoadingScreen;
