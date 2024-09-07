import React, { useState } from 'react';
import { Box, TextField, Button, Checkbox, ListItemText, Typography, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useTheme } from '@mui/material/styles'; // добавляем хук для работы с темой

const filterOptions = {
  country: ["Россия", "США", "Канада"],
  region: ["Центральный федеральный округ", "Приволжский федеральный округ", "Северо-Западный федеральный округ"],
  city: ["Москва", "Нью-Йорк", "Торонто"],
  category: ["Спорт", "Культура", "Наука"],
};

function EventFilters({ onFilterChange }) {
  const theme = useTheme(); // получаем текущую тему
  const [filters, setFilters] = useState({
    country: [],
    region: [],
    city: [],
    category: [],
  });
  const [open, setOpen] = useState({
    country: false,
    region: false,
    city: false,
    category: false,
  });
  const [dateRange, setDateRange] = useState({ fromDate: '', toDate: '' });

  const handleFilterChange = () => {
    onFilterChange({
      ...filters,
      ...dateRange,
    });
  };

  const handleSelect = (filterType, value) => () => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value],
    }));
  };

  const handleDateChange = (e) => {
    setDateRange((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {Object.keys(filterOptions).map((filterType) => (
        <Box key={filterType} sx={{ position: 'relative', border: '1px solid #ddd', borderRadius: 1 }}>
          <Box
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: 1, 
              cursor: 'pointer', 
              backgroundColor: theme.palette.background.paper // здесь задаём фон в зависимости от темы
            }}
            onClick={() => setOpen((prev) => ({ ...prev, [filterType]: !prev[filterType] }))}
          >
            <Typography variant="body1" flexGrow={1}>
              {filterType === 'country' ? 'Страна' :
               filterType === 'region' ? 'Регион' :
               filterType === 'city' ? 'Город' :
               filterType === 'category' ? 'Категория' : ''}
            </Typography>
            <IconButton>
              {open[filterType] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          {open[filterType] && (
            <Box sx={{ 
              maxHeight: 200, 
              overflowY: 'auto', 
              borderTop: '1px solid #ddd', 
              padding: 1,
              backgroundColor: theme.palette.background.default // цвет фона списка
            }}>
              {filterOptions[filterType].map((item) => (
                <Box
                  key={item}
                  sx={{ display: 'flex', alignItems: 'center', mb: 1, cursor: 'pointer' }}
                  onClick={handleSelect(filterType, item)}
                >
                  <Checkbox
                    checked={filters[filterType].includes(item)}
                  />
                  <ListItemText primary={item} />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      ))}

      <TextField
        label="От"
        type="date"
        name="fromDate"
        value={dateRange.fromDate}
        onChange={handleDateChange}
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
        sx={{ 
          backgroundColor: theme.palette.background.paper, // цвет фона поля ввода
          color: theme.palette.text.primary // цвет текста в зависимости от темы
        }}
      />

      <TextField
        label="До"
        type="date"
        name="toDate"
        value={dateRange.toDate}
        onChange={handleDateChange}
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
        sx={{ 
          backgroundColor: theme.palette.background.paper, 
          color: theme.palette.text.primary 
        }}
      />

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          onClick={handleFilterChange}
          sx={{ width: '50%', maxWidth: 300 }}
        >
          Применить
        </Button>
      </Box>
    </Box>
  );
}

export default EventFilters;
