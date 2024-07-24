import React from 'react';
import { Typography, Box } from '@mui/joy';

const Groups = ({ groups }) => {
  return (
    <div>
      <Box>
        {groups.map((group, index) => (
          <Typography key={index}>{group.name}</Typography>
        ))}
      </Box>
    </div>
  );
};

export default Groups;
