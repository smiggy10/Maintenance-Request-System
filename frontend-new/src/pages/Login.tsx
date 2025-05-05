import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  Alert,
  Divider,
  IconButton,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import GoogleIcon from '@mui/icons-material/Google';
import LockOpenIcon from '@mui/icons-material/LockOpen';

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .test('password-validation', 'Invalid password', function(value) {
      if (!value) return false;
      // For admin account, require specific password
      if (this.parent.email === 'admin@mrs.com') {
        return value === 'mrs12345';
      }
      // For other users, require 8 characters
      return value.length >= 8;
    })
    .required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check for success message from registration
  useEffect(() => {
    const state = location.state as { message?: string };
    if (state?.message) {
      setSuccessMessage(state.message);
    }
  }, [location]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await login(values.email, values.password);
        // Redirect based on user role
        if (values.email === 'admin@mrs.com') {
          navigate('/admin-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      } catch (error) {
        setError('Invalid email or password');
      }
    },
  });

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* Left Side - Form */}
      <Grid item xs={12} md={6} sx={{ background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto', px: 4, py: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <img src="/images/mrs-logo.png" alt="MRS Logo" style={{ height: 40, marginRight: 10 }} />
            <Typography variant="h5" fontWeight={700} color="primary.main">MRS</Typography>
          </Box>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>Sign in</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Don't have an account?{' '}
            <Link href="/signup" underline="hover" fontWeight={600} color="secondary.main">Create now</Link>
          </Typography>
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{successMessage}</Alert>
          )}
          <Box component="form" onSubmit={formik.handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail"
              name="email"
              autoComplete="email"
              autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <IconButton tabIndex={-1} edge="end" disabled>
                    <LockOpenIcon fontSize="small" />
                  </IconButton>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ borderRadius: 24, py: 1.5, fontWeight: 600, fontSize: '1rem', mb: 2 }}
            >
              Sign in
            </Button>
          </Box>
        </Box>
      </Grid>
      {/* Right Side - Image & Intro */}
      <Grid item xs={12} md={6} sx={{ background: '#181B2C', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', p: 4 }}>
        <Box sx={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
          <img src="/images/batangas-logo.png" alt="Batangas State University" style={{ width: '100%', maxWidth: 260, borderRadius: 12, marginBottom: 32 }} />
          <Typography variant="h5" fontWeight={700} sx={{ mb: 1, letterSpacing: 1 }}>INTRODUCING</Typography>
          <Typography variant="body1" sx={{ color: '#d1d3e2' }}>
            MRS is a streamlined maintenance request system where users can submit requests to report and track issues, maintenance staff manage repairs, and admins oversee operations through a web platform ensuring fast, efficient, and hassle-free maintenance solutions.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login; 