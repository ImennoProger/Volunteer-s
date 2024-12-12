import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Checkbox, ListItemText, Typography, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useTheme } from '@mui/material/styles'; // добавляем хук для работы с темой

const filterOptions = {
  country: ["Россия"],
  region: [
    "Московская область",
    "Ленинградская область",
    "Новосибирская область",
    "Свердловская область"
  ],
  city: [
    "Москва",
    "Санкт-Петербург",
    "Новосибирск",
    "Екатеринбург",
    "Нижний Новгород",
    "Казань"
  ],
  category: [
    "Экология",
    "Животные",
    "Образование",
    "Культура",
    "Социальная помощь",
    "Спортивное"
  ],
};

function EventFilters({ onFilterChange, events }) {
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
    const activeFilters = {
      ...filters,
      fromDate: dateRange.fromDate || null,
      toDate: dateRange.toDate || null
    };

    console.log('Active Filters:', activeFilters);
    console.log('Events before filtering:', events);

    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      const fromDate = activeFilters.fromDate ? new Date(activeFilters.fromDate) : null;
      const toDate = activeFilters.toDate ? new Date(activeFilters.toDate) : null;
      
      const dateInRange = (!fromDate || eventDate >= fromDate) &&
                         (!toDate || eventDate <= toDate);

      const matchesCountry = activeFilters.country.length === 0 || 
                           (event.country && activeFilters.country.includes(event.country));
      
      const matchesRegion = activeFilters.region.length === 0 || 
                          (event.region && activeFilters.region.includes(event.region));
      
      const matchesCity = activeFilters.city.length === 0 || 
                        (event.city && activeFilters.city.includes(event.city));
      
      const matchesCategory = activeFilters.category.length === 0 || 
                            (event.category && activeFilters.category.includes(event.category));

      console.log('Event:', event);
      console.log('Matches:', {
        dateInRange,
        matchesCountry,
        matchesRegion,
        matchesCity,
        matchesCategory
      });

      return dateInRange && matchesCountry && matchesRegion && matchesCity && matchesCategory;
    });

    console.log('Filtered Events:', filteredEvents);
    onFilterChange(filteredEvents);
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
    <Box sx={{ 
      mb: 2, 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2,
      width: '300px',
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginTop: '40px',
      position: 'relative'
    }}>
      {Object.keys(filterOptions).map((filterType, index) => (
        <Box key={filterType} sx={{ 
          position: 'relative',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          backgroundColor: '#fff',
          zIndex: open[filterType] ? 1001 : 1
        }}>
          <Box
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '10px 15px', 
              cursor: 'pointer', 
              backgroundColor: '#f5f5f5',
              position: 'relative',
              zIndex: 1002,
              '&:hover': {
                backgroundColor: '#eeeeee'
              }
            }}
            onClick={() => setOpen((prev) => ({ ...prev, [filterType]: !prev[filterType] }))}
          >
            <Typography 
              variant="body1" 
              flexGrow={1}
              sx={{ 
                fontWeight: 500,
                color: '#333'
              }}
            >
              {filterType === 'country' ? 'Страна' :
               filterType === 'region' ? 'Регион' :
               filterType === 'city' ? 'Город' :
               filterType === 'category' ? 'Категория' : ''}
            </Typography>
            <IconButton size="small">
              {open[filterType] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          {open[filterType] && (
            <Box sx={{ 
              position: 'absolute',
              top: 'calc(100% + 1px)',
              left: -1,
              right: -1,
              maxHeight: '200px', 
              overflowY: 'auto', 
              padding: '10px',
              backgroundColor: '#fff',
              zIndex: 1001,
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0',
              borderRadius: '0 0 4px 4px',
              width: 'calc(100% + 2px)'
            }}>
              {filterOptions[filterType].map((item) => (
                <Box
                  key={item}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 1, 
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                  onClick={handleSelect(filterType, item)}
                >
                  <Checkbox
                    checked={filters[filterType].includes(item)}
                    size="small"
                  />
                  <ListItemText 
                    primary={item} 
                    primaryTypographyProps={{
                      fontSize: '14px',
                      color: '#333'
                    }}
                  />
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
          backgroundColor: '#fff',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#e0e0e0',
            },
            '&:hover fieldset': {
              borderColor: '#bdbdbd',
            }
          }
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
          backgroundColor: '#fff',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#e0e0e0',
            },
            '&:hover fieldset': {
              borderColor: '#bdbdbd',
            }
          }
        }}
      />

      <Button
        variant="contained"
        onClick={handleFilterChange}
        sx={{ 
          width: '100%',
          backgroundColor: '#097272',
          '&:hover': {
            backgroundColor: '#065757'
          },
          padding: '10px',
          textTransform: 'none',
          fontSize: '16px'
        }}
      >
        Применить
      </Button>
    </Box>
  );
}

export default EventFilters;
