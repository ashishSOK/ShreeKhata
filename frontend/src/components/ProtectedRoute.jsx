import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Box,
    CircularProgress,
    Typography,
    Button,
    Paper
} from '@mui/material';
import { HourglassEmpty, Logout } from '@mui/icons-material';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading, isPending, logout, user } = useAuth();

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
            >
                <CircularProgress size={60} sx={{ color: 'white' }} />
            </Box>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/welcome" replace />;
    }

    // Block pending members from accessing the app
    if (isPending) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    p: 3
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 4, md: 6 },
                        borderRadius: 4,
                        maxWidth: 480,
                        textAlign: 'center',
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 3,
                        }}
                    >
                        <HourglassEmpty sx={{ color: 'white', fontSize: 36 }} />
                    </Box>
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                        Approval Pending ⏳
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                        Hi <strong>{user?.name}</strong>! Your join request has been sent.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                        The shop owner will review your request shortly.
                        You'll be able to access the app once approved.
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<Logout />}
                        onClick={logout}
                        sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
                    >
                        Sign Out
                    </Button>
                </Paper>
            </Box>
        );
    }

    return children;
};

export default ProtectedRoute;
