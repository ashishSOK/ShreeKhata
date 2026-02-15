import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import { keyframes } from '@mui/system';

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

const AnalyticsSignupAnimation = () => {
    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Main Dashboard Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                style={{
                    position: 'relative',
                    zIndex: 2,
                }}
            >
                <Box
                    sx={{
                        width: 350,
                        height: 450,
                        background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
                        borderRadius: 4,
                        border: '3px solid #E2E8F0',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.1)',
                        padding: 4,
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Header */}
                    <Box sx={{ mb: 3 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                                mb: 2,
                            }}
                        >
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#EF4444' }} />
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#F59E0B' }} />
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#10B981' }} />
                        </Box>
                        <Box
                            sx={{
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                color: '#111827',
                                mb: 0.5,
                            }}
                        >
                            Analytics Dashboard
                        </Box>
                        <Box sx={{ fontSize: '0.85rem', color: '#6B7280' }}>
                            Real-time Insights
                        </Box>
                    </Box>

                    {/* Animated Bar Chart */}
                    <Box sx={{ position: 'relative', height: 200, mb: 3 }}>
                        {[
                            { height: 60, delay: 0.2, color: '#14B8A6' },
                            { height: 95, delay: 0.3, color: '#10B981' },
                            { height: 140, delay: 0.4, color: '#14B8A6' },
                            { height: 170, delay: 0.5, color: '#10B981' },
                        ].map((bar, index) => (
                            <motion.div
                                key={index}
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{
                                    duration: 0.8,
                                    delay: bar.delay,
                                    repeat: Infinity,
                                    repeatDelay: 2,
                                    ease: 'easeOut',
                                }}
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: `${15 + index * 22}%`,
                                    width: 50,
                                    transformOrigin: 'bottom',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: `${bar.height}px`,
                                        background: `linear-gradient(180deg, ${bar.color} 0%, ${bar.color}DD 100%)`,
                                        borderRadius: '8px 8px 0 0',
                                        boxShadow: `0 4px 12px ${bar.color}40`,
                                    }}
                                />
                            </motion.div>
                        ))}
                    </Box>

                    {/* Stats Row */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        {[
                            { label: 'Revenue', value: '₹45.2K', icon: '📈' },
                            { label: 'Growth', value: '+24%', icon: '📊' },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                                style={{ flex: 1 }}
                            >
                                <Box
                                    sx={{
                                        bgcolor: '#F9FAFB',
                                        borderRadius: 2,
                                        padding: 1.5,
                                        border: '1px solid #E2E8F0',
                                    }}
                                >
                                    <Box sx={{ fontSize: '1.2rem', mb: 0.5 }}>{stat.icon}</Box>
                                    <Box sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#14B8A6', mb: 0.3 }}>
                                        {stat.value}
                                    </Box>
                                    <Box sx={{ fontSize: '0.75rem', color: '#6B7280' }}>{stat.label}</Box>
                                </Box>
                            </motion.div>
                        ))}
                    </Box>

                    {/* Trend Line */}
                    <Box sx={{ position: 'relative', height: 60, mt: 2 }}>
                        <svg width="100%" height="100%" viewBox="0 0 300 60">
                            <motion.path
                                d="M 0,50 Q 75,40 150,25 T 300,10"
                                fill="none"
                                stroke="#14B8A6"
                                strokeWidth="3"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2, delay: 1, ease: 'easeInOut' }}
                            />
                            <motion.path
                                d="M 0,50 Q 75,40 150,25 T 300,10"
                                fill="none"
                                stroke="url(#gradient)"
                                strokeWidth="12"
                                opacity="0.2"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2, delay: 1, ease: 'easeInOut' }}
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#14B8A6" />
                                    <stop offset="100%" stopColor="#10B981" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </Box>
                </Box>
            </motion.div>

            {/* Floating Success Badge */}
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                style={{
                    position: 'absolute',
                    top: '12%',
                    right: '18%',
                    zIndex: 3,
                }}
            >
                <Box
                    sx={{
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #14B8A6 0%, #10B981 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 40px rgba(20, 184, 166, 0.4)',
                        animation: `${pulse} 2s ease-in-out infinite`,
                        border: '4px solid white',
                    }}
                >
                    <Box sx={{ fontSize: '2.5rem' }}>✓</Box>
                </Box>
            </motion.div>

            {/* Floating Currency Coins */}
            {[
                { symbol: '₹', top: '25%', left: '12%', delay: 0.5 },
                { symbol: '$', bottom: '30%', right: '15%', delay: 0.7 },
                { symbol: '€', top: '60%', left: '10%', delay: 0.9 },
            ].map((coin, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: coin.delay }}
                    style={{
                        position: 'absolute',
                        top: coin.top,
                        bottom: coin.bottom,
                        left: coin.left,
                        right: coin.right,
                    }}
                >
                    <Box
                        sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.8rem',
                            fontWeight: 700,
                            color: '#78350F',
                            boxShadow: '0 8px 20px rgba(252, 211, 77, 0.4)',
                            animation: `${float} 4s ease-in-out infinite`,
                            animationDelay: `${coin.delay}s`,
                            border: '3px solid white',
                        }}
                    >
                        {coin.symbol}
                    </Box>
                </motion.div>
            ))}

            {/* Floating Data Points */}
            {[...Array(6)].map((_, index) => (
                <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: 3,
                        delay: index * 0.3,
                        repeat: Infinity,
                        repeatDelay: 1,
                    }}
                    style={{
                        position: 'absolute',
                        left: `${15 + index * 15}%`,
                        top: `${20 + (index % 3) * 20}%`,
                    }}
                >
                    <Box
                        sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: index % 2 === 0 ? '#14B8A6' : '#10B981',
                            boxShadow: '0 2px 8px rgba(20, 184, 166, 0.3)',
                        }}
                    />
                </motion.div>
            ))}
        </Box>
    );
};

export default AnalyticsSignupAnimation;
