import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Menu,
    MenuItem,
    BottomNavigation,
    BottomNavigationAction,
    useMediaQuery,
    useTheme,
    Fab,
    Paper,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Receipt as ReceiptIcon,
    Category as CategoryIcon,
    Assessment as AssessmentIcon,
    AccountCircle,
    Logout,
    Brightness4,
    Brightness7,
    Add,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useThemeMode } from '../../theme/ThemeProvider';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const drawerWidth = 260;

const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Ledger', icon: <ReceiptIcon />, path: '/ledger' },
    { text: 'Categories', icon: <CategoryIcon />, path: '/categories' },
    { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
];

const MainLayout = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { mode, toggleTheme } = useThemeMode();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [bottomNavValue, setBottomNavValue] = useState(location.pathname);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleNavigate = (path) => {
        navigate(path);
        setMobileOpen(false);
    };

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography
                    variant="h5"
                    className="gradient-text"
                    sx={{ fontWeight: 800 }}
                >
                    ShreeKhata
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Digital Ledger
                </Typography>
            </Box>

            <List sx={{ flex: 1, px: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => handleNavigate(item.path)}
                            sx={{
                                borderRadius: 2,
                                '&.Mui-selected': {
                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                    color: 'white',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                    },
                                    '& .MuiListItemIcon-root': {
                                        color: 'white',
                                    },
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    color: location.pathname === item.path ? 'white' : 'inherit',
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            {/* User info at bottom */}
            <Box
                sx={{
                    p: 2,
                    borderTop: 1,
                    borderColor: 'divider',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {user?.name?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" noWrap>
                            {user?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                            {user?.email}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* App Bar */}
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                    background: (theme) =>
                        theme.palette.mode === 'dark'
                            ? 'rgba(30, 41, 59, 0.8)'
                            : 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: 'none',
                    borderBottom: 1,
                    borderColor: 'divider',
                }}
            >
                <Toolbar>
                    <IconButton
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' }, color: theme.palette.text.primary }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" sx={{ flexGrow: 1, color: theme.palette.text.primary }}>
                        {menuItems.find((item) => item.path === location.pathname)?.text ||
                            'ShreeKhata'}
                    </Typography>

                    <IconButton onClick={toggleTheme} sx={{ color: theme.palette.text.primary }}>
                        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>

                    <IconButton onClick={handleProfileMenuOpen} sx={{ color: theme.palette.text.primary }}>
                        <AccountCircle />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* User Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
            >
                <MenuItem
                    onClick={() => {
                        navigate('/profile');
                        handleProfileMenuClose();
                    }}
                >
                    <AccountCircle sx={{ mr: 1 }} /> Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1 }} /> Logout
                </MenuItem>
            </Menu>

            {/* Desktop Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        borderRight: 1,
                        borderColor: 'divider',
                    },
                }}
            >
                {drawer}
            </Drawer>

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                    },
                }}
            >
                {drawer}
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    minHeight: '100vh',
                    bgcolor: 'background.default',
                }}
            >
                <Toolbar />
                <Box sx={{ p: { xs: 2, md: 3 }, pb: { xs: 10, md: 3 } }}>
                    <Box sx={{ maxWidth: '1600px', mx: 'auto' }}>
                        <Outlet />
                    </Box>
                </Box>
            </Box>

            {/* Mobile Bottom Navigation */}
            {isMobile && (
                <>
                    <Paper
                        sx={{
                            position: 'fixed',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            zIndex: 1100,
                            display: { md: 'none' },
                            borderTop: 1,
                            borderColor: 'divider',
                        }}
                        elevation={8}
                    >
                        <BottomNavigation
                            value={bottomNavValue}
                            onChange={(event, newValue) => {
                                setBottomNavValue(newValue);
                                navigate(newValue);
                            }}
                            showLabels
                        >
                            {menuItems.map((item) => (
                                <BottomNavigationAction
                                    key={item.path}
                                    label={item.text}
                                    value={item.path}
                                    icon={item.icon}
                                />
                            ))}
                        </BottomNavigation>
                    </Paper>

                    {/* Floating Action Button */}
                    <Fab
                        color="primary"
                        sx={{
                            position: 'fixed',
                            bottom: 80,
                            right: 16,
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                            },
                        }}
                        onClick={() => navigate('/ledger?add=true')}
                    >
                        <Add />
                    </Fab>
                </>
            )}
        </Box>
    );
};

export default MainLayout;
