import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar,
  ListItemAvatar,
  TextField,
  IconButton,
  Collapse,
  CircularProgress,
  Button
} from '@mui/material';
import { Send as SendIcon, ChatBubbleOutline as CommentIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface Comment {
  id: number;
  comment: string;
  created_at: string;
  user_name: string;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  priority: 'Low' | 'Medium' | 'High';
  comments?: Comment[];
}

interface DashboardAnnouncementsProps {
  maxItems?: number;
}

const DashboardAnnouncements: React.FC<DashboardAnnouncementsProps> = ({ maxItems = 3 }) => {
  const { user } = useAuth();
  const [expandedAnnouncement, setExpandedAnnouncement] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/announcements');
      setAnnouncements(response.data);
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleExpandClick = (id: number) => {
    setExpandedAnnouncement(expandedAnnouncement === id ? null : id);
  };

  const handleCommentSubmit = async (announcementId: number) => {
    if (!commentText.trim() || !user) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to post comments');
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/announcements/${announcementId}/comments`,
        {
          comment: commentText
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Update the announcements state with the new comment
      setAnnouncements(prev => 
        prev.map(announcement => 
          announcement.id === announcementId
            ? {
                ...announcement,
                comments: [...(announcement.comments || []), response.data]
              }
            : announcement
        )
      );

      setCommentText('');
    } catch (err: any) {
      console.error('Error posting comment:', err);
      if (err.response?.status === 401) {
        setError('Please log in to post comments');
      } else if (err.response?.status === 403) {
        setError('Your session has expired. Please log in again.');
      } else {
        setError('Failed to post comment. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (announcements.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body1">No announcements to display.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 2, pl: 3 }}>
        <Typography variant="h6" color="primary.main">
          Recent Announcements
        </Typography>
      </Box>
      <List>
        {announcements.slice(0, maxItems).map((announcement) => (
          <React.Fragment key={announcement.id}>
            <ListItem 
              divider
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {announcement.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip 
                      label={announcement.priority} 
                      color={getPriorityColor(announcement.priority)} 
                      size="small"
                      sx={{ ml: 1 }}
                    />
                    <IconButton 
                      size="small" 
                      onClick={() => handleExpandClick(announcement.id)}
                      sx={{ ml: 1 }}
                    >
                      <CommentIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {announcement.content}
                </Typography>
                
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  {announcement.date}
                </Typography>
              </Box>

              <Collapse in={expandedAnnouncement === announcement.id} sx={{ width: '100%', mt: 2 }}>
                <Box sx={{ width: '100%' }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Comments ({announcement.comments?.length || 0})
                  </Typography>
                  
                  {/* Comments List */}
                  <List sx={{ maxHeight: 200, overflow: 'auto', bgcolor: 'background.paper', borderRadius: 1, p: 1 }}>
                    {announcement.comments?.map((comment) => (
                      <ListItem key={comment.id} dense>
                        <ListItemAvatar>
                          <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem' }}>
                            {(comment.user_name ? comment.user_name.charAt(0).toUpperCase() : '?')}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" component="span">
                              <strong>{comment.user_name}</strong> • {new Date(comment.created_at).toLocaleString()}
                            </Typography>
                          }
                          secondary={comment.comment}
                          secondaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    )) || (
                      <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                        No comments yet
                      </Typography>
                    )}
                  </List>
                  
                  {/* Add Comment */}
                  {user && (
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleCommentSubmit(announcement.id);
                          }
                        }}
                      />
                      <Button
                        variant="contained"
                        endIcon={<SendIcon />}
                        onClick={() => handleCommentSubmit(announcement.id)}
                        disabled={!commentText.trim()}
                      >
                        Send
                      </Button>
                    </Box>
                  )}
                </Box>
              </Collapse>
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default DashboardAnnouncements;
