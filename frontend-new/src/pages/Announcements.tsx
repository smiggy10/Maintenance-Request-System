import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Announcement } from '../types';

interface AnnouncementFormData {
  title: string;
  content: string;
  priority: 'Low' | 'Medium' | 'High';
  category: string;
}

const Announcements = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: '',
    content: '',
    priority: 'Medium',
    category: 'General',
  });

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/announcements');
        if (!response.ok) {
          throw new Error('Failed to fetch announcements');
        }
        const data = await response.json();
        setAnnouncements(data);
      } catch (err) {
        console.error('Error fetching announcements:', err);
        setError('Failed to load announcements. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingAnnouncement(null);
    setFormData({
      title: '',
      content: '',
      priority: 'Medium',
      category: 'General',
    });
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      category: announcement.category || 'General',
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/announcements/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete announcement');
        }

        setAnnouncements(announcements.filter(announcement => announcement.id !== id));
      } catch (err) {
        console.error('Error deleting announcement:', err);
        setError('Failed to delete announcement. Please try again.');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handlePriorityChange = (event: SelectChangeEvent) => {
    setFormData(prev => ({
      ...prev,
      priority: event.target.value as 'Low' | 'Medium' | 'High',
    }));
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/announcements');
      if (!response.ok) {
        throw new Error('Failed to fetch announcements');
      }
      const data = await response.json();
      setAnnouncements(data);
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError('Failed to load announcements. Please try again later.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    try {
      const token = localStorage.getItem('token');
      const userJson = localStorage.getItem('user');
      
      console.log('Token from localStorage:', token ? 'exists' : 'missing');
      console.log('User from localStorage:', userJson || 'missing');
      
      if (!token || !userJson) {
        const errorMsg = `User not authenticated. Token: ${token ? 'exists' : 'missing'}, User: ${userJson ? 'exists' : 'missing'}`;
        console.error(errorMsg);
        setError('Please log in to create announcements');
        return;
      }
      
      const user = JSON.parse(userJson);
      const userId = user.id;
      const userName = user.name || 'Unknown User';

      const url = editingAnnouncement 
        ? `http://localhost:5000/api/announcements/${editingAnnouncement.id}`
        : 'http://localhost:5000/api/announcements';
      
      const method = editingAnnouncement ? 'PUT' : 'POST';
      const requestBody = {
        ...formData,
        created_by: editingAnnouncement ? undefined : parseInt(userId, 10)
      };
      
      console.log('Sending request to:', url);
      console.log('Request method:', method);
      console.log('Request body:', requestBody);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      // Handle empty responses
      const responseText = await response.text();
      let responseData = null;
      
      if (responseText) {
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          console.warn('Response is not valid JSON:', responseText);
        }
      }
      
      console.log('Response status:', response.status);
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData?.message || 'Failed to save announcement');
      }
      
      // Clear the form and close the dialog
      setFormData({ title: '', content: '', priority: 'Medium', category: 'General' });
      setEditingAnnouncement(null);
      setOpen(false);
      
      // Refresh the announcements list to get the latest data from the server
      await fetchAnnouncements();
      
    } catch (err) {
      console.error('Error saving announcement:', err);
      setError(err instanceof Error ? err.message : 'Failed to save announcement. Please try again.');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ flexGrow: 1, height: '100vh', overflow: 'auto' }}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, position: 'relative' }}>
        <IconButton 
          onClick={() => navigate('/admin-dashboard')} 
          sx={{ 
            position: 'absolute', 
            left: 0, 
            top: 0,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          <img 
            src="/images/close.png" 
            alt="Close" 
            style={{ width: '24px', height: '24px' }} 
          />
        </IconButton>
        {error && (
          <Box sx={{ mb: 2, p: 2, backgroundColor: 'error.light', color: 'white', borderRadius: 1 }}>
            <Typography>{error}</Typography>
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Announcements
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            New Announcement
          </Button>
        </Box>

        <Paper>
          <List>
            {announcements.map((announcement) => (
              <ListItem
                key={announcement.id}
                divider
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6">{announcement.title}</Typography>
                      <Chip
                        label={announcement.priority}
                        color={getPriorityColor(announcement.priority)}
                        size="small"
                      />
                      <Chip
                        label={announcement.category}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        {announcement.content}
                      </Typography>
                      <br />
                      <Typography component="span" variant="caption" color="text.secondary">
                        Posted on: {announcement.date}
                      </Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEdit(announcement)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(announcement.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>

        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
          </DialogTitle>
          <Box component="form" onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoFocus
                    margin="dense"
                    name="title"
                    label="Title"
                    type="text"
                    fullWidth
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="dense"
                    name="content"
                    label="Content"
                    type="text"
                    fullWidth
                    multiline
                    rows={4}
                    required
                    value={formData.content}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Priority</InputLabel>
                    <Select
                      name="priority"
                      label="Priority"
                      value={formData.priority}
                      onChange={handlePriorityChange}
                      required
                    >
                      <MenuItem value="Low">Low</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    name="category"
                    label="Category"
                    type="text"
                    fullWidth
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                {editingAnnouncement ? 'Update' : 'Submit'}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Announcements; 