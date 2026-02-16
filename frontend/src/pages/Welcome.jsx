import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Typography,
    Container,
    Grid,
    AppBar,
    Toolbar,
    Avatar,
    Stack,
    Card,
    CardContent,
    IconButton,
} from '@mui/material';
import {
    ArrowForward,
    AccountBalanceWallet,
    TrendingUp,
    Security,
    Speed,
    CloudUpload,
    Analytics,
    CheckCircle,
    Star,
    Brightness4,
    Brightness7,
} from '@mui/icons-material';
import { useThemeMode } from '../theme/ThemeProvider';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { keyframes } from '@mui/system';

// Keyframe animations
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotateX(50deg) rotateZ(-45deg); }
  50% { transform: translateY(-15px) rotateX(50deg) rotateZ(-45deg); }
`;

const Welcome = () => {
    const navigate = useNavigate();
    const { mode, toggleTheme } = useThemeMode();
    const theme = useTheme();

    // Mouse tracking for 3D parallax effect
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 15; // -7.5 to 7.5 degrees
            const y = (e.clientY / window.innerHeight - 0.5) * 15;
            setMousePosition({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const features = [
        {
            icon: <AccountBalanceWallet sx={{ fontSize: 40, color: '#14B8A6' }} />,
            title: 'Smart Ledger Management',
            description: 'Track all your transactions with ease. Categorize, filter, and manage your financial records effortlessly.',
        },
        {
            icon: <TrendingUp sx={{ fontSize: 40, color: '#10B981' }} />,
            title: 'Real-time Analytics',
            description: 'Get instant insights into your spending patterns with beautiful charts and comprehensive reports.',
        },
        {
            icon: <Security sx={{ fontSize: 40, color: '#3B82F6' }} />,
            title: 'Bank-level Security',
            description: 'Your data is encrypted and secure. We use industry-standard security practices to protect your information.',
        },
        {
            icon: <Speed sx={{ fontSize: 40, color: '#F59E0B' }} />,
            title: 'Lightning Fast',
            description: 'Built with modern technology for optimal performance. Access your data instantly, anytime.',
        },
        {
            icon: <CloudUpload sx={{ fontSize: 40, color: '#8B5CF6' }} />,
            title: 'Receipt Upload',
            description: 'Upload and attach receipts to your transactions. Keep all your financial documents in one place.',
        },
        {
            icon: <Analytics sx={{ fontSize: 40, color: '#EC4899' }} />,
            title: 'Detailed Reports',
            description: 'Generate monthly, category, and vendor reports. Export to PDF or Excel with one click.',
        },
    ];

    const useCases = [
        {
            title: 'Small Business Owners',
            description: 'Perfect for tracking business expenses, managing vendor payments, and generating financial reports.',
            color: '#14B8A6',
        },
        {
            title: 'Freelancers',
            description: 'Keep track of project expenses, client payments, and manage your financial health with ease.',
            color: '#10B981',
        },
        {
            title: 'Personal Finance',
            description: 'Monitor your daily expenses, set budgets, and achieve your financial goals.',
            color: '#3B82F6',
        },
    ];

    const steps = [
        { number: '01', title: 'Sign Up', description: 'Create your free account in seconds' },
        { number: '02', title: 'Add Transactions', description: 'Record your income and expenses' },
        { number: '03', title: 'Categorize', description: 'Organize with custom categories' },
        { number: '04', title: 'Analyze', description: 'Get insights from beautiful reports' },
    ];

    const testimonials = [
        {
            name: 'Priya Sharma',
            role: 'Small Business Owner',
            comment: 'ShreeKhata has transformed how I manage my business finances. The reports are incredibly detailed!',
            rating: 5,
        },
        {
            name: 'Rahul Verma',
            role: 'Freelance Designer',
            comment: 'Simple, elegant, and powerful. Exactly what I needed to track my project expenses.',
            rating: 5,
        },
        {
            name: 'Anita Desai',
            role: 'Entrepreneur',
            comment: 'The best ledger app I\'ve used. The interface is beautiful and it\'s so easy to use!',
            rating: 5,
        },
    ];

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', overflowX: 'hidden' }}>
            {/* Header */}
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    bgcolor: mode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: 1,
                    borderColor: 'divider',
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar sx={{ justifyContent: 'space-between', py: 2, px: 0 }}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                    sx={{
                                        width: 38,
                                        height: 38,
                                        background: 'linear-gradient(135deg, #14B8A6 0%, #10B981 100%)',
                                        fontSize: '1rem',
                                        fontWeight: 900,
                                    }}
                                >
                                    SK
                                </Avatar>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 800,
                                        color: 'text.primary',
                                        fontSize: '1.4rem',
                                        letterSpacing: '-0.02em',
                                    }}
                                >
                                    ShreeKhata
                                </Typography>
                            </Box>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                                    <Button
                                        onClick={() => scrollToSection('use-cases')}
                                        sx={{
                                            px: 2.5,
                                            py: 1,
                                            color: 'text.secondary',
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            fontSize: '0.95rem',
                                            '&:hover': { bgcolor: 'transparent', color: 'text.primary' },
                                        }}
                                    >
                                        Use Cases
                                    </Button>
                                    <Button
                                        onClick={() => scrollToSection('features')}
                                        sx={{
                                            px: 2.5,
                                            py: 1,
                                            color: 'text.secondary',
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            fontSize: '0.95rem',
                                            '&:hover': { bgcolor: 'transparent', color: 'text.primary' },
                                        }}
                                    >
                                        Features
                                    </Button>
                                    <Button
                                        onClick={() => scrollToSection('how-it-works')}
                                        sx={{
                                            px: 2.5,
                                            py: 1,
                                            color: 'text.secondary',
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            fontSize: '0.95rem',
                                            '&:hover': { bgcolor: 'transparent', color: 'text.primary' },
                                        }}
                                    >
                                        How it works
                                    </Button>
                                    <Button
                                        onClick={() => scrollToSection('testimonials')}
                                        sx={{
                                            px: 2.5,
                                            py: 1,
                                            color: 'text.secondary',
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            fontSize: '0.95rem',
                                            '&:hover': { bgcolor: 'transparent', color: 'text.primary' },
                                        }}
                                    >
                                        Testimonials
                                    </Button>
                                </Box>

                                {/* Theme Toggle */}
                                <IconButton onClick={toggleTheme} sx={{ color: 'text.primary', ml: 1 }}>
                                    {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                                </IconButton>

                                <Button
                                    onClick={() => navigate('/login')}
                                    sx={{
                                        px: { xs: 2, md: 3 },
                                        py: 1,
                                        ml: { xs: 0, md: 1 },
                                        color: 'text.primary',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        fontSize: '0.95rem',
                                        '&:hover': { bgcolor: 'action.hover' },
                                    }}
                                >
                                    Login
                                </Button>
                                <Button
                                    onClick={() => navigate('/signup')}
                                    endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
                                    sx={{
                                        px: { xs: 2, md: 3 },
                                        py: 1.25,
                                        ml: 1,
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        fontWeight: 700,
                                        textTransform: 'none',
                                        fontSize: '0.95rem',
                                        borderRadius: 1.5,
                                        boxShadow: 'none',
                                        '&:hover': {
                                            bgcolor: 'primary.dark',
                                            boxShadow: 'none',
                                        },
                                    }}
                                >
                                    Get Started
                                </Button>
                            </Stack>
                        </motion.div>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Hero Section with 3D Perspective */}
            <Box
                sx={{
                    pt: { xs: 4, md: 6 },
                    pb: { xs: 8, md: 12 },
                    perspective: '2000px',
                    perspectiveOrigin: 'center center',
                }}
            >
                <Container maxWidth="xl">
                    <Box
                        sx={{
                            transformStyle: 'preserve-3d',
                            transform: `rotateY(${mousePosition.x * 0.5}deg) rotateX(${-mousePosition.y * 0.5}deg)`,
                            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                    >
                        <Grid container spacing={8} alignItems="center">
                            {/* Left: Content */}
                            <Grid item xs={12} md={6}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <Typography
                                        variant="h1"
                                        sx={{
                                            fontSize: { xs: '2.75rem', md: '4rem' },
                                            fontWeight: 500,
                                            color: 'text.primary',
                                            mb: 3.5,
                                            lineHeight: 1.2,
                                            letterSpacing: '-0.03em',
                                        }}
                                    >
                                        Digital Ledger
                                        <br />
                                        Infrastructure Powering
                                        <br />
                                        Modern Businesses
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: 'text.secondary',
                                            mb: 4.5,
                                            fontSize: '1.05rem',
                                            lineHeight: 1.7,
                                            maxWidth: 520,
                                        }}
                                    >
                                        Infrastructure powering modern, stablecoin-powered payment experiences for
                                        businesses, fintechs, wallets, treasuries and more.
                                    </Typography>
                                    <Stack direction="row" spacing={2}>
                                        <Button
                                            onClick={() => navigate('/signup')}
                                            endIcon={<ArrowForward sx={{ fontSize: 18 }} />}
                                            sx={{
                                                px: 4,
                                                py: 1.75,
                                                bgcolor: '#14B8A6',
                                                color: 'white',
                                                fontWeight: 700,
                                                textTransform: 'none',
                                                fontSize: '1rem',
                                                borderRadius: 1.5,
                                                boxShadow: 'none',
                                                '&:hover': {
                                                    bgcolor: '#0D9488',
                                                    boxShadow: 'none',
                                                },
                                            }}
                                        >
                                            Get Started
                                        </Button>
                                        <Button
                                            onClick={() => scrollToSection('features')}
                                            sx={{
                                                px: 4,
                                                py: 1.75,
                                                color: 'text.primary',
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                fontSize: '1rem',
                                                borderRadius: 1.5,
                                                border: '1.5px solid',
                                                borderColor: 'divider',
                                                '&:hover': {
                                                    bgcolor: 'action.hover',
                                                    borderColor: 'text.secondary',
                                                },
                                            }}
                                        >
                                            Learn More
                                        </Button>
                                    </Stack>
                                </motion.div>
                            </Grid>

                            {/* Right: Isometric Illustration */}
                            <Grid item xs={12} md={6}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: { xs: 450, md: 600 },
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        perspective: '1000px',
                                    }}
                                >
                                    {/* Node 1 - Top Left with 3D Orbit */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                            y: [0, -15, 0],
                                            rotateY: [0, 360],
                                            rotateX: [0, 15, 0],
                                        }}
                                        transition={{
                                            opacity: { duration: 0.6, delay: 0.3 },
                                            scale: { duration: 0.6, delay: 0.3, type: 'spring', stiffness: 200 },
                                            y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                                            rotateY: { duration: 8, repeat: Infinity, ease: 'linear' },
                                            rotateX: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                                        }}
                                        style={{
                                            position: 'absolute',
                                            left: '8%',
                                            top: '8%',
                                            transformStyle: 'preserve-3d',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 110,
                                                height: 110,
                                                position: 'relative',
                                                transformStyle: 'preserve-3d',
                                                transform: 'translateZ(30px)',
                                            }}
                                        >
                                            {/* Platform base */}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: 50,
                                                    bottom: 0,
                                                    background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
                                                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                                    boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
                                                }}
                                            />
                                            {/* Coin on top */}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    width: 45,
                                                    height: 45,
                                                    top: 0,
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
                                                    border: '3px solid #3B82F6',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.3rem',
                                                    fontWeight: 900,
                                                    color: '#1E40AF',
                                                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                                                }}
                                            >
                                                ₹
                                            </Box>
                                        </Box>
                                    </motion.div>

                                    {/* Node 2 - Top Right with 3D Orbit */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                            y: [0, -20, 0],
                                            rotateY: [0, -360],
                                            rotateZ: [0, 10, 0],
                                        }}
                                        transition={{
                                            opacity: { duration: 0.6, delay: 0.5 },
                                            scale: { duration: 0.6, delay: 0.5, type: 'spring', stiffness: 200 },
                                            y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
                                            rotateY: { duration: 10, repeat: Infinity, ease: 'linear' },
                                            rotateZ: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
                                        }}
                                        style={{
                                            position: 'absolute',
                                            right: '8%',
                                            top: '5%',
                                            transformStyle: 'preserve-3d',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 110,
                                                height: 110,
                                                position: 'relative',
                                                transformStyle: 'preserve-3d',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: 50,
                                                    bottom: 0,
                                                    background: mode === 'dark'
                                                        ? 'linear-gradient(135deg, #374151 0%, #1F2937 100%)'
                                                        : 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
                                                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                                    boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    width: 45,
                                                    height: 45,
                                                    top: 0,
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
                                                    border: '3px solid #10B981',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.3rem',
                                                    fontWeight: 900,
                                                    color: '#065F46',
                                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                                                }}
                                            >
                                                $
                                            </Box>
                                        </Box>
                                    </motion.div>

                                    {/* Node 3 - Center - Animated Chart */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.6, delay: 0.1 }}
                                    >
                                        <Box
                                            sx={{
                                                width: 140,
                                                height: 140,
                                                position: 'relative',
                                                animation: `${float} 5s ease-in-out infinite`,
                                                transformStyle: 'preserve-3d',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: 65,
                                                    bottom: 0,
                                                    background: mode === 'dark'
                                                        ? 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)'
                                                        : 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
                                                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                                    boxShadow: '0 12px 30px rgba(20, 184, 166, 0.15)',
                                                    border: '2px solid',
                                                    borderColor: 'divider',
                                                    padding: '18px 12px 8px',
                                                    display: 'flex',
                                                    alignItems: 'flex-end',
                                                    justifyContent: 'center',
                                                    gap: '6px',
                                                }}
                                            >
                                                {/* Mini Bar Chart */}
                                                {[30, 50, 35, 60].map((height, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{ scaleY: 0 }}
                                                        animate={{ scaleY: 1 }}
                                                        transition={{
                                                            duration: 0.8,
                                                            delay: 0.5 + idx * 0.1,
                                                            repeat: Infinity,
                                                            repeatDelay: 3,
                                                        }}
                                                        style={{
                                                            width: 8,
                                                            height: `${height}px`,
                                                            background: idx === 3
                                                                ? 'linear-gradient(180deg, #14B8A6 0%, #0D9488 100%)'
                                                                : 'linear-gradient(180deg, #6EE7B7 0%, #34D399 100%)',
                                                            borderRadius: '2px 2px 0 0',
                                                            transformOrigin: 'bottom',
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                            {/* Floating Badge */}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    width: 48,
                                                    height: 48,
                                                    top: -8,
                                                    right: -8,
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, #14B8A6 0%, #10B981 100%)',
                                                    border: '3px solid white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.2rem',
                                                    color: 'white',
                                                    boxShadow: '0 6px 20px rgba(20, 184, 166, 0.4)',
                                                }}
                                            >
                                                📊
                                            </Box>
                                        </Box>
                                    </motion.div>

                                    {/* Node 4 - Bottom Left */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: 0.4 }}
                                        style={{
                                            position: 'absolute',
                                            left: '12%',
                                            bottom: '8%',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 105,
                                                height: 105,
                                                position: 'relative',
                                                animation: `${float} 4.2s ease-in-out infinite`,
                                                animationDelay: '1s',
                                                transformStyle: 'preserve-3d',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: 48,
                                                    bottom: 0,
                                                    background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
                                                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                                    boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    width: 42,
                                                    height: 42,
                                                    top: 0,
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                                                    border: '3px solid #F59E0B',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.2rem',
                                                    fontWeight: 900,
                                                    color: '#92400E',
                                                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                                                }}
                                            >
                                                €
                                            </Box>
                                        </Box>
                                    </motion.div>

                                    {/* Node 5 - Bottom Right */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: 0.5 }}
                                        style={{
                                            position: 'absolute',
                                            right: '12%',
                                            bottom: '12%',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 105,
                                                height: 105,
                                                position: 'relative',
                                                animation: `${float} 4.8s ease-in-out infinite`,
                                                animationDelay: '1.5s',
                                                transformStyle: 'preserve-3d',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: 48,
                                                    bottom: 0,
                                                    background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
                                                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                                    boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    width: 42,
                                                    height: 42,
                                                    top: 0,
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 100%)',
                                                    border: '3px solid #EC4899',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.2rem',
                                                    fontWeight: 900,
                                                    color: '#9F1239',
                                                    boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)',
                                                }}
                                            >
                                                £
                                            </Box>
                                        </Box>
                                    </motion.div>

                                    {/* Connection Lines */}
                                    <svg
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            pointerEvents: 'none',
                                        }}
                                    >
                                        <motion.line
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 1.2, delay: 0.6 }}
                                            x1="18%"
                                            y1="20%"
                                            x2="48%"
                                            y2="48%"
                                            stroke="#D1D5DB"
                                            strokeWidth="2"
                                            strokeDasharray="6,4"
                                        />
                                        <motion.line
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 1.2, delay: 0.8 }}
                                            x1="82%"
                                            y1="18%"
                                            x2="52%"
                                            y2="50%"
                                            stroke="#D1D5DB"
                                            strokeWidth="2"
                                            strokeDasharray="6,4"
                                        />
                                        <motion.line
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 1.2, delay: 1 }}
                                            x1="22%"
                                            y1="80%"
                                            x2="48%"
                                            y2="52%"
                                            stroke="#D1D5DB"
                                            strokeWidth="2"
                                            strokeDasharray="6,4"
                                        />
                                        <motion.line
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 1.2, delay: 1.2 }}
                                            x1="78%"
                                            y1="82%"
                                            x2="52%"
                                            y2="52%"
                                            stroke="#D1D5DB"
                                            strokeWidth="2"
                                            strokeDasharray="6,4"
                                        />
                                    </svg>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Container >
            </Box >

            {/* Features Section */}
            < Box id="features" sx={{ py: { xs: 8, md: 12 }, background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', position: 'relative', zIndex: 1 }}>
                <Container maxWidth="xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography
                            variant="h2"
                            sx={{
                                fontSize: { xs: '2rem', md: '3rem' },
                                fontWeight: 700,
                                color: '#111827',
                                textAlign: 'center',
                                mb: 2,
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Powerful Features
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: '#6B7280',
                                textAlign: 'center',
                                mb: 8,
                                fontSize: '1.1rem',
                                maxWidth: 600,
                                mx: 'auto',
                            }}
                        >
                            Everything you need to manage your finances effectively and efficiently
                        </Typography>
                    </motion.div>

                    <Grid container spacing={4}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card
                                        sx={{
                                            height: '100%',
                                            p: 3,
                                            borderRadius: 3,
                                            background: 'rgba(255, 255, 255, 0.9)',
                                            backdropFilter: 'blur(20px)',
                                            border: '1px solid rgba(255, 255, 255, 0.4)',
                                            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.12)',
                                            transformStyle: 'preserve-3d',
                                            transform: `perspective(1000px) rotateX(5deg) rotateY(5deg) translateZ(20px)`,
                                            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                transform: `perspective(1000px) rotateX(-5deg) rotateY(-5deg) translateZ(50px) scale(1.05)`,
                                                boxShadow: '0 30px 80px rgba(99, 102, 241, 0.35)',
                                                border: '1px solid rgba(99, 102, 241, 0.5)',
                                                background: 'rgba(255, 255, 255, 1)',
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ p: 0 }}>
                                            <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: '#111827',
                                                    mb: 1.5,
                                                }}
                                            >
                                                {feature.title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: '#6B7280',
                                                    lineHeight: 1.7,
                                                }}
                                            >
                                                {feature.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box >

            {/* Use Cases Section */}
            < Box id="use-cases" sx={{ py: { xs: 8, md: 12 }, position: 'relative', zIndex: 1 }}>
                <Container maxWidth="xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography
                            variant="h2"
                            sx={{
                                fontSize: { xs: '2rem', md: '3rem' },
                                fontWeight: 700,
                                color: '#111827',
                                textAlign: 'center',
                                mb: 2,
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Perfect For Everyone
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: '#6B7280',
                                textAlign: 'center',
                                mb: 8,
                                fontSize: '1.1rem',
                                maxWidth: 600,
                                mx: 'auto',
                            }}
                        >
                            Whether you're a business owner, freelancer, or managing personal finances
                        </Typography>
                    </motion.div>

                    <Grid container spacing={4}>
                        {useCases.map((useCase, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card
                                        sx={{
                                            height: '100%',
                                            p: 4,
                                            borderRadius: 3,
                                            background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)`,
                                            backdropFilter: 'blur(10px)',
                                            border: `2px solid ${useCase.color}40`,
                                            boxShadow: `0 10px 40px ${useCase.color}20`,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-5px)',
                                                boxShadow: `0 20px 60px ${useCase.color}30`,
                                                border: `2px solid ${useCase.color}60`,
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ p: 0 }}>
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: useCase.color,
                                                    mb: 2,
                                                }}
                                            >
                                                {useCase.title}
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    color: '#4B5563',
                                                    lineHeight: 1.7,
                                                }}
                                            >
                                                {useCase.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box >

            {/* How It Works Section */}
            < Box id="how-it-works" sx={{ py: { xs: 8, md: 12 }, background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', position: 'relative', zIndex: 1 }}>
                <Container maxWidth="xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography
                            variant="h2"
                            sx={{
                                fontSize: { xs: '2rem', md: '3rem' },
                                fontWeight: 700,
                                color: '#111827',
                                textAlign: 'center',
                                mb: 2,
                                letterSpacing: '-0.02em',
                            }}
                        >
                            How It Works
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: '#6B7280',
                                textAlign: 'center',
                                mb: 8,
                                fontSize: '1.1rem',
                                maxWidth: 600,
                                mx: 'auto',
                            }}
                        >
                            Get started in four simple steps
                        </Typography>
                    </motion.div>

                    <Grid container spacing={4}>
                        {steps.map((step, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Box
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mx: 'auto',
                                                mb: 3,
                                                boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)',
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: '2rem',
                                                    fontWeight: 900,
                                                    color: 'white',
                                                }}
                                            >
                                                {step.number}
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                                color: '#111827',
                                                mb: 1.5,
                                            }}
                                        >
                                            {step.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: '#6B7280',
                                                lineHeight: 1.7,
                                            }}
                                        >
                                            {step.description}
                                        </Typography>
                                    </Box>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box >

            {/* Testimonials Section */}
            < Box id="testimonials" sx={{ py: { xs: 8, md: 12 }, position: 'relative', zIndex: 1 }}>
                <Container maxWidth="xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography
                            variant="h2"
                            sx={{
                                fontSize: { xs: '2rem', md: '3rem' },
                                fontWeight: 700,
                                color: '#111827',
                                textAlign: 'center',
                                mb: 2,
                                letterSpacing: '-0.02em',
                            }}
                        >
                            What Our Users Say
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: '#6B7280',
                                textAlign: 'center',
                                mb: 8,
                                fontSize: '1.1rem',
                                maxWidth: 600,
                                mx: 'auto',
                            }}
                        >
                            Trusted by thousands of users across India
                        </Typography>
                    </motion.div>

                    <Grid container spacing={4}>
                        {testimonials.map((testimonial, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card
                                        sx={{
                                            height: '100%',
                                            p: 4,
                                            borderRadius: 3,
                                            background: 'rgba(255, 255, 255, 0.8)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-5px)',
                                                boxShadow: '0 15px 50px rgba(0, 0, 0, 0.12)',
                                                border: '1px solid rgba(99, 102, 241, 0.3)',
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ p: 0 }}>
                                            <Box sx={{ display: 'flex', mb: 2 }}>
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <Star key={i} sx={{ color: '#F59E0B', fontSize: 20 }} />
                                                ))}
                                            </Box>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    color: '#4B5563',
                                                    mb: 3,
                                                    lineHeight: 1.7,
                                                    fontStyle: 'italic',
                                                }}
                                            >
                                                "{testimonial.comment}"
                                            </Typography>
                                            <Box>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: '#111827',
                                                    }}
                                                >
                                                    {testimonial.name}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: '#6B7280',
                                                    }}
                                                >
                                                    {testimonial.role}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box >

            {/* CTA Section */}
            < Box sx={{ py: { xs: 8, md: 12 }, background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', position: 'relative', zIndex: 1 }}>
                <Container maxWidth="md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography
                            variant="h2"
                            sx={{
                                fontSize: { xs: '2rem', md: '3rem' },
                                fontWeight: 700,
                                color: '#111827',
                                textAlign: 'center',
                                mb: 3,
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Ready to Get Started?
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: '#6B7280',
                                textAlign: 'center',
                                mb: 5,
                                fontSize: '1.1rem',
                            }}
                        >
                            Join thousands of users managing their finances with ShreeKhata
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                            <Button
                                onClick={() => navigate('/signup')}
                                endIcon={<ArrowForward />}
                                sx={{
                                    px: 5,
                                    py: 2,
                                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                    color: 'white',
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    fontSize: '1.1rem',
                                    borderRadius: 2,
                                    boxShadow: '0 15px 40px rgba(240, 147, 251, 0.4)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
                                        boxShadow: '0 20px 50px rgba(240, 147, 251, 0.6)',
                                        transform: 'translateY(-3px)',
                                    },
                                }}
                            >
                                Start Free Today
                            </Button>
                        </Box>
                    </motion.div>
                </Container>
            </Box >

            {/* Footer */}
            < Box sx={{ py: 6, bgcolor: '#F9FAFB', borderTop: '1px solid #E5E7EB' }}>
                <Container maxWidth="xl">
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Avatar
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        background: 'linear-gradient(135deg, #14B8A6 0%, #10B981 100%)',
                                        fontSize: '0.9rem',
                                        fontWeight: 900,
                                    }}
                                >
                                    SK
                                </Avatar>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 800,
                                        color: '#111827',
                                        fontSize: '1.2rem',
                                    }}
                                >
                                    ShreeKhata
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: '#6B7280', mb: 2 }}>
                                Modern digital ledger for businesses and individuals.
                            </Typography>
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111827', mb: 2 }}>
                                Product
                            </Typography>
                            <Stack spacing={1}>
                                <Typography variant="body2" sx={{ color: '#6B7280', cursor: 'pointer' }}>
                                    Features
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#6B7280', cursor: 'pointer' }}>
                                    Pricing
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#6B7280', cursor: 'pointer' }}>
                                    Security
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111827', mb: 2 }}>
                                Company
                            </Typography>
                            <Stack spacing={1}>
                                <Typography variant="body2" sx={{ color: '#6B7280', cursor: 'pointer' }}>
                                    About
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#6B7280', cursor: 'pointer' }}>
                                    Blog
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#6B7280', cursor: 'pointer' }}>
                                    Careers
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111827', mb: 2 }}>
                                Resources
                            </Typography>
                            <Stack spacing={1}>
                                <Typography variant="body2" sx={{ color: '#6B7280', cursor: 'pointer' }}>
                                    Documentation
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#6B7280', cursor: 'pointer' }}>
                                    Help Center
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#6B7280', cursor: 'pointer' }}>
                                    Contact
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111827', mb: 2 }}>
                                Legal
                            </Typography>
                            <Stack spacing={1}>
                                <Typography variant="body2" sx={{ color: '#6B7280', cursor: 'pointer' }}>
                                    Privacy
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#6B7280', cursor: 'pointer' }}>
                                    Terms
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#6B7280', cursor: 'pointer' }}>
                                    License
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid #E5E7EB' }}>
                        <Typography variant="body2" sx={{ color: '#6B7280', textAlign: 'center' }}>
                            © 2026 ShreeKhata. All rights reserved.
                        </Typography>
                    </Box>
                </Container>
            </Box >
        </Box >
    );
};

export default Welcome;
