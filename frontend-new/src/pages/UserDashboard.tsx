import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  CircularProgress,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Build as BuildIcon,
  Announcement as AnnouncementIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import api from '../config/api';
import DashboardAnnouncements from '../components/DashboardAnnouncements';

interface MaintenanceRequest {
  id: number;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  date_submitted: string;
}



const UserDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const response = await api.get(`/requests/user/${user.id}`);
          setRequests(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'warning';
      case 'Pending':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f7f8fa', overflow: 'auto' }}>
      <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '4px solid', borderColor: 'primary.main', bgcolor: '#fff' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} color="primary.main">
            Maintenance Request System
          </Typography>
          <Button
            color="primary"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ borderRadius: 24, fontWeight: 600 }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Welcome Card */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Card sx={{ bgcolor: 'primary.main', color: '#fff', borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h5" fontWeight={700} sx={{ color: '#fff', pl: 3 }}>
                  Welcome{user && user.name ? `, ${user.name}` : ''}!
                </Typography>
                <Typography variant="body1" sx={{ color: '#fff', pl: 3 }}>
                  Here you can manage your maintenance requests and view important announcements.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          {/* Quick Actions */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderLeft: '6px solid', borderColor: 'primary.main', borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" color="primary.main" gutterBottom sx={{ pl: 3 }}>
                  Quick Actions
                </Typography>
                <List>
                  <ListItem>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<BuildIcon />}
                      onClick={() => navigate('/maintenance-requests')}
                      sx={{ borderRadius: 24, fontWeight: 600 }}
                    >
                      New Maintenance Request
                    </Button>
                  </ListItem>
                  <ListItem>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<PersonIcon />}
                      onClick={() => navigate('/profile')}
                      sx={{ borderRadius: 24, fontWeight: 600, color: 'primary.main', borderColor: 'primary.main' }}
                    >
                      View Profile
                    </Button>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Requests */}
          <Grid item xs={12} md={8}>
            <Card sx={{ borderLeft: '6px solid', borderColor: 'primary.main', borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" color="primary.main" gutterBottom sx={{ pl: 3 }}>
                  Recent Maintenance Requests
                </Typography>
                <List>
                  {requests.slice(0, 5).map((request) => (
                    <ListItem key={request.id} divider>
                      <ListItemText
                        primary={request.title}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {request.description}
                            </Typography>
                            <br />
                            <Typography component="span" variant="caption" color="text.secondary">
                              Submitted: {new Date(request.date_submitted).toISOString().split('T')[0]}
                            </Typography>
                          </>
                        }
                      />
                      <Chip
                        label={request.status}
                        color={
                          request.status === 'Completed'
                            ? 'success'
                            : request.status === 'In Progress'
                            ? 'warning'
                            : 'error'
                        }
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
                <Button sx={{ mt: 2, borderRadius: 24, fontWeight: 600, color: 'primary.main' }} onClick={() => navigate('/maintenance-requests')}>
                  VIEW ALL REQUESTS
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            {/* Recent Announcements */}
            <Grid item xs={12}>
              <Card sx={{ borderLeft: '6px solid', borderColor: 'primary.main', borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                  <DashboardAnnouncements />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default UserDashboard;