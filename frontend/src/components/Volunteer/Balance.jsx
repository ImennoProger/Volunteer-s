import React from 'react';
import { Typography } from '@mui/joy';

const Balance = ({ coins }) => {
  return (
    <div>
      <Typography>Монеты: {coins}</Typography>
    </div>
  );
};

export default Balance;
