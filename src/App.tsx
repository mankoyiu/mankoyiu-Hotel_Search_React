import React, { ReactNode, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme, Container } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import HotelList from './components/hotel/HotelList';
import MemberDashboard from './components/member/MemberDashboard';
import AgencyDashboard from './components/agency/AgencyDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import PhotoUpload from './components/agency/PhotoUpload';
import MemberPhotoUpload from './components/member/PhotoUpload';
import MessageList from './components/messages/MessageList';
import MessageCompose from './components/messages/MessageCompose';
import FavoritesList from './components/member/FavoritesList';
import ApiTest from './components/ApiTest';
import AddHotel from './components/hotel/AddHotel';
import Navbar from './components/layout/Navbar';
import UserManagement from './components/admin/UserManagement';

const theme = createTheme();

const PrivateRoute = ({ children, requiredRole }: { children: ReactNode; requiredRole?: number }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('PrivateRoute check - User:', user);
    console.log('Required role:', requiredRole);
    console.log('Current path:', location.pathname);

    if (!user) {
      console.log('No user found, redirecting to login');
      navigate('/login', { replace: true });
      return;
    }

    // Role check logic:
    // - For member routes (role 2), only allow exact match
    // - For admin/agency routes (role 0/1), allow users with lower role numbers (higher privileges)
    if (requiredRole !== undefined) {
      console.log('Checking role:', user.role, 'against required:', requiredRole);
      
      if (requiredRole === 2) {
        // Member routes require exact role match
        if (user.role !== 2) {
          console.log('Access denied: Member route requires exact role match');
          navigate('/', { replace: true });
          return;
        }
      } else {
        // Admin/Agency routes allow users with equal or lower role numbers
        if (user.role > requiredRole) {
          console.log('Access denied: Insufficient privileges');
          navigate('/', { replace: true });
          return;
        }
      }
    }
  }, [user, requiredRole, navigate, location.pathname]);

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
          <CssBaseline />
          <Navbar />
          <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HotelList />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/api-test" element={<ApiTest />} />

              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <PrivateRoute requiredRole={0}>
                    <AdminDashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <PrivateRoute requiredRole={0}>
                    <UserManagement />
                  </PrivateRoute>
                } 
              />

              {/* Member Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute requiredRole={2}>
                    <MemberDashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/favorites" 
                element={
                  <PrivateRoute requiredRole={2}>
                    <FavoritesList />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/member/photo-upload" 
                element={
                  <PrivateRoute requiredRole={2}>
                    <MemberPhotoUpload />
                  </PrivateRoute>
                } 
              />

              {/* Agency Routes */}
              <Route 
                path="/agency" 
                element={
                  <PrivateRoute requiredRole={1}>
                    <AgencyDashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/add-hotel" 
                element={
                  <PrivateRoute requiredRole={1}>
                    <AddHotel />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/agency/photo-upload" 
                element={
                  <PrivateRoute requiredRole={1}>
                    <PhotoUpload />
                  </PrivateRoute>
                } 
              />

              {/* Message Routes */}
              <Route 
                path="/messages" 
                element={
                  <PrivateRoute>
                    <MessageList />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/messages/compose" 
                element={
                  <PrivateRoute>
                    <MessageCompose />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </Container>
        </Box>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App; 