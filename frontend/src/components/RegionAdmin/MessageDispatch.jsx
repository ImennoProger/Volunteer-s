import React from 'react';
import { Box, Button, TextField } from '@mui/material';

const MessageDispatch = () => {
  const handleSend = () => {
    // Логика для отправки сообщений
    console.log('Message sent');
  };

  return (
    <Box>
      <Box component="form" sx={{ mb: 2 }}>
        <TextField fullWidth label="Сообщение" multiline rows={4} sx={{ mb: 2 }} />
        <Button variant="contained" color="primary" onClick={handleSend}>
          Отправить
        </Button>
      </Box>
    </Box>
  );
};

export default MessageDispatch;
