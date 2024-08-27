import React, { useState } from 'react';
import { Avatar, Button, TextField, Typography, Paper, Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const countries = ['Россия', 'США'];
const cities = {
  Россия: ['Москва', 'Санкт-Петербург', 'Новосибирск'],
  США: ['Нью-Йорк', 'Лос-Анджелес', 'Чикаго'],
};

const CityAdminProfile = () => {
  const [profile, setProfile] = useState({
    photo: '',
    email: 'example@example.com',
    password: 'password123',
    surname: 'Иванов',
    name: 'Иван',
    patronymic: 'Иванович',
    age: '30',
    country: 'Россия',
    city: 'Москва',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(profile.country);
  const [selectedCity, setSelectedCity] = useState(profile.city);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'age' && value < 0) return;

    setProfile(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    setSelectedCountry(newCountry);
    setSelectedCity(cities[newCountry][0]);
    setProfile(prevState => ({
      ...prevState,
      country: newCountry,
      city: cities[newCountry][0]
    }));
  };

  const handleCityChange = (e) => {
    const newCity = e.target.value;
    setSelectedCity(newCity);
    setProfile(prevState => ({
      ...prevState,
      city: newCity
    }));
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile({ ...profile, photo: e.target.result });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Profile saved:', profile);
  };

  const handleDeleteAccount = () => {
    console.log('Account deleted');
  };

  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Настройки профиля
      </Typography>
      <Avatar src={profile.photo} sx={{ width: 100, height: 100, mb: 2 }} />
      <Box component="form">
        <Button variant="contained" component="label" sx={{ mb: 2 }}>
          Загрузить фото
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handlePhotoChange}
          />
        </Button>
        {profile.photo && (
          <Box sx={{ mb: 2 }}>
            <img
              src={profile.photo}
              alt="Profile"
              style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '50%' }}
            />
          </Box>
        )}
        {/* Поля ввода или текст */}
        {!isEditing ? (
          <>
            <Typography variant="body1" sx={{ mb: 2 }}>Email: {profile.email}</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>Фамилия: {profile.surname}</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>Имя: {profile.name}</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>Отчество: {profile.patronymic}</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>Возраст: {profile.age}</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>Страна: {profile.country}</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>Город: {profile.city}</Typography>
          </>
        ) : (
          <>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Фамилия"
              name="surname"
              value={profile.surname}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Имя"
              name="name"
              value={profile.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Отчество"
              name="patronymic"
              value={profile.patronymic}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Возраст"
              name="age"
              type="number"
              value={profile.age}
              onChange={handleChange}
              inputProps={{ min: 0 }}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Страна</InputLabel>
              <Select
                value={selectedCountry}
                onChange={handleCountryChange}
                label="Страна"
              >
                {countries.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Город</InputLabel>
              <Select
                value={selectedCity}
                onChange={handleCityChange}
                label="Город"
              >
                {cities[selectedCountry]?.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}
        <Box sx={{ mt: 2 }}>
          {!isEditing ? (
            <Button variant="contained" color="primary" onClick={() => setIsEditing(true)}>
              Редактировать
            </Button>
          ) : (
            <>
              <Button variant="contained" color="primary" onClick={handleSave} sx={{ mr: 2 }}>
                Сохранить
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => setIsEditing(false)}>
                Отмена
              </Button>
            </>
          )}
        </Box>
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" color="error" onClick={handleDeleteAccount}>
            Удалить аккаунт
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default CityAdminProfile;
