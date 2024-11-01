import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Checkbox, ListItemText, Typography, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useTheme } from '@mui/material/styles';

function EventFilters({ onFilterChange }) {
  const theme = useTheme();
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
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/categories'); // Замените на ваш URL
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setCategories(data); // Устанавливаем полученные категории
    } catch (error) {
      setErrorCategories(error.message);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const filterOptions = {
    country: ["Россия", "США", "Канада"],
    region: ["Центральный федеральный округ", "Приволжский федеральный округ", "Северо-Западный федеральный округ"],
    city: ["Москва", "Иркутск", "Ангарск"],
    category: categories.map(category => category.category_name), // Получаем категории из API
  };

  return (
    <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {errorCategories && (
        <Typography color="error">Ошибка при загрузке категорий: {errorCategories}</Typography>
      )}
      {loadingCategories ? (
        <Typography>Загрузка категорий...</Typography>
      ) : (
        Object.keys(filterOptions).map((filterType) => (
          <Box key={filterType} sx={{ position: 'relative', border: '1px solid #ddd', borderRadius: 1 }}>
            <Box
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: 1, 
                cursor: 'pointer', 
                backgroundColor: theme.palette.background.paper
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
                backgroundColor: theme.palette.background.default 
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
        ))
      )}

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
          backgroundColor: theme.palette.background.paper, 
          color: theme.palette.text.primary 
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
