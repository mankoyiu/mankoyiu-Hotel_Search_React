import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, CircularProgress, Alert, Paper } from '@mui/material';
import { agencyService } from '../../services/agency.service';

const PhotoUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setError('');
      setSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      console.log('Starting photo upload...');
      await agencyService.uploadPhoto(selectedFile);
      console.log('Photo upload successful');
      setSuccess(true);
      setSelectedFile(null);
      
      // Wait a moment before redirecting
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      console.error('Photo upload error:', err);
      if (err.message === 'Not authenticated') {
        navigate('/login');
      } else {
        setError(err.message || 'Failed to upload photo');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Upload Member Photo
        </Typography>

        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Supported formats: JPG, PNG, GIF (max 5MB)
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Photo uploaded successfully! Redirecting to dashboard...
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="outlined"
            component="label"
            disabled={loading}
            fullWidth
          >
            Select Photo
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileSelect}
            />
          </Button>

          {selectedFile && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected file: {selectedFile.name} ({Math.round(selectedFile.size / 1024)}KB)
            </Typography>
          )}

          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : 'Upload Photo'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PhotoUpload; 