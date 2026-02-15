import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import { keyframes } from '@mui/system';

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-25px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const SignupAnimation = () => {
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
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                style={{ position: 'absolute', top: '8%', right: '12%' }}
            >
                <Box
                    sx={{
                        width: 110,
                        height: 55,
                        bgcolor: 'rgba(255, 255, 255, 0.3)',
                        borderRadius: '55px',
                        position: 'relative',
                        animation: `${float} 5s ease-in-out infinite`,
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            width: 70,
                            height: 42,
                            bgcolor: 'rgba(255, 255, 255, 0.3)',
                            borderRadius: '35px',
                            top: -18,
                            left: 20,
                        },
                    }}
                />
            </motion.div>

            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                style={{ position: 'absolute', top: '15%', left: '10%' }}
            >
                <Box
                    sx={{
                        width: 85,
                        height: 42,
                        bgcolor: 'rgba(255, 255, 255, 0.25)',
                        borderRadius: '42px',
                        animation: `${float} 6s ease-in-out infinite`,
                        animationDelay: '1.5s',
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            width: 55,
                            height: 33,
                            bgcolor: 'rgba(255, 255, 255, 0.25)',
                            borderRadius: '28px',
                            top: -14,
                            left: 15,
                        },
                    }}
                />
            </motion.div>

            {/* Main Rocket Illustration */}
            <Box sx={{ position: 'relative', zIndex: 2 }}>
                {/* Rocket */}
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <Box
                        sx={{
                            width: 120,
                            height: 200,
                            position: 'relative',
                            animation: `${float} 3s ease-in-out infinite`,
                        }}
                    >
                        {/* Rocket Body */}
                        <Box
                            sx={{
                                width: 100,
                                height: 140,
                                background: 'linear-gradient(135deg, #FFFFFF 0%, #F3F4F6 100%)',
                                borderRadius: '50px 50px 10px 10px',
                                position: 'absolute',
                                top: 0,
                                left: 10,
                                border: '4px solid #1F2937',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                            }}
                        >
                            {/* Window */}
                            <Box
                                sx={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    border: '4px solid #1F2937',
                                    bgcolor: '#DBEAFE',
                                    position: 'absolute',
                                    top: 30,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                                        animation: `${pulse} 2s ease-in-out infinite`,
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* Rocket Nose/Tip */}
                        <Box
                            sx={{
                                width: 0,
                                height: 0,
                                borderLeft: '54px solid transparent',
                                borderRight: '54px solid transparent',
                                borderBottom: '60px solid #EC4899',
                                position: 'absolute',
                                top: -60,
                                left: 6,
                            }}
                        />

                        {/* Left Fin */}
                        <Box
                            sx={{
                                width: 0,
                                height: 0,
                                borderTop: '40px solid transparent',
                                borderBottom: '40px solid transparent',
                                borderRight: '50px solid #8B5CF6',
                                position: 'absolute',
                                bottom: 10,
                                left: -35,
                            }}
                        />

                        {/* Right Fin */}
                        <Box
                            sx={{
                                width: 0,
                                height: 0,
                                borderTop: '40px solid transparent',
                                borderBottom: '40px solid transparent',
                                borderLeft: '50px solid #8B5CF6',
                                position: 'absolute',
                                bottom: 10,
                                right: -35,
                            }}
                        />

                        {/* Flame/Exhaust */}
                        <motion.div
                            animate={{
                                scaleY: [1, 1.3, 1],
                                opacity: [0.8, 1, 0.8],
                            }}
                            transition={{
                                duration: 0.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            style={{
                                position: 'absolute',
                                bottom: -70,
                                left: '50%',
                                transform: 'translateX(-50%)',
                            }}
                        >
                            <Box
                                sx={{
                                    width: 60,
                                    height: 70,
                                    background: 'linear-gradient(180deg, #FCD34D 0%, #F59E0B 50%, #EF4444 100%)',
                                    borderRadius: '50% 50% 40% 40%',
                                    filter: 'blur(2px)',
                                }}
                            />
                        </motion.div>
                    </Box>
                </motion.div>

                {/* Flying People/Team */}
                <motion.div
                    initial={{ x: -80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    style={{
                        position: 'absolute',
                        top: -20,
                        left: -120,
                    }}
                >
                    <Box
                        sx={{
                            width: 50,
                            height: 70,
                            background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                            borderRadius: '25px 25px 15px 15px',
                            position: 'relative',
                            animation: `${float} 4s ease-in-out infinite`,
                            animationDelay: '0.5s',
                        }}
                    >
                        {/* Head */}
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                bgcolor: '#FBBF24',
                                borderRadius: '50%',
                                position: 'absolute',
                                top: -20,
                                left: 5,
                                border: '3px solid #1F2937',
                            }}
                        />
                    </Box>
                </motion.div>

                <motion.div
                    initial={{ x: 80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    style={{
                        position: 'absolute',
                        top: 40,
                        right: -100,
                    }}
                >
                    <Box
                        sx={{
                            width: 50,
                            height: 70,
                            background: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',
                            borderRadius: '25px 25px 15px 15px',
                            position: 'relative',
                            animation: `${float} 3.5s ease-in-out infinite`,
                            animationDelay: '1s',
                        }}
                    >
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                bgcolor: '#FCD34D',
                                borderRadius: '50%',
                                position: 'absolute',
                                top: -20,
                                left: 5,
                                border: '3px solid #1F2937',
                            }}
                        />
                    </Box>
                </motion.div>
            </Box>

            {/* Floating Charts/Success Elements */}
            <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 1.5 }}
                style={{
                    position: 'absolute',
                    bottom: '20%',
                    right: '15%',
                }}
            >
                <Box
                    sx={{
                        width: 100,
                        height: 100,
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        borderRadius: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
                        animation: `${pulse} 2s ease-in-out infinite`,
                        gap: 0.5,
                        position: 'relative',
                    }}
                >
                    {/* Chart Bars */}
                    {[60, 80, 100, 70].map((height, index) => (
                        <motion.div
                            key={index}
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 0.5, delay: 1.8 + index * 0.1 }}
                            style={{
                                position: 'absolute',
                                bottom: 10,
                                left: 15 + index * 18,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 12,
                                    height: `${height * 0.6}px`,
                                    bgcolor: 'white',
                                    borderRadius: 1,
                                }}
                            />
                        </motion.div>
                    ))}
                </Box>
            </motion.div>

            {/* Confetti/Stars */}
            {
                [...Array(8)].map((_, index) => (
                    <motion.div
                        key={index}
                        initial={{ scale: 0, rotate: 0 }}
                        animate={{
                            scale: [0, 1, 0],
                            rotate: [0, 180, 360],
                            y: [0, -100, -200],
                        }}
                        transition={{
                            duration: 2,
                            delay: 1 + index * 0.2,
                            repeat: Infinity,
                            repeatDelay: 3,
                        }}
                        style={{
                            position: 'absolute',
                            bottom: '10%',
                            left: `${20 + index * 10}%`,
                        }}
                    >
                        <Box
                            sx={{
                                width: 15,
                                height: 15,
                                bgcolor: index % 2 === 0 ? '#FCD34D' : '#EC4899',
                                borderRadius: index % 3 === 0 ? '50%' : 1,
                                transform: `rotate(${index * 45}deg)`,
                            }}
                        />
                    </motion.div>
                ))
            }

            {/* Success Badge */}
            <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 1.8 }}
                style={{
                    position: 'absolute',
                    top: '10%',
                    left: '15%',
                }}
            >
                <Box
                    sx={{
                        width: 90,
                        height: 90,
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)',
                        animation: `${rotate} 20s linear infinite`,
                        border: '4px dashed white',
                    }}
                >
                    <Box
                        sx={{
                            fontSize: '2.5rem',
                            animation: `${pulse} 1.5s ease-in-out infinite`,
                        }}
                    >
                        🚀
                    </Box>
                </Box>
            </motion.div>
        </Box >
    );
};

export default SignupAnimation;
