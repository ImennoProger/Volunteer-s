import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Box } from '@mui/material';

const CreateRanks = () => {
  const [rank, setRank] = useState({
    name: '',
    points: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRank(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCreate = () => {
    // Логика для создания ранга
    console.log('Rank created:', rank);
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Box component="form">
        <TextField
          fullWidth
          label="Название ранга"
          name="name"
          value={rank.name}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Количество баллов"
          name="points"
          type="number"
          value={rank.points}
          onChange={handleChange}
          inputProps={{ min: 0 }}  // Устанавливаем минимальное значение
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleCreate}>
          Создать ранг
        </Button>
      </Box>
    </Paper>
  );
};

export default CreateRanks;