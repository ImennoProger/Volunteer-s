import React, { useState } from 'react';
import { TextField, Button, Paper, Box } from '@mui/material';

const CreateCategories = () => {
  const [category, setCategory] = useState({
    name: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCreate = () => {
    // Логика для создания категории
    console.log('Category created:', category);
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Box component="form">
        <TextField
          fullWidth
          label="Название категории"
          name="name"
          value={category.name}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleCreate}>
          Создать категорию
        </Button>
      </Box>
    </Paper>
  );
};

export default CreateCategories;
