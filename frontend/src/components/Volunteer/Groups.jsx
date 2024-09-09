import React from 'react';
import { Typography, Box, useTheme } from '@mui/material';

const Groups = ({ groups }) => {
  const theme = useTheme(); // Используем тему Material-UI

  return (
    <Box
      sx={{
        p: 2,
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        borderRadius: 1,
        backgroundColor: theme.palette.background.paper, // Цвет фона из темы
        color: theme.palette.text.primary, // Цвет текста из темы
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
