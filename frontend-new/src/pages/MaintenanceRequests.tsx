import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  IconButton,
  Avatar,
  Alert,
} from '@mui/material';
import { Add as AddIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';

interface MaintenanceRequest {
  id: number;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  date_submitted: string;
  image?: string;
  assigned_staff_name?: string;
  user_name: string;
  assigned_to?: number;
  assigned_staff_role?: string;
}

interface Staff {
  id: number;
  name: string;
  role: string;
}

const MaintenanceRequests = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [staff, setStaff] = useState<Staff[]>([]);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
    fetchStaff();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setError('Failed to fetch maintenance requests');
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
    setImagePreview(null);
    setError(null);
    setSuccess(null);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      setError(null);
      setSuccess(null);

      // Log form data
      console.log('Form Data:', {
        title: formData.get('title'),
        description: formData.get('description'),
        priority: formData.get('priority'),
        userId: user?.id
      });

      // Create form data for image upload
      const requestData = new FormData();
      requestData.append('title', formData.get('title') as string);
      requestData.append('description', formData.get('description') as string);
      requestData.append('priority', formData.get('priority') as string);
      requestData.append('userId', user?.id.toString() as string);
      if (selectedImage) {
        requestData.append('image', selectedImage);
      }

      console.log('Sending request to:', '/requests');
      const response = await api.post('/requests', requestData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Response:', response.data);
      setSuccess('Maintenance request submitted successfully');
      handleClose();
      fetchRequests(); // Refresh the list
    } catch (error: any) {
      console.error('Error submitting request:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to submit maintenance request');
    }
  };

  const handleAssignStaff = async (requestId: number, staffId: number) => {
    try {
      await api.post(`/requests/${requestId}/assign`, { staffId });
      setSuccess('Staff assigned successfully');
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error assigning staff:', error);
      setError('Failed to assign staff');
    }
  };

  const handleStatusChange = async (requestId: number, newStatus: string) => {
    try {
      await api.post(`/requests/${requestId}/status`, { status: newStatus });
      setSuccess('Status updated successfully');
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update status');
    }
  };

  // Format date to YYYY-MM-DD
  const formatDate = (dateString: string) => {
    return new Date(dateString).toISOString().split('T')[0];
  };

  return (
    <Box sx={{ flexGrow: 1, height: '100vh', overflow: 'auto' }}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Maintenance Requests
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            New Request
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Date Submitted</TableCell>
                <TableCell>Submitted By</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Assigned Staff</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.id}</TableCell>
                  <TableCell>{request.title}</TableCell>
                  <TableCell>{request.description}</TableCell>
                  <TableCell>
                    {user?.role === 'admin' ? (
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={request.status}
                          onChange={(e) => handleStatusChange(request.id, e.target.value)}
                        >
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="In Progress">In Progress</MenuItem>
                          <MenuItem value="Completed">Completed</MenuItem>
                        </Select>
                      </FormControl>
                    ) : (
                      request.status
                    )}
                  </TableCell>
                  <TableCell>{request.priority}</TableCell>
                  <TableCell>{formatDate(request.date_submitted)}</TableCell>
                  <TableCell>{request.user_name}</TableCell>
                  <TableCell>
                    {request.image && (
                      <img
                        src={`http://localhost:5000/uploads/${request.image}`}
                        alt="Request"
                        style={{ maxWidth: '100px', maxHeight: '100px' }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {user?.role === 'admin' ? (
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={request.assigned_to || ''}
                          onChange={(e) => handleAssignStaff(request.id, Number(e.target.value))}
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>No Staff Assigned</em>
                          </MenuItem>
                          {staff.map((s) => (
                            <MenuItem key={s.id} value={s.id}>
                              {s.name} ({s.role})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      request.assigned_staff_name
                        ? `${request.assigned_staff_name}${request.assigned_staff_role ? ` (${request.assigned_staff_role})` : ''}`
                        : 'No Staff Assigned'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>New Maintenance Request</DialogTitle>
          <Box component="form" onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="title"
                    label="Title"
                    type="text"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="description"
                    label="Description"
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      name="priority"
                      label="Priority"
                      defaultValue="Medium"
                    >
                      <MenuItem value="Low">Low</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                  >
                    Upload Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                  {imagePreview && (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ maxWidth: '100%', maxHeight: '200px' }}
                      />
                    </Box>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                Submit
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Container>
    </Box>
  );
};

export default MaintenanceRequests; 