import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const VolunteerMessages = ({ messages }) => {
  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Box>
        {messages.map((message, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography>{message.content}</Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default VolunteerMessages;
