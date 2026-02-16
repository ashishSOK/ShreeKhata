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
    LinearProgress,
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
    Person,
    Phone,
    ArrowBack,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import AnalyticsSignupAnimation from '../../components/auth/AnalyticsSignupAnimation';
import { useAuth } from '../../context/AuthContext';
import PageLoader from '../../components/common/PageLoader';

const Signup = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError(''); // Clear error on input change
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Name is required');
            return false;
        }
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (!formData.phone.trim()) {
            setError('Phone number is required');
            return false;
        }
        if (!formData.password || formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            // Artificial delay for smooth animation
            const result = await signup(formData);

            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.error || 'Signup failed. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const calculatePasswordStrength = (password) => {
        if (!password) return 0;
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
        if (password.match(/\d/)) strength += 25;
        if (password.match(/[^a-zA-Z\d]/)) strength += 25;
        return strength;
    };

    const passwordStrength = calculatePasswordStrength(formData.password);
    const getStrengthColor = () => {
        if (passwordStrength < 40) return '#EF4444';
        if (passwordStrength < 70) return '#F59E0B';
        return '#10B981';
    };

    return (
        <Grid container sx={{ minHeight: '100vh', bgcolor: '#FFFFFF' }}>
            {loading && <PageLoader message="Creating Account..." />}
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
                    <Box sx={{ position: 'absolute', top: 32, left: 32 }}>
                        <Button
                            startIcon={<ArrowBack />}
                            onClick={() => navigate('/')}
                            sx={{
                                color: '#64748B',
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': { color: '#111827', bgcolor: 'transparent' },
                            }}
                        >
                            Back
                        </Button>
                    </Box>

                    <Box sx={{ mb: 6 }}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 800,
                                color: '#111827',
                                mb: 2,
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Create Account 🚀
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#64748B', fontSize: '1.1rem' }}>
                            Join us and start your journey today!
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            {error && (
                                <Alert severity="error" sx={{ borderRadius: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            <TextField
                                fullWidth
                                name="name"
                                label="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person sx={{ color: '#94A3B8' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        '& fieldset': { borderColor: '#E2E8F0' },
                                        '&:hover fieldset': { borderColor: '#CBD5E1' },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#14B8A6',
                                            borderWidth: 2,
                                        },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#14B8A6' },
                                }}
                            />

                            <TextField
                                fullWidth
                                name="email"
                                type="email"
                                label="Email address"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
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
                                        '& fieldset': { borderColor: '#E2E8F0' },
                                        '&:hover fieldset': { borderColor: '#CBD5E1' },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#14B8A6',
                                            borderWidth: 2,
                                        },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#14B8A6' },
                                }}
                            />

                            <TextField
                                fullWidth
                                name="phone"
                                label="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 98765 43210"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Phone sx={{ color: '#94A3B8' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        '& fieldset': { borderColor: '#E2E8F0' },
                                        '&:hover fieldset': { borderColor: '#CBD5E1' },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#14B8A6',
                                            borderWidth: 2,
                                        },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#14B8A6' },
                                }}
                            />

                            <Box>
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
                                            '& fieldset': { borderColor: '#E2E8F0' },
                                            '&:hover fieldset': { borderColor: '#CBD5E1' },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#14B8A6',
                                                borderWidth: 2,
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#14B8A6' },
                                    }}
                                />
                                {formData.password && (
                                    <Box sx={{ mt: 1 }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={passwordStrength}
                                            sx={{
                                                height: 4,
                                                borderRadius: 2,
                                                bgcolor: '#E2E8F0',
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: getStrengthColor(),
                                                    borderRadius: 2,
                                                },
                                            }}
                                        />
                                    </Box>
                                )}
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
                                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Create Account'}
                            </Button>
                        </Stack>
                    </form>

                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: '#64748B' }}>
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                style={{
                                    color: '#14B8A6',
                                    textDecoration: 'none',
                                    fontWeight: 700,
                                }}
                            >
                                Sign In
                            </Link>
                        </Typography>
                    </Box>
                </motion.div>
            </Grid>

            {/* Right Side - Background */}
            <Grid
                item
                xs={12}
                md={6}
                sx={{
                    bgcolor: '#F3F4F6',
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
                        background: '#FFFFFF',
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
                        <AnalyticsSignupAnimation />
                    </motion.div>
                </Box>
            </Grid>
        </Grid>
    );
};

export default Signup;
