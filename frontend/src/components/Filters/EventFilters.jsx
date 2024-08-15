import React, { useState } from 'react';
import { Box, TextField, MenuItem, Button, Grid } from '@mui/material';

function EventFilters({ onFilterChange }) {
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [category, setCategory] = useState('');

  const handleFilterChange = () => {
    onFilterChange({
      country,
      region,
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
          <TextField
            select
            label="Страна"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            fullWidth
          >
            <MenuItem value="Россия">Россия</MenuItem>
            <MenuItem value="США">США</MenuItem>
            <MenuItem value="Канада">Канада</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            select
            label="Регион"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            fullWidth
          >
            <MenuItem value="Центральный федеральный округ">Центральный федеральный округ</MenuItem>
            <MenuItem value="Приволжский федеральный округ">Приволжский федеральный округ</MenuItem>
            <MenuItem value="Северо-Западный федеральный округ">Северо-Западный федеральный округ</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            select
            label="Город"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            fullWidth
          >
            <MenuItem value="Москва">Москва</MenuItem>
            <MenuItem value="Нью-Йорк">Нью-Йорк</MenuItem>
            <MenuItem value="Торонто">Торонто</MenuItem>
          </TextField>
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
          <TextField
            select
            label="Категория"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
          >
            <MenuItem value="Спорт">Спорт</MenuItem>
            <MenuItem value="Культура">Культура</MenuItem>
            <MenuItem value="Наука">Наука</MenuItem>
          </TextField>
        </Grid>

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
