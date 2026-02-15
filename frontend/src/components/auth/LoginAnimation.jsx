import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import { keyframes } from '@mui/system';

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const LoginAnimation = () => {
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
            {/* Floating Clouds */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                style={{ position: 'absolute', top: '10%', left: '10%' }}
            >
                <Box
                    sx={{
                        width: 120,
                        height: 60,
                        bgcolor: 'rgba(255, 255, 255, 0.3)',
                        borderRadius: '60px',
                        position: 'relative',
                        animation: `${float} 6s ease-in-out infinite`,
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            width: 80,
                            height: 48,
                            bgcolor: 'rgba(255, 255, 255, 0.3)',
                            borderRadius: '40px',
                            top: -20,
                            left: 20,
                        },
                    }}
                />
            </motion.div>

            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                style={{ position: 'absolute', top: '20%', right: '15%' }}
            >
                <Box
                    sx={{
                        width: 90,
                        height: 45,
                        bgcolor: 'rgba(255, 255, 255, 0.25)',
                        borderRadius: '45px',
                        animation: `${float} 5s ease-in-out infinite`,
                        animationDelay: '1s',
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            width: 60,
                            height: 36,
                            bgcolor: 'rgba(255, 255, 255, 0.25)',
                            borderRadius: '30px',
                            top: -15,
                            left: 15,
                        },
                    }}
                />
            </motion.div>

            {/* Main Character/Phone Illustration */}
            <Box sx={{ position: 'relative', zIndex: 2 }}>
                {/* Giant Phone */}
                <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <Box
                        sx={{
                            width: 280,
                            height: 480,
                            bgcolor: '#FFFFFF',
                            borderRadius: 8,
                            border: '12px solid #1F2937',
                            position: 'relative',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 4,
                        }}
                    >
                        {/* Notch */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: 120,
                                height: 28,
                                bgcolor: '#1F2937',
                                borderBottomLeftRadius: 20,
                                borderBottomRightRadius: 20,
                            }}
                        />

                        {/* Lock Icon - Animated */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                        >
                            <Box
                                sx={{
                                    width: 100,
                                    height: 80,
                                    background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
                                    borderRadius: 3,
                                    position: 'relative',
                                    mb: 3,
                                    animation: `${pulse} 2s ease-in-out infinite`,
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: -25,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: 60,
                                        height: 50,
                                        border: '8px solid #8B5CF6',
                                        borderBottom: 'none',
                                        borderTopLeftRadius: 30,
                                        borderTopRightRadius: 30,
                                    },
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: 20,
                                        height: 20,
                                        bgcolor: 'white',
                                        borderRadius: '50%',
                                    },
                                }}
                            />
                        </motion.div>

                        {/* Fingerprint Scanner */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.8, delay: 1 }}
                        >
                            <Box
                                sx={{
                                    width: 120,
                                    height: 120,
                                    borderRadius: '50%',
                                    border: '4px solid #8B5CF6',
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    animation: `${pulse} 2s ease-in-out infinite`,
                                    animationDelay: '0.5s',
                                }}
                            >
                                {/* Fingerprint lines */}
                                {[0, 1, 2, 3, 4].map((index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            position: 'absolute',
                                            width: `${100 - index * 15}%`,
                                            height: `${100 - index * 15}%`,
                                            borderRadius: '50%',
                                            border: `3px solid`,
                                            borderColor: index % 2 === 0 ? '#8B5CF6' : '#EC4899',
                                            borderTop: 'transparent',
                                            borderRight: 'transparent',
                                            transform: `rotate(${index * 20}deg)`,
                                        }}
                                    />
                                ))}
                            </Box>
                        </motion.div>
                    </Box>
                </motion.div>

                {/* Character - Person using phone */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    style={{
                        position: 'absolute',
                        bottom: -40,
                        right: -100,
                    }}
                >
                    <Box sx={{ position: 'relative' }}>
                        {/* Body */}
                        <Box
                            sx={{
                                width: 80,
                                height: 100,
                                background: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)',
                                borderRadius: '40px 40px 20px 20px',
                                position: 'relative',
                            }}
                        />
                        {/* Head */}
                        <Box
                            sx={{
                                width: 60,
                                height: 60,
                                bgcolor: '#FBBF24',
                                borderRadius: '50%',
                                position: 'absolute',
                                top: -30,
                                left: 10,
                                border: '3px solid #1F2937',
                            }}
                        />
                        {/* Arms */}
                        <Box
                            sx={{
                                width: 50,
                                height: 50,
                                bgcolor: '#FCD34D',
                                borderRadius: '50%',
                                position: 'absolute',
                                top: 20,
                                right: -40,
                                animation: `${float} 2s ease-in-out infinite`,
                            }}
                        />
                    </Box>
                </motion.div>
            </Box>

            {/* Success Checkmark */}
            <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                style={{
                    position: 'absolute',
                    top: '15%',
                    right: '20%',
                }}
            >
                <Box
                    sx={{
                        width: 100,
                        height: 100,
                        background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 30px rgba(236, 72, 153, 0.4)',
                        animation: `${pulse} 2s ease-in-out infinite`,
                        animationDelay: '1s',
                    }}
                >
                    <Box
                        sx={{
                            width: 0,
                            height: 0,
                            borderLeft: '15px solid transparent',
                            borderRight: '15px solid transparent',
                            borderBottom: '30px solid white',
                            transform: 'rotate(45deg) translateY(-5px)',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                width: 50,
                                height: 8,
                                bgcolor: 'white',
                                borderRadius: 4,
                                transform: 'rotate(45deg) translate(-18px, 10px)',
                            },
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                width: 25,
                                height: 8,
                                bgcolor: 'white',
                                borderRadius: 4,
                                transform: 'rotate(-90deg) translate(-10px, -25px)',
                            }}
                        />
                    </Box>
                </Box>
            </motion.div>

            {/* Decorative Padlock */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                style={{
                    position: 'absolute',
                    bottom: '15%',
                    left: '10%',
                }}
            >
                <Box
                    sx={{
                        width: 80,
                        height: 60,
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                        borderRadius: 2,
                        position: 'relative',
                        animation: `${float} 4s ease-in-out infinite`,
                        animationDelay: '2s',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: -30,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 40,
                            height: 35,
                            border: '6px solid #8B5CF6',
                            borderBottom: 'none',
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                        },
                    }}
                />
            </motion.div>
        </Box>
    );
};

export default LoginAnimation;
