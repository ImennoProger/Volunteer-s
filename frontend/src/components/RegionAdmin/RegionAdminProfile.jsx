// src/components/RegionAdmin/RegionAdminProfile.jsx
import React, { useState } from 'react';
import { Avatar, Button, TextField, Typography, Paper, Box } from '@mui/material';

const RegionAdminProfile = () => {
  const [profile, setProfile] = useState({
    photo: '',
    email: '',
    password: '',
    fullName: '',
    age: '',
    country: '',
    city: '',
    username: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Проверка для возраста
    if (name === 'age' && value < 0) return;

    setProfile(prevState => ({
      ...prevState,
      [name]: value
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
    // Логика для сохранения профиля
    console.log('Profile saved:', profile);
  };

  const handleDeleteAccount = () => {
    // Логика для удаления аккаунта
    console.log('Account deleted');
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
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
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={profile.username}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
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
          label="Пароль"
          name="password"
          type="password"
          value={profile.password}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="ФИО"
          name="fullName"
          value={profile.fullName}
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
          inputProps={{ min: 0 }}  // Устанавливаем минимальное значение
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Страна"
          name="country"
          value={profile.country}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Город"
          name="city"
          value={profile.city}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleSave} sx={{ mr: 2 }}>
          Сохранить
        </Button>
        <Button variant="outlined" color="error" onClick={handleDeleteAccount}>
          Удалить аккаунт
        </Button>
      </Box>
    </Paper>
  );
};

export default RegionAdminProfile;
