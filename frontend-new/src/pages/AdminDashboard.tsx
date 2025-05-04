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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  AppBar,
  Toolbar,
  Drawer,
  Divider,
  ListItemIcon,
} from '@mui/material';
import {
  Build as BuildIcon,
  Announcement as AnnouncementIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import MaintenanceRequests from './MaintenanceRequests';
import MaintenanceStaff from './MaintenanceStaff';
import api from '../config/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'maintenance';
  department: string;
}

interface MaintenanceRequest {
  id: number;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  date_submitted: string;
  assigned_staff_name?: string;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  priority: 'Low' | 'Medium' | 'High';
}

const drawerWidth = 240;

const AdminDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [staff, setStaff] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/requests');
        setRequests(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    const fetchStaff = async () => {
      try {
        const response = await api.get('/staff');
        setStaff(response.data);
      } catch (error) {
        console.error('Error fetching staff:', error);
      }
    };

    // Fetch data when component mounts
    fetchData();
    fetchStaff();

    // Fetch data whenever currentPage changes to 'dashboard'
    if (currentPage === 'dashboard') {
      fetchData();
      fetchStaff();
    }
  }, [currentPage]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUserDialogOpen = (user?: User) => {
    setSelectedUser(user || null);
    setOpenUserDialog(true);
  };

  const handleUserDialogClose = () => {
    setOpenUserDialog(false);
    setSelectedUser(null);
  };

  const handleUserSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        role: formData.get('role'),
        department: formData.get('department'),
      };

      // TODO: Replace with actual API call
      // if (selectedUser) {
      //   await axios.put(`/api/users/${selectedUser.id}`, userData);
      // } else {
      //   await axios.post('/api/users', userData);
      // }

      // Refresh user list
      // const response = await axios.get('/api/users');
      // setUsers(response.data);
      
      handleUserDialogClose();
    } catch (error) {
      console.error('Error submitting user:', error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      // TODO: Replace with actual API call
      // await axios.delete(`/api/users/${userId}`);
      
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

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

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ color: 'primary.main', fontWeight: 700 }}>
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem button onClick={() => setCurrentPage('dashboard')} selected={currentPage === 'dashboard'} sx={{ '&.Mui-selected': { bgcolor: 'primary.main', color: '#fff' } }}>
          <ListItemIcon sx={{ color: currentPage === 'dashboard' ? '#fff' : 'primary.main' }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" sx={{ color: currentPage === 'dashboard' ? '#fff' : 'primary.main' }} />
        </ListItem>
        <ListItem button onClick={() => setCurrentPage('requests')} selected={currentPage === 'requests'} sx={{ '&.Mui-selected': { bgcolor: 'primary.main', color: '#fff' } }}>
          <ListItemIcon sx={{ color: currentPage === 'requests' ? '#fff' : 'primary.main' }}>
            <BuildIcon />
          </ListItemIcon>
          <ListItemText primary="Maintenance Requests" sx={{ color: currentPage === 'requests' ? '#fff' : 'primary.main' }} />
        </ListItem>
        <ListItem button onClick={() => setCurrentPage('staff')} selected={currentPage === 'staff'} sx={{ '&.Mui-selected': { bgcolor: 'primary.main', color: '#fff' } }}>
          <ListItemIcon sx={{ color: currentPage === 'staff' ? '#fff' : 'primary.main' }}>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Maintenance Staff" sx={{ color: currentPage === 'staff' ? '#fff' : 'primary.main' }} />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon sx={{ color: 'primary.main' }}>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" sx={{ color: 'primary.main' }} />
        </ListItem>
      </List>
    </div>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f7f8fa', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          borderBottom: '4px solid',
          borderColor: 'primary.main',
          bgcolor: '#fff',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" color="primary.main">
            Maintenance Request System
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: '#fff',
              borderRight: '3px solid',
              borderColor: 'primary.main',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: '#fff',
              borderRight: '3px solid',
              borderColor: 'primary.main',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: '#f7f8fa',
        }}
      >
        <Toolbar />
        <Container maxWidth="lg">
          {currentPage === 'dashboard' && (
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {/* Dashboard Stats */}
              <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: 'primary.main', color: '#fff', borderRadius: 10, boxShadow: 2, minHeight: 120, display: 'flex', alignItems: 'center', px: 4 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <BuildIcon sx={{ color: '#fff', fontSize: 32, mr: 1 }} />
                      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>Requests</Typography>
                    </Box>
                    <Typography variant="h3" sx={{ color: '#fff', fontWeight: 700 }}>{requests.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: '#fff', borderLeft: '6px solid', borderColor: 'primary.main', borderRadius: 10, boxShadow: 2, minHeight: 120, display: 'flex', alignItems: 'center', px: 4 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PeopleIcon sx={{ color: 'primary.main', fontSize: 32, mr: 1 }} />
                      <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>Maintenance Staff</Typography>
                    </Box>
                    <Typography variant="h3" sx={{ color: 'primary.main', fontWeight: 700 }}>{staff.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
          {currentPage === 'dashboard' && (
            <Typography variant="h4" component="h1" gutterBottom color="primary.main">
              Welcome to the Maintenance Request System
            </Typography>
          )}
          {currentPage === 'requests' && <MaintenanceRequests />}
          {currentPage === 'staff' && <MaintenanceStaff />}
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboard; 