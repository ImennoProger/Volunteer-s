import React from 'react';
import { Typography, Paper } from '@mui/material';

const Balance = ({ coins }) => {
  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography>Монеты: {coins}</Typography>
    </Paper>
  );
};

export default Balance;
