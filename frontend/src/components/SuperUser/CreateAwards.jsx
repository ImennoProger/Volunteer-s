import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Box } from '@mui/material';

const CreateAwards = () => {
  const [award, setAward] = useState({
    name: '',
    points: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAward(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCreate = () => {
    // Логика для создания награды
    console.log('Award created:', award);
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Box component="form">
        <TextField
          fullWidth
          label="Название награды"
          name="name"
          value={award.name}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Количество баллов"
          name="points"
          type="number"
          value={award.points}
          onChange={handleChange}
          inputProps={{ min: 0 }}  // Устанавливаем минимальное значение
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleCreate}>
          Создать награду
        </Button>
      </Box>
    </Paper>
  );
};

export default CreateAwards;
