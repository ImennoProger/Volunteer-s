import React from 'react';
import { Typography, Box } from '@mui/joy';

const Friends = ({ friends }) => {
  return (
    <div>
      <Box>
        {friends.map((friend, index) => (
          <Typography key={index}>{friend.name}</Typography>
        ))}
      </Box>
    </div>
  );
};

export default Friends;
