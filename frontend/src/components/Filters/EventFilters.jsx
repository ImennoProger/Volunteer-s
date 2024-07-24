import React, { useState } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';

function EventFilters({ onFilterChange }) {
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [category, setCategory] = useState('');

  const handleFilterChange = () => {
    onFilterChange({
      country,
      city,
      fromDate,
      toDate,
      category
    });
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <FormControl fullWidth>
        <InputLabel>Страна</InputLabel>
        <Select value={country} onChange={(e) => setCountry(e.target.value)}>
          <MenuItem value="Россия">Россия</MenuItem>
          <MenuItem value="США">США</MenuItem>
          <MenuItem value="Канада">Канада</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Город</InputLabel>
        <Select value={city} onChange={(e) => setCity(e.target.value)}>
          <MenuItem value="Москва">Москва</MenuItem>
          <MenuItem value="Нью-Йорк">Нью-Йорк</MenuItem>
          <MenuItem value="Торонто">Торонто</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="От"
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        sx={{
          width: 550, // Увеличиваем ширину календаря
        }}
      />

      <TextField
        label="До"
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        sx={{
          width: 550, // Увеличиваем ширину календаря
        }}
      />

      <FormControl fullWidth>
        <InputLabel>Категория</InputLabel>
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          <MenuItem value="Спорт">Спорт</MenuItem>
          <MenuItem value="Культура">Культура</MenuItem>
          <MenuItem value="Наука">Наука</MenuItem>
        </Select>
      </FormControl>

      <Button variant="contained" onClick={handleFilterChange}
        sx={{
          width: 350,
        }}
      >
        Применить
      </Button>
    </Box>
  );
}

export default EventFilters;
