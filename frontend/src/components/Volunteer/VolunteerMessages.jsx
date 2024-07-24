import React from 'react';
import { Typography, Box } from '@mui/joy';

const VolunteerMessages = ({ messages }) => {
  return (
    <div>
      <Box>
        {messages.map((message, index) => (
          <div key={index}>
            <Typography>{message.content}</Typography>
          </div>
        ))}
      </Box>
    </div>
  );
};

export default VolunteerMessages;
