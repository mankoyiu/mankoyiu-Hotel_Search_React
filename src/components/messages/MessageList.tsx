// src/components/messages/MessageList.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { messageService } from '../../services/message.service';
import { Message } from '../../types/message.types';

const MessageList: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching messages...');
      const response = await messageService.getMessages();
      console.log('Messages received:', response);
      setMessages(response || []);
    } catch (err: any) {
      console.error('Failed to fetch messages:', err);
      setError(err.message || 'Failed to load messages');
      if (err.message === 'Not authenticated') {
        console.log('Not authenticated, redirecting to login');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication first
    const user = localStorage.getItem('user');
    if (!user) {
      console.log('No user found, redirecting to login');
      navigate('/login');
      return;
    }

    fetchMessages();
  }, [navigate]);

  const handleDelete = async (messageId: string) => {
    try {
      await messageService.deleteMessage(messageId);
      // Refresh messages after deletion
      fetchMessages();
    } catch (err: any) {
      console.error('Failed to delete message:', err);
      setError(err.message || 'Failed to delete message');
      if (err.message === 'Not authenticated') {
        navigate('/login');
      }
    }
  };

  const handleComposeClick = () => {
    navigate('/messages/compose');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4">Messages</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleComposeClick}
          >
            Compose Message
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {messages.length === 0 ? (
          <Typography color="textSecondary">No messages found</Typography>
        ) : (
          <List>
            {messages.map((message) => (
              <ListItem
                key={message._id}
                divider
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(message._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={
                    <Typography>
                      <strong>From:</strong> {message.sender} <strong>To:</strong> {message.receiver}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="textPrimary">
                        {message.content}
                      </Typography>
                      <br />
                      <Typography component="span" variant="caption" color="textSecondary">
                        {new Date(message.createdAt).toLocaleString()}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default MessageList;