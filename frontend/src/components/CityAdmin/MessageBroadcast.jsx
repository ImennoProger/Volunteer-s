import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
} from '@mui/material';

const MessageBroadcast = () => {
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = () => {

    console.log('Message sent:', message);
    setMessage('');
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Box>
        <TextField
          fullWidth
          label="Сообщение"
          value={message}
          onChange={handleChange}
          multiline
          rows={4}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleSend}>
          Отправить всем
        </Button>
      </Box>
    </Paper>
  );
};

export default MessageBroadcast;
