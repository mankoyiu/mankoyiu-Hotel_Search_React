import React, { useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  Divider,
  Stack
} from '@mui/material';
import { FavoriteBorder } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Auth state:', { isAuthenticated, userRole: user?.role });
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            flexGrow: 0,
            mr: 4
          }}
        >
          Hotel System
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          divider={<Divider orientation="vertical" flexItem />}
          sx={{ flexGrow: 1 }}
        >
          {/* Member Routes */}
          {isAuthenticated && user?.role === 2 && (
            <>
              <Button color="inherit" component={RouterLink} to="/dashboard">
                Member Dashboard
              </Button>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/favorites"
                startIcon={<FavoriteBorder />}
              >
                Favorites
              </Button>
            </>
          )}

          {/* Agency Routes */}
          {isAuthenticated && user?.role === 1 && (
            <>
              <Button color="inherit" component={RouterLink} to="/agency">
                Agency Dashboard
              </Button>
            </>
          )}

          {/* Admin Routes */}
          {isAuthenticated && user?.role === 0 && (
            <>
              <Button color="inherit" component={RouterLink} to="/admin">
                Admin Dashboard
              </Button>
            </>
          )}

          {/* Message Routes - Available for all authenticated users */}
          {isAuthenticated && (
            <>
              <Button color="inherit" component={RouterLink} to="/messages">
                Messages
              </Button>
            </>
          )}
        </Stack>

        <Box sx={{ flexGrow: 0 }}>
          {isAuthenticated ? (
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2">
                Welcome, {user?.username} (Role: {user?.role})
              </Typography>
              <Button 
                variant="outlined" 
                color="inherit" 
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={2}>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/login"
              >
                Login
              </Button>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/register"
              >
                Register
              </Button>
            </Stack>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 