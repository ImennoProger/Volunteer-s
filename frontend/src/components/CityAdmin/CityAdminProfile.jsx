import React, { useState, useRef } from 'react';
import { Avatar, Button, TextField, Typography, Box, Tab, Tabs, Grid } from '@mui/material';
import vkLogo from '../../images/vk-logo.png';

// Импортируем изображение из папки /image
import avatarImage from '../../images/your-avatar-image.gif'; // Замените "your-avatar-image.gif" на ваше изображение

import '../../pages/globalStyless.css';

const VolunteerProfile = () => {
  const [profile, setProfile] = useState({
    photo: avatarImage,  // Устанавливаем путь к аватарке
    firstName: 'Имя',
    lastName: 'Фамилия',
    phoneNumber: '+7 950 942 49 11',
    email: 'Почта.чипс@mail.ru',
    city: 'Иркутск',
    state: 'WA',
    postcode: '31005',
    country: 'United States',
  });

  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const editButtonRef = useRef(null);
  const saveButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Profile saved:', profile);
    if (saveButtonRef.current) {
      saveButtonRef.current.blur(); // Убираем выделение кнопки после нажатия
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    if (editButtonRef.current) {
      editButtonRef.current.blur(); // Убираем выделение кнопки после нажатия
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (cancelButtonRef.current) {
      cancelButtonRef.current.blur(); // Убираем выделение кнопки после нажатия
    }
  };

  const preventDefaultFocus = (e) => e.preventDefault();

  const handleLogoClick = (platform) => {
    switch (platform) {
      case 'vk':
        window.open('https://vk.com', '_blank');
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ display: 'flex', p: 2 }}>
      {/* Боковая панель */}
      <Box sx={{ width: '25%', p: 2, backgroundColor: '#f5f5f5', textAlign: 'center' }}>
        {/* Аватарка, размещенная по центру и увеличенного размера */}
        <Avatar
          src={profile.photo}
          sx={{
            width: 150,  // Увеличенный размер аватарки
            height: 150, // Увеличенный размер аватарки
            mb: 2,
            margin: '0 auto',  // Центрирование аватарки
            '& img': {
              objectFit: 'cover', // Обеспечивает правильное отображение анимации
            },
          }}
        />
        <Typography variant="h6">{`${profile.firstName} ${profile.lastName}`}</Typography>
        <Typography variant="body2">Ранг</Typography>

        {/* Убраны строки с информацией о возможностях */}
        
        {/* Статистика и логотипы */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Typography variant="body1">Достижений</Typography>
            <Typography variant="h6">2</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">Баллов</Typography>
            <Typography variant="h6">1234</Typography>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Box component="img" src={vkLogo} alt="VK" sx={{ cursor: 'pointer', width: 50 }} onClick={() => handleLogoClick('vk')} />
        </Box>
      </Box>

      {/* Основная секция */}
      <Box sx={{ width: '75%', p: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab 
            label="Профиль"
            onMouseDown={preventDefaultFocus} // Убираем стандартное поведение при нажатии
          />
          <Tab 
            label="Достижения"
            onMouseDown={preventDefaultFocus} // Убираем стандартное поведение при нажатии
          />
        </Tabs>

        {activeTab === 0 && (
          <Box component="form">
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Имя"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Фамилия"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Номер телефона"
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Город"
                  name="city"
                  value={profile.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Страна"
                  name="country"
                  value={profile.country}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              {!isEditing ? (
                <Button
                  variant="contained"
                  onClick={handleEditClick}
                  ref={editButtonRef}
                  onMouseDown={preventDefaultFocus} // Убираем стандартное поведение при нажатии
                >
                  Редактировать
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    ref={saveButtonRef}
                    sx={{ mr: 2 }}
                    onMouseDown={preventDefaultFocus} // Убираем стандартное поведение при нажатии
                  >
                    Сохранить
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    ref={cancelButtonRef}
                    onMouseDown={preventDefaultFocus} // Убираем стандартное поведение при нажатии
                  >
                    Отмена
                  </Button>
                </>
              )}
            </Box>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="h6">Достижения</Typography>
            <Typography variant="body2">Здесь будет отображаться список достижений пользователя.</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default VolunteerProfile;
