import React from 'react';
import { Typography, Box } from '@mui/material';

const Groups = ({ groups }) => {
  return (
    <Box
      sx={{
        p: 2,
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        borderRadius: 1, 
        backgroundColor: '#fff' 
      }}
    >
      <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Группы
      </Typography>
        {groups.map((group, index) => (
          <Typography key={index} sx={{ mb: 1 }}>
            {group.name}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default Groups;
