import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const Friends = ({ friends }) => {
  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Box>
        {friends.map((friend, index) => (
          <Typography key={index} sx={{ mb: 1 }}>
            {friend.name}
          </Typography>
        ))}
      </Box>
    </Paper>
  );
};

export default Friends;
