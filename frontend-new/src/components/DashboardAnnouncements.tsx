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
} from '@mui/material';
import { Send as SendIcon, ChatBubbleOutline as CommentIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface Comment {
  id: number;
  comment: string;
  created_at: string;
  user: {
    name: string;
  };
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  priority: 'Low' | 'Medium' | 'High';
  category: string;
  comments?: Comment[];
}

interface DashboardAnnouncementsProps {
  maxItems?: number;
}

const DashboardAnnouncements: React.FC<DashboardAnnouncementsProps> = ({ maxItems = 3 }) => {
  const { user } = useAuth();
  const [expandedAnnouncement, setExpandedAnnouncement] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [announcementsWithComments, setAnnouncementsWithComments] = useState<Announcement[]>([]);

  useEffect(() => {
    // Initialize with mock data
    const mockAnnouncements: Announcement[] = [
      {
        id: 1,
        title: 'Scheduled Maintenance',
        content: 'There will be scheduled maintenance on the HVAC system this weekend.',
        date: '2024-05-15',
        priority: 'High',
        category: 'Maintenance',
        comments: []
      },
      {
        id: 2,
        title: 'New Staff Member',
        content: 'Welcome our new maintenance team member, John Smith.',
        date: '2024-05-14',
        priority: 'Medium',
        category: 'Staff',
        comments: []
      },
      {
        id: 3,
        title: 'Office Hours Update',
        content: 'Office hours will be extended during the holiday season.',
        date: '2024-05-13',
        priority: 'Low',
        category: 'General',
        comments: []
      },
    ];
    setAnnouncementsWithComments(mockAnnouncements);
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

  const handleCommentSubmit = (announcementId: number) => {
    if (!commentText.trim()) return;

    // In a real app, you would make an API call here to save the comment
    const newComment = {
      id: Date.now(), // Temporary ID, will be replaced by the server
      comment: commentText,
      created_at: new Date().toISOString(),
      user: {
        name: user?.name || 'Anonymous'
      }
    };

    setAnnouncementsWithComments(prev => 
      prev.map(announcement => 
        announcement.id === announcementId
          ? {
              ...announcement,
              comments: [...(announcement.comments || []), newComment]
            }
          : announcement
      )
    );

    setCommentText('');
  };

  return (
    <Box>
      <Box sx={{ mb: 2, pl: 3 }}>
        <Typography variant="h6" color="primary.main">
          Recent Announcements
        </Typography>
      </Box>
      <List>
        {announcementsWithComments.slice(0, maxItems).map((announcement) => (
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
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    {announcement.date}
                  </Typography>
                  <Chip 
                    label={announcement.category} 
                    variant="outlined" 
                    size="small"
                  />
                </Box>
              </Box>

              <Collapse in={expandedAnnouncement === announcement.id} sx={{ width: '100%', mt: 2 }}>
                <Box sx={{ width: '100%', mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Comments ({announcement.comments?.length || 0})
                  </Typography>
                  
                  {/* Comments List */}
                  <List sx={{ maxHeight: 200, overflow: 'auto', bgcolor: 'background.paper', borderRadius: 1, p: 1 }}>
                    {announcement.comments?.map((comment) => (
                      <ListItem key={comment.id} dense>
                        <ListItemAvatar>
                          <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem' }}>
                            {comment.user.name.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" component="span">
                              <strong>{comment.user.name}</strong> • {new Date(comment.created_at).toLocaleString()}
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
                  <Box sx={{ display: 'flex', mt: 2 }}>
                    <TextField
                      fullWidth
                      variant="outlined"
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
                    <IconButton 
                      color="primary" 
                      onClick={() => handleCommentSubmit(announcement.id)}
                      disabled={!commentText.trim()}
                    >
                      <SendIcon />
                    </IconButton>
                  </Box>
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
