// src/components/messages/MessageCompose.tsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { messageService } from '../../services/message.service';

const MessageCompose: React.FC = () => {
  const [receiver, setReceiver] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiver || !content) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await messageService.sendMessage(content, receiver);
      navigate('/messages');
    } catch (err: any) {
      console.error('Failed to send message:', err);
      setError(err.message || 'Failed to send message');
      if (err.message === 'Not authenticated') {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Compose Message
      </Typography>

      <Paper elevation={2} sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="To"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            margin="normal"
            required
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Message"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            margin="normal"
            required
            multiline
            rows={4}
            disabled={loading}
          />

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Send Message'}
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate('/messages')}
              disabled={loading}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default MessageCompose;

// // src/components/messages/MessageCompose.tsx
// import React, { useState } from 'react';
// import { 
//   TextField, 
//   Button, 
//   Box, 
//   Alert,
//   CircularProgress
// } from '@mui/material';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { messageService } from '../../services/message.service';
// import { useAuth } from '../../contexts/AuthContext';

// const MessageCompose: React.FC = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string>('');
//   const [success, setSuccess] = useState(false);
//   const { user } = useAuth();

//   const formik = useFormik({
//     initialValues: {
//       receiver: '',
//       content: ''
//     },
//     validationSchema: Yup.object({
//       receiver: Yup.string().required('Recipient is required'),
//       content: Yup.string().required('Message content is required')
//     }),
//     onSubmit: async (values, { resetForm }) => {
//       if (user?.token) {
//         setLoading(true);
//         setError('');
//         setSuccess(false);
        
//         try {
//           await messageService.sendMessage({
//             ...values,
//             token: user.token
//           });
//           resetForm();
//           setSuccess(true);
//         } catch (err) {
//           setError('Failed to send message');
//         } finally {
//           setLoading(false);
//         }
//       }
//     }
//   });

//   return (
//     <Box component="form" onSubmit={formik.handleSubmit}>
//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}
      
//       {success && (
//         <Alert severity="success" sx={{ mb: 2 }}>
//           Message sent successfully!
//         </Alert>
//       )}

//       <TextField
//         fullWidth
//         id="receiver"
//         name="receiver"
//         label="Recipient Username"
//         margin="normal"
//         value={formik.values.receiver}
//         onChange={formik.handleChange}
//         error={formik.touched.receiver && Boolean(formik.errors.receiver)}
//         helperText={formik.touched.receiver && formik.errors.receiver}
//         disabled={loading}
//       />
      
//       <TextField
//         fullWidth
//         id="content"
//         name="content"
//         label="Message"
//         multiline
//         rows={4}
//         margin="normal"
//         value={formik.values.content}
//         onChange={formik.handleChange}
//         error={formik.touched.content && Boolean(formik.errors.content)}
//         helperText={formik.touched.content && formik.errors.content}
//         disabled={loading}
//       />
      
//       <Button
//         type="submit"
//         variant="contained"
//         color="primary"
//         fullWidth
//         disabled={loading}
//         sx={{ mt: 2 }}
//       >
//         {loading ? <CircularProgress size={24} /> : 'Send Message'}
//       </Button>
//     </Box>
//   );
// };

// export default MessageCompose;