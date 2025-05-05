import React, { useState } from 'react';
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
import axios from 'axios';

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  priority: 'Low' | 'Medium' | 'High';
  category: string;
}

interface AnnouncementFormData {
  title: string;
  content: string;
  priority: 'Low' | 'Medium' | 'High';
  category: string;
}

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 1,
      title: 'Scheduled Maintenance',
      content: 'There will be scheduled maintenance on the HVAC system this weekend.',
      date: '2024-03-15',
      priority: 'High',
      category: 'Maintenance',
    },
    {
      id: 2,
      title: 'New Staff Member',
      content: 'Welcome our new maintenance team member, John Smith.',
      date: '2024-03-14',
      priority: 'Medium',
      category: 'Staff',
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: '',
    content: '',
    priority: 'Medium',
    category: '',
  });

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
      category: '',
    });
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      category: announcement.category,
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      // TODO: Replace with actual API call
      // await axios.delete(`/api/announcements/${id}`);
      setAnnouncements(announcements.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting announcement:', error);
      // TODO: Add error handling UI
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePriorityChange = (event: SelectChangeEvent) => {
    setFormData(prev => ({
      ...prev,
      priority: event.target.value as 'Low' | 'Medium' | 'High',
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      // TODO: Replace with actual API call
      // const response = await axios.post('/api/announcements', formData);
      
      if (editingAnnouncement) {
        setAnnouncements(announcements.map(a => 
          a.id === editingAnnouncement.id 
            ? { ...a, ...formData, date: new Date().toISOString().split('T')[0] }
            : a
        ));
      } else {
        const newAnnouncement: Announcement = {
          id: announcements.length + 1,
          ...formData,
          date: new Date().toISOString().split('T')[0],
        };
        setAnnouncements([...announcements, newAnnouncement]);
      }
      
      handleClose();
    } catch (error) {
      console.error('Error submitting announcement:', error);
      // TODO: Add error handling UI
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
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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