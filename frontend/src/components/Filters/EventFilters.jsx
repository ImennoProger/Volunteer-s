import React, { useState } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField, Button, Grid } from '@mui/material';

function EventFilters({ onFilterChange }) {
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState(''); // Добавляем состояние для региона
  const [city, setCity] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [category, setCategory] = useState('');

  const handleFilterChange = () => {
    onFilterChange({
      country,
      region, // Передаем регион в функцию фильтрации
      city,
      fromDate,
      toDate,
      category,
    });
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Страна</InputLabel>
            <Select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <MenuItem value="Россия">Россия</MenuItem>
              <MenuItem value="США">США</MenuItem>
              <MenuItem value="Канада">Канада</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          {/* Поле для выбора региона */}
          <FormControl fullWidth>
            <InputLabel>Регион</InputLabel>
            <Select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <MenuItem value="Центральный федеральный округ">Центральный федеральный округ</MenuItem>
              <MenuItem value="Приволжский федеральный округ">Приволжский федеральный округ</MenuItem>
              <MenuItem value="Северо-Западный федеральный округ">Северо-Западный федеральный округ</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Город</InputLabel>
            <Select
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <MenuItem value="Москва">Москва</MenuItem>
              <MenuItem value="Нью-Йорк">Нью-Йорк</MenuItem>
              <MenuItem value="Торонто">Торонто</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="От"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="До"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Категория</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="Спорт">Спорт</MenuItem>
              <MenuItem value="Культура">Культура</MenuItem>
              <MenuItem value="Наука">Наука</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Контейнер для центрирования кнопки */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center'}}>
            <Button
              variant="contained"
              onClick={handleFilterChange}
              sx={{ width: '50%', maxWidth: 300 }} // Максимальная ширина кнопки
            >
              Применить
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default EventFilters;
