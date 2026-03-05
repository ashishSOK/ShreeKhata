import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Typography,
    InputAdornment,
    IconButton,
    LinearProgress,
    Stack,
    Grid,
    Alert,
    CircularProgress,
    Paper,
    Autocomplete,
} from '@mui/material';
import {
    Email,
    Lock,
    Visibility,
    VisibilityOff,
    Person,
    Phone,
    ArrowBack,
    Brightness4,
    Brightness7,
    Store,
    Group,
    CheckCircle,
    Search,
} from '@mui/icons-material';
import { useThemeMode } from '../../theme/ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';
import AnalyticsSignupAnimation from '../../components/auth/AnalyticsSignupAnimation';
import { useAuth } from '../../context/AuthContext';
import PageLoader from '../../components/common/PageLoader';
import { authAPI } from '../../services/api';

const ROLES = [
    {
        key: 'owner',
        label: 'Owner',
        desc: 'I own a shop/business and want to manage my finances',
        icon: <Store sx={{ fontSize: 32 }} />,
        gradient: 'linear-gradient(135deg, #14B8A6 0%, #10B981 100%)',
        shadow: 'rgba(20, 184, 166, 0.3)',
    },
    {
        key: 'member',
        label: 'Member',
        desc: "I am staff/employee and want to join an owner's account",
        icon: <Group sx={{ fontSize: 32 }} />,
        gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        shadow: 'rgba(99, 102, 241, 0.3)',
    },
];

const inputSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        backgroundColor: 'background.paper',
        '& fieldset': { borderColor: 'divider' },
        '&:hover fieldset': { borderColor: 'text.secondary' },
        '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: 2 },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' },
};

