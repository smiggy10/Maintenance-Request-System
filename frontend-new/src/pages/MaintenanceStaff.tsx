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
  IconButton,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';

interface MaintenanceStaff {
  id: number;
  name: string;
  role: string;
  contact_number: string;
  email: string;
  status: 'Active' | 'Inactive';
  date_created: string;
}

const MaintenanceStaff = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [staff, setStaff] = useState<MaintenanceStaff[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingStaff, setEditingStaff] = useState<MaintenanceStaff | null>(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await api.get('/staff');
      setStaff(response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
      setError('Failed to fetch maintenance staff');
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
    setEditingStaff(null);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingStaff(null);
    setError(null);
    setSuccess(null);
  };

  const handleEdit = (staff: MaintenanceStaff) => {
    setEditingStaff(staff);
    setOpen(true);
  };

  const handleDelete = async (staffId: number) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await api.delete(`/staff/${staffId}`);
        setSuccess('Staff member deleted successfully');
        fetchStaff();
      } catch (error) {
        console.error('Error deleting staff:', error);
        setError('Failed to delete staff member');
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      setError(null);
      setSuccess(null);

      const staffData = {
        name: formData.get('name'),
        role: formData.get('role'),
        contact_number: formData.get('contact_number'),
        email: formData.get('email'),
        status: formData.get('status') || 'Active'
      };

      if (editingStaff) {
        await api.put(`/staff/${editingStaff.id}`, staffData);
        setSuccess('Staff member updated successfully');
      } else {
        await api.post('/staff', staffData);
        setSuccess('Staff member created successfully');
      }

      handleClose();
      fetchStaff();
    } catch (error: any) {
      console.error('Error saving staff:', error);
      setError(error.response?.data?.message || 'Failed to save staff member');
    }
  };

  return (
    <Box sx={{ flexGrow: 1, height: '100vh', overflow: 'auto' }}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Maintenance Staff
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            Add Staff
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
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Contact Number</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.id}</TableCell>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>{member.contact_number}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.status}</TableCell>
                  <TableCell>{new Date(member.date_created).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(member)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(member.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
          </DialogTitle>
          <Box component="form" onSubmit={handleSubmit}>
            <DialogContent>
              <TextField
                required
                fullWidth
                name="name"
                label="Name"
                defaultValue={editingStaff?.name}
                margin="normal"
              />
              <TextField
                required
                fullWidth
                name="role"
                label="Role"
                defaultValue={editingStaff?.role}
                margin="normal"
              />
              <TextField
                fullWidth
                name="contact_number"
                label="Contact Number"
                defaultValue={editingStaff?.contact_number}
                margin="normal"
              />
              <TextField
                fullWidth
                name="email"
                label="Email"
                type="email"
                defaultValue={editingStaff?.email}
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  label="Status"
                  defaultValue={editingStaff?.status || 'Active'}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                {editingStaff ? 'Update' : 'Add'}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Container>
    </Box>
  );
};

export default MaintenanceStaff; 