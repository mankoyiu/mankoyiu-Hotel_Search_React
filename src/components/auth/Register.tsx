// src/components/auth/Register.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Paper,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { authService } from '../../services/auth.service';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState<string>('');

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      email: '',
      phone: '',
      firstname: '',
      lastname: '',
      nickname: '',
      role: 2, // Default to member role
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, 'Username must be at least 3 characters')
        .required('Username is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      phone: Yup.string()
        .required('Phone number is required'),
      firstname: Yup.string()
        .required('First name is required'),
      lastname: Yup.string()
        .required('Last name is required'),
      nickname: Yup.string()
        .required('Nickname is required'),
      role: Yup.number()
        .required('Role is required')
        .oneOf([1, 2], 'Invalid role selected'),
    }),
    onSubmit: async (values) => {
      try {
        setError('');
        await authService.register({
          username: values.username,
          password: values.password,
          email: values.email,
          phone: values.phone,
          name: {
            firstname: values.firstname,
            lastname: values.lastname,
            nickname: values.nickname,
          },
          role: values.role,
        });
        navigate('/login');
      } catch (err: any) {
        setError(err.message || 'Registration failed. Please try again.');
      }
    },
  });

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formik.values.role}
                label="Role"
                onChange={formik.handleChange}
                error={formik.touched.role && Boolean(formik.errors.role)}
              >
                <MenuItem value={2}>Member</MenuItem>
                <MenuItem value={1}>Agency</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              id="username"
              name="username"
              label="Username"
              value={formik.values.username}
              onChange={formik.handleChange}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
            
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            
            <TextField
              fullWidth
              id="phone"
              name="phone"
              label="Phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                id="firstname"
                name="firstname"
                label="First Name"
                value={formik.values.firstname}
                onChange={formik.handleChange}
                error={formik.touched.firstname && Boolean(formik.errors.firstname)}
                helperText={formik.touched.firstname && formik.errors.firstname}
              />
              
              <TextField
                fullWidth
                id="lastname"
                name="lastname"
                label="Last Name"
                value={formik.values.lastname}
                onChange={formik.handleChange}
                error={formik.touched.lastname && Boolean(formik.errors.lastname)}
                helperText={formik.touched.lastname && formik.errors.lastname}
              />
              
              <TextField
                fullWidth
                id="nickname"
                name="nickname"
                label="Nickname"
                value={formik.values.nickname}
                onChange={formik.handleChange}
                error={formik.touched.nickname && Boolean(formik.errors.nickname)}
                helperText={formik.touched.nickname && formik.errors.nickname}
              />
            </Box>
          </Box>
          
          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            sx={{ mt: 3 }}
          >
            Register
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Register;