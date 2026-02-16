import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    InputAdornment,
    IconButton,
    Checkbox,
    FormControlLabel,
    Stack,
    Grid,
    Alert,
    CircularProgress,
} from '@mui/material';
import {
    Email,
    Lock,
    Visibility,
    VisibilityOff,
    Google,
    ArrowBack,
    Brightness4,
    Brightness7,
} from '@mui/icons-material';
import { useThemeMode } from '../../theme/ThemeProvider';
import { motion } from 'framer-motion';
import LoginAnimation from '../../components/auth/LoginAnimation';
import { useAuth } from '../../context/AuthContext';
import PageLoader from '../../components/common/PageLoader';

const Login = () => {
    const navigate = useNavigate();
    const { mode, toggleTheme } = useThemeMode();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'rememberMe' ? checked : value,
        }));
        setError(''); // Clear error on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Artificial delay for smooth animation
            const result = await login(formData.email, formData.password);

            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.error || 'Login failed. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Grid container sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {loading && <PageLoader message="Signing In..." />}
            {/* Left Side - Form */}
            <Grid
                item
                xs={12}
                md={6}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    p: { xs: 4, md: 8, lg: 12 },
                    position: 'relative',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Box sx={{ position: 'absolute', top: 32, left: 32, display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Button
                            startIcon={<ArrowBack />}
                            onClick={() => navigate('/')}
                            sx={{
                                color: 'text.secondary',
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': { color: 'text.primary', bgcolor: 'transparent' },
                            }}
                        >
                            Back
                        </Button>
                        <IconButton onClick={toggleTheme} sx={{ color: 'text.primary' }}>
                            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>
                    </Box>

                    <Box sx={{ mb: 6 }}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 800,
                                color: 'text.primary',
                                mb: 2,
                                letterSpacing: '-0.02em',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                            }}
                        >
                            Holla,
                            <br />
                            Welcome Back! 👋
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                            Hey, welcome back to your special place
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={4}>
                            {error && (
                                <Alert severity="error" sx={{ borderRadius: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            <TextField
                                fullWidth
                                name="email"
                                type="email"
                                label="Email address"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="stanley@gmail.com"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email sx={{ color: '#94A3B8' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        backgroundColor: 'background.paper',
                                        '& fieldset': { borderColor: 'divider' },
                                        '&:hover fieldset': { borderColor: 'text.secondary' },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'primary.main',
                                            borderWidth: 2,
                                        },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' },
                                }}
                            />

                            <TextField
                                fullWidth
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                label="Password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••••••"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock sx={{ color: '#94A3B8' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                sx={{ color: '#94A3B8' }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        backgroundColor: 'background.paper',
                                        '& fieldset': { borderColor: 'divider' },
                                        '&:hover fieldset': { borderColor: 'text.secondary' },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'primary.main',
                                            borderWidth: 2,
                                        },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' },
                                }}
                            />

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="rememberMe"
                                            checked={formData.rememberMe}
                                            onChange={handleChange}
                                            sx={{
                                                color: '#CBD5E1',
                                                '&.Mui-checked': { color: '#14B8A6' },
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                            Remember me
                                        </Typography>
                                    }
                                />
                                <Link
                                    to="/forgot-password"
                                    style={{
                                        color: 'text.secondary',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                    }}
                                >
                                    Forgot Password?
                                </Link>
                            </Box>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{
                                    py: 2,
                                    background: 'linear-gradient(135deg, #14B8A6 0%, #10B981 100%)',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    borderRadius: 3,
                                    boxShadow: '0 10px 30px rgba(20, 184, 166, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #0D9488 0%, #059669 100%)',
                                        boxShadow: '0 15px 35px rgba(20, 184, 166, 0.4)',
                                    },
                                    '&:disabled': {
                                        background: '#CBD5E1',
                                    },
                                }}
                            >
                                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign In'}
                            </Button>

                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<Google />}
                                sx={{
                                    py: 1.5,
                                    borderColor: '#E2E8F0',
                                    color: '#334155',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderRadius: 3,
                                    '&:hover': {
                                        borderColor: '#CBD5E1',
                                        bgcolor: '#F8FAFC',
                                    },
                                }}
                            >
                                Sign in with Google
                            </Button>
                        </Stack>
                    </form>

                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Don't have an account?{' '}
                            <Link
                                to="/signup"
                                style={{
                                    color: '#14B8A6',
                                    textDecoration: 'none',
                                    fontWeight: 700,
                                }}
                            >
                                Sign Up
                            </Link>
                        </Typography>
                    </Box>
                </motion.div>
            </Grid>

            {/* Right Side - Illustration */}
            <Grid
                item
                xs={12}
                md={6}
                sx={{
                    bgcolor: 'background.paper',
                    display: { xs: 'none', md: 'flex' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'background.paper',
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <LoginAnimation />
                    </motion.div>
                </Box>
            </Grid>
        </Grid>
    );
};

export default Login;
