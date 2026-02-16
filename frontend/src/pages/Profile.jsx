import { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Grid,
    Avatar,
    Divider,
    Alert,
} from '@mui/material';
import { PersonOutlined, PhoneOutlined, EmailOutlined, StoreOutlined, ReceiptOutlined } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import PageLoader from '../components/common/PageLoader';

const Profile = () => {
    const { user, updateUserProfile } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        shopName: user?.shopName || '',
        gstNumber: user?.gstNumber || '',
    });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Artificial delay for smoother UX
        const result = await updateUserProfile(formData);

        if (result.success) {
            setSuccess('Profile updated successfully!');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <Box>
            {loading && <PageLoader message="Updating Profile..." />}
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
                Profile
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center', py: 4 }}>
                            <Avatar
                                sx={{
                                    width: 120,
                                    height: 120,
                                    mx: 'auto',
                                    mb: 2,
                                    fontSize: '3rem',
                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                }}
                            >
                                {user?.name?.[0]?.toUpperCase()}
                            </Avatar>
                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {user?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {user?.email}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Update Profile
                            </Typography>

                            {success && (
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    {success}
                                </Alert>
                            )}

                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Full Name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Phone Number"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            value={user?.email}
                                            disabled
                                            helperText="Email cannot be changed"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Shop/Business Name"
                                            name="shopName"
                                            value={formData.shopName}
                                            onChange={handleChange}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="GST Number"
                                            name="gstNumber"
                                            value={formData.gstNumber}
                                            onChange={handleChange}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            size="large"
                                            disabled={loading}
                                            sx={{
                                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                                },
                                            }}
                                        >
                                            {loading ? 'Updating...' : 'Update Profile'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Profile;
