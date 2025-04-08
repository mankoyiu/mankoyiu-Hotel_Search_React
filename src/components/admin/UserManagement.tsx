import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  Box,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { userService, User } from '../../services/user.service';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [editUser, setEditUser] = useState<User | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<User | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching users...');
      const response = await userService.getAllUsers();
      console.log('Users response:', response);
      
      if (response && Array.isArray(response)) {
        console.log('Setting users:', response);
        // Ensure each user has all required fields
        const validUsers = response.filter(user => 
          user && 
          typeof user === 'object' &&
          user.username &&
          user.email &&
          user.name &&
          typeof user.name === 'object' &&
          user.name.firstname &&
          user.name.lastname
        );
        
        if (validUsers.length === 0) {
          console.log('No valid users found in response');
          setUsers([]);
          setError('No valid users found in the response');
        } else {
          console.log('Setting valid users:', validUsers);
          setUsers(validUsers);
        }
      } else {
        console.log('Invalid response format:', response);
        setError('Invalid response format from server');
        setUsers([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
      setError(err.message || 'Failed to fetch users');
      setUsers([]);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 0) {
      fetchUsers();
    } else {
      navigate('/');
    }
  }, [user, navigate]);

  const handleEditClick = (user: User) => {
    setEditUser(user);
    setOpenDialog(true);
  };

  const handleDeleteClick = (user: User) => {
    setDeleteConfirmUser(user);
    setOpenDeleteDialog(true);
  };

  const handleStatusToggle = async (username: string, currentStatus: boolean) => {
    try {
      console.log('Toggling status for user:', username);
      await userService.changeUserStatus(username, !currentStatus);
      setUsers(users.map(u => 
        u.username === username ? { ...u, status: !currentStatus } : u
      ));
    } catch (err: any) {
      console.error('Failed to update user status:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update user status');
    }
  };

  const handleEditSubmit = async () => {
    if (!editUser) return;

    try {
      console.log('Updating user:', editUser);
      await userService.updateUser(editUser.username, editUser);
      setUsers(users.map(u => 
        u.username === editUser.username ? editUser : u
      ));
      setOpenDialog(false);
    } catch (err: any) {
      console.error('Failed to update user:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update user');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmUser) return;

    try {
      console.log('Deleting user:', deleteConfirmUser.username);
      await userService.deleteUser(deleteConfirmUser.username);
      setUsers(users.filter(u => u.username !== deleteConfirmUser.username));
      setOpenDeleteDialog(false);
    } catch (err: any) {
      console.error('Failed to delete user:', err);
      setError(err.response?.data?.message || err.message || 'Failed to delete user');
    }
  };

  const getRoleLabel = (role: number) => {
    switch (role) {
      case 0:
        return <Chip label="Admin" color="error" />;
      case 1:
        return <Chip label="Agency" color="primary" />;
      case 2:
        return <Chip label="Member" color="success" />;
      default:
        return <Chip label="Unknown" />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user || user.role !== 0) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Alert severity="error">You don't have permission to access this page.</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  {`${user.name.firstname} ${user.name.lastname}`}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getRoleLabel(user.role)}</TableCell>
                <TableCell>
                  <Switch
                    checked={user.status}
                    onChange={() => handleStatusToggle(user.username, user.status)}
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDeleteClick(user)}
                    disabled={user.role === 0} // Prevent deleting admins
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit User Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {editUser && (
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Username"
                value={editUser.username}
                disabled
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Phone"
                value={editUser.phone}
                onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="First Name"
                value={editUser.name.firstname}
                onChange={(e) => setEditUser({
                  ...editUser,
                  name: { ...editUser.name, firstname: e.target.value }
                })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Last Name"
                value={editUser.name.lastname}
                onChange={(e) => setEditUser({
                  ...editUser,
                  name: { ...editUser.name, lastname: e.target.value }
                })}
                sx={{ mb: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user {deleteConfirmUser?.username}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;