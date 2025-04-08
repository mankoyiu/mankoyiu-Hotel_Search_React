import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Paper,
  Alert,
  Link 
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth.service';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  // Get the intended destination from state, if any
  const from = (location.state as any)?.from?.pathname || '/';

  // Add some predefined logins for testing
  const handleUseTestAccount = (username: string, password: string) => {
    formik.setFieldValue('username', username);
    formik.setFieldValue('password', password);
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      try {
        console.log('Attempting login with:', values.username);
        const response = await authService.login(values.username, values.password);
        console.log('Login response:', response);
        login(response);
        
        // Navigate to the intended destination
        console.log('Navigating to:', from);
        navigate(from, { replace: true });
      } catch (err: any) {
        console.error('Login error:', err);
        const errorMessage = err.response?.data?.msg || err.message || 'Invalid username or password';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="username"
            name="username"
            label="Username"
            margin="normal"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            disabled={loading}
          />
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            margin="normal"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            disabled={loading}
          />
          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          
          <Box mt={2} textAlign="center">
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Test accounts:
            </Typography>
            <Box display="flex" justifyContent="center" gap={2}>
              <Link 
                component="button" 
                variant="body2" 
                onClick={() => handleUseTestAccount('admin', 'admin')}
              >
                Admin
              </Link>
              <Link 
                component="button" 
                variant="body2" 
                onClick={() => handleUseTestAccount('user', 'password')}
              >
                User
              </Link>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