const Signup = () => {
    const navigate = useNavigate();
    const { mode, toggleTheme } = useThemeMode();
    const { signup } = useAuth();

    // Step 0 = choose role, Step 1 = fill form, Step 2 = success (member)
    const [step, setStep] = useState(0);
    const [role, setRole] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Owner search state
    const [ownerSearch, setOwnerSearch] = useState('');
    const [owners, setOwners] = useState([]);
    const [ownerSearchLoading, setOwnerSearchLoading] = useState(false);
    const [selectedOwner, setSelectedOwner] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        shopName: '',
    });

    // Search for owners as user types
    useEffect(() => {
        if (role !== 'member') return;
        const timer = setTimeout(async () => {
            try {
                setOwnerSearchLoading(true);
                const res = await authAPI.searchOwners(ownerSearch);
                setOwners(res.data || []);
            } catch {
                setOwners([]);
            } finally {
                setOwnerSearchLoading(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [ownerSearch, role]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError('');
    };

    const validate = () => {
        if (!formData.name.trim()) { setError('Name is required'); return false; }
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Please enter a valid email'); return false;
        }
        if (!formData.phone.trim()) { setError('Phone number is required'); return false; }
        if (!formData.password || formData.password.length < 6) {
            setError('Password must be at least 6 characters'); return false;
        }
        if (role === 'member' && !selectedOwner) {
            setError('Please select an owner to join'); return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validate()) return;
        setLoading(true);
        try {
            const payload = {
                ...formData,
                role,
                ...(role === 'member' && { ownerId: selectedOwner._id }),
            };
            const result = await signup(payload);
            if (result.success) {
                if (role === 'member') {
                    setStep(2);
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError(result.error || 'Signup failed. Please try again.');
            }
        } catch {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const calcPasswordStrength = (pw) => {
        if (!pw) return 0;
        let s = 0;
        if (pw.length >= 8) s += 25;
        if (pw.match(/[a-z]/) && pw.match(/[A-Z]/)) s += 25;
        if (pw.match(/\d/)) s += 25;
        if (pw.match(/[^a-zA-Z\d]/)) s += 25;
        return s;
    };
    const pwStrength = calcPasswordStrength(formData.password);
    const pwColor = pwStrength < 40 ? '#EF4444' : pwStrength < 70 ? '#F59E0B' : '#10B981';

    return (
        <Grid container sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {loading && <PageLoader message="Creating Account..." />}

            {/* Left Side - Form */}
            <Grid
                item xs={12} md={6}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    p: { xs: 4, md: 8, lg: 12 },
                    position: 'relative',
                }}
            >
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                    {/* Top nav */}
                    <Box sx={{ position: 'absolute', top: 32, left: 32, display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Button
                            startIcon={<ArrowBack />}
                            onClick={() => step === 0 ? navigate('/') : setStep(0)}
                            sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 600, '&:hover': { color: 'text.primary', bgcolor: 'transparent' } }}
                        >
                            {step === 0 ? 'Back' : 'Choose Role'}
                        </Button>
                        <IconButton onClick={toggleTheme} sx={{ color: 'text.primary' }}>
                            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>
                    </Box>

                    <AnimatePresence mode="wait">

                        {/* Step 0: Role Selection */}
                        {step === 0 && (
                            <motion.div key="step0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>
                                <Box sx={{ mb: 5 }}>
                                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', mb: 2, letterSpacing: '-0.02em' }}>
                                        Join ShreeKhata 🚀
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                                        How would you like to sign up?
                                    </Typography>
                                </Box>

                                <Stack spacing={3}>
                                    {ROLES.map((r) => (
                                        <Paper
                                            key={r.key}
                                            onClick={() => { setRole(r.key); setStep(1); }}
                                            elevation={0}
                                            sx={{
                                                p: 3,
                                                borderRadius: 3,
                                                cursor: 'pointer',
                                                border: '2px solid',
                                                borderColor: 'divider',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2.5,
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    borderColor: r.key === 'owner' ? '#14B8A6' : '#6366F1',
                                                    boxShadow: `0 8px 30px ${r.shadow}`,
                                                    transform: 'translateY(-2px)',
                                                },
                                            }}
                                        >
                                            <Box sx={{
                                                width: 56, height: 56, borderRadius: 2.5,
                                                background: r.gradient,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'white', flexShrink: 0,
                                                boxShadow: `0 8px 20px ${r.shadow}`,
                                            }}>
                                                {r.icon}
                                            </Box>
                                            <Box>
                                                <Typography variant="h6" fontWeight={700}>{r.label}</Typography>
                                                <Typography variant="body2" color="text.secondary">{r.desc}</Typography>
                                            </Box>
                                        </Paper>
                                    ))}
                                </Stack>

                                <Box sx={{ mt: 4, textAlign: 'center' }}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Already have an account?{' '}
                                        <Link to="/login" style={{ color: '#14B8A6', textDecoration: 'none', fontWeight: 700 }}>Sign In</Link>
                                    </Typography>
                                </Box>
                            </motion.div>
                        )}

                        {/* Step 1: Signup Form */}
                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>
                                <Box sx={{ mb: 5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                        <Box sx={{
                                            px: 1.5, py: 0.5, borderRadius: 99,
                                            background: role === 'member' ? 'linear-gradient(135deg,#6366F1,#8B5CF6)' : 'linear-gradient(135deg,#14B8A6,#10B981)',
                                            color: 'white', fontSize: '0.75rem', fontWeight: 700,
                                        }}>
                                            {role === 'member' ? 'MEMBER' : 'OWNER'}
                                        </Box>
                                    </Box>
                                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
                                        Create Account 🚀
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
                                        {role === 'member' ? "Join your owner's ShreeKhata account" : 'Start managing your business finances'}
                                    </Typography>
                                </Box>

                                <form onSubmit={handleSubmit}>
                                    <Stack spacing={3}>
                                        {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

                                        {/* Owner search (member only) */}
                                        {role === 'member' && (
                                            <Autocomplete
                                                options={owners}
                                                getOptionLabel={(opt) => opt.shopName ? `${opt.name} — ${opt.shopName}` : opt.name}
                                                loading={ownerSearchLoading}
                                                onInputChange={(_, v) => setOwnerSearch(v)}
                                                onChange={(_, v) => setSelectedOwner(v)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Search Owner / Shop Name"
                                                        placeholder="Type to search owners..."
                                                        sx={inputSx}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            startAdornment: (
                                                                <>
                                                                    <InputAdornment position="start">
                                                                        <Search sx={{ color: '#94A3B8' }} />
                                                                    </InputAdornment>
                                                                    {params.InputProps.startAdornment}
                                                                </>
                                                            ),
                                                        }}
                                                    />
                                                )}
                                            />
                                        )}

                                        <TextField fullWidth name="name" label="Full Name" value={formData.name} onChange={handleChange} placeholder="John Doe"
                                            InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ color: '#94A3B8' }} /></InputAdornment> }}
                                            sx={inputSx} />

                                        <TextField fullWidth name="email" type="email" label="Email address" value={formData.email} onChange={handleChange} placeholder="you@example.com"
                                            InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: '#94A3B8' }} /></InputAdornment> }}
                                            sx={inputSx} />

                                        <TextField fullWidth name="phone" label="Phone Number" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210"
                                            InputProps={{ startAdornment: <InputAdornment position="start"><Phone sx={{ color: '#94A3B8' }} /></InputAdornment> }}
                                            sx={inputSx} />

                                        {role === 'owner' && (
                                            <TextField fullWidth name="shopName" label="Shop / Business Name (optional)" value={formData.shopName} onChange={handleChange}
                                                InputProps={{ startAdornment: <InputAdornment position="start"><Store sx={{ color: '#94A3B8' }} /></InputAdornment> }}
                                                sx={inputSx} />
                                        )}

                                        <Box>
                                            <TextField fullWidth name="password" type={showPassword ? 'text' : 'password'} label="Password"
                                                value={formData.password} onChange={handleChange} placeholder="••••••••••••"
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start"><Lock sx={{ color: '#94A3B8' }} /></InputAdornment>,
                                                    endAdornment: <InputAdornment position="end">
                                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#94A3B8' }}>
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }}
                                                sx={inputSx} />
                                            {formData.password && (
                                                <Box sx={{ mt: 1 }}>
                                                    <LinearProgress variant="determinate" value={pwStrength}
                                                        sx={{ height: 4, borderRadius: 2, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: pwColor, borderRadius: 2 } }} />
                                                </Box>
                                            )}
                                        </Box>

                                        <Button type="submit" fullWidth variant="contained" size="large" disabled={loading}
                                            sx={{
                                                py: 2,
                                                background: role === 'member'
                                                    ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
                                                    : 'linear-gradient(135deg, #14B8A6 0%, #10B981 100%)',
                                                textTransform: 'none', fontWeight: 700, fontSize: '1rem', borderRadius: 3,
                                                boxShadow: role === 'member' ? '0 10px 30px rgba(99,102,241,0.3)' : '0 10px 30px rgba(20,184,166,0.3)',
                                                '&:hover': {
                                                    background: role === 'member'
                                                        ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)'
                                                        : 'linear-gradient(135deg, #0D9488 0%, #059669 100%)',
                                                },
                                                '&:disabled': { background: '#CBD5E1' },
                                            }}>
                                            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> :
                                                role === 'member' ? 'Send Join Request' : 'Create Account'}
                                        </Button>
                                    </Stack>
                                </form>

                                <Box sx={{ mt: 4, textAlign: 'center' }}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Already have an account?{' '}
                                        <Link to="/login" style={{ color: '#14B8A6', textDecoration: 'none', fontWeight: 700 }}>Sign In</Link>
                                    </Typography>
                                </Box>
                            </motion.div>
                        )}

                        {/* Step 2: Pending Approval */}
                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Box sx={{
                                        width: 100, height: 100, borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        mx: 'auto', mb: 3,
                                        boxShadow: '0 20px 40px rgba(99,102,241,0.3)',
                                    }}>
                                        <CheckCircle sx={{ color: 'white', fontSize: 48 }} />
                                    </Box>
                                    <Typography variant="h4" fontWeight={800} gutterBottom>Request Sent! 🎉</Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                                        Your join request has been sent to
                                    </Typography>
                                    <Typography variant="h6" fontWeight={700} gutterBottom>
                                        {selectedOwner?.shopName || selectedOwner?.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                                        The owner will approve you shortly. You will get full access once approved.
                                    </Typography>
                                    <Button variant="contained" onClick={() => navigate('/login')}
                                        sx={{
                                            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                                            borderRadius: 3, textTransform: 'none', fontWeight: 700, px: 4, py: 1.5,
                                        }}>
                                        Go to Login
                                    </Button>
                                </Box>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </motion.div>
            </Grid>

            {/* Right Side - Animation */}
            <Grid item xs={12} md={6} sx={{ bgcolor: 'background.paper', display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
                        style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <AnalyticsSignupAnimation />
                    </motion.div>
                </Box>
            </Grid>
        </Grid>
    );
};

export default Signup;
