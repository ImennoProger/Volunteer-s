import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const Groups = ({ groups }) => {
  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Box>
        {groups.map((group, index) => (
          <Typography key={index} sx={{ mb: 1 }}>
            {group.name}
          </Typography>
        ))}
      </Box>
    </Paper>
  );
};

export default Groups;
