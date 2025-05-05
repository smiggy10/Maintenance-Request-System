import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  IconButton,
  Button,
  Input,
  styled,
  TextField,
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';

const StyledAvatar = styled(Avatar)({
  cursor: 'pointer',
  position: 'relative',
});

const StyledInput = styled(Input)({
  display: 'none',
});

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user) {
          // Split the full name into first and last name
          const [firstName, lastName] = user.name.split(' ');
          setUserData({
            firstName: firstName || '',
            lastName: lastName || '',
            email: user.email,
            role: user.role,
            department: 'DEE' // Changed default department to DEE
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      if (!userData || !user) return;

      const updateResponse = await api.put(`/users/${user.id}`, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        department: userData.department,
      });

      // Refresh user data
      const refreshResponse = await api.get(`/users/${user.id}`);
      const updatedUser = refreshResponse.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));

      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error details:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  const handleBack = () => {
    navigate('/user-dashboard');
  };



  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ flexGrow: 1, height: '100vh', overflow: 'auto' }}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Profile
          </Typography>
          <IconButton onClick={handleBack} sx={{ ml: 2 }}>
            <img src="/images/close.png" alt="Back" style={{ width: 40, height: 40 }} />
          </IconButton>
        </Box>
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <StyledAvatar
                sx={{
                  width: 120,
                  height: 120,
                  margin: '0 auto',
                  bgcolor: 'primary.main',
                }}
              />
              <Typography variant="h6" sx={{ mt: 2 }}>
                {userData.firstName} {userData.lastName}
              </Typography>
              <Typography color="textSecondary">{userData.role}</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    defaultValue={userData.firstName}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    defaultValue={userData.lastName}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    defaultValue={userData.email}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Department"
                    defaultValue={userData.department}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Role"
                    defaultValue={userData.role}
                    margin="normal"
                    disabled
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile; 