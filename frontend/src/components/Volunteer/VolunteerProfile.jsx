import React, { useState } from 'react';
import { Avatar, Button, TextField, Typography, Box, Tab, Tabs, Grid, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import vkLogo from '../../images/vk-logo.png';
import avatarImage from '../../images/your-avatar-image.gif';
import '../../pages/globalStyless.css';

const VolunteerProfile = () => {
  const [profile, setProfile] = useState({
    photo: avatarImage,
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
  const [openDialog, setOpenDialog] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    setOpenDialog(false);
    console.log('Account deleted');
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
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
    <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', p: 2 }}>
      {/* Боковая панель */}
      <Box
        sx={{
          width: isMobile ? '100%' : '25%',
          p: 2,
          backgroundColor: 'var(--secondary-bg-color)',  // Переменная для фона
          textAlign: 'center',
          color: 'var(--primary-text-color)',  // Цвет текста
          mb: isMobile ? 2 : 0,
        }}
      >
        {/* Аватарка */}
        <Avatar
          src={profile.photo}
          sx={{
            width: isMobile ? 100 : 150,
            height: isMobile ? 100 : 150,
            mb: 2,
            margin: '0 auto',
            '& img': { objectFit: 'cover' },
          }}
        />
        <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ color: 'var(--primary-text-color)' }}>
          {`${profile.firstName} ${profile.lastName}`}
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--secondary-text-color)' }}>
          Ранг
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2, color: 'var(--primary-text-color)' }}>
          <Grid item xs={6}>
            <Typography variant={isMobile ? 'body2' : 'body1'}>Достижений</Typography>
            <Typography variant={isMobile ? 'h6' : 'h5'}>2</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant={isMobile ? 'body2' : 'body1'}>Баллов</Typography>
            <Typography variant={isMobile ? 'h6' : 'h5'}>1234</Typography>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Box
            component="img"
            src={vkLogo}
            alt="VK"
            sx={{ cursor: 'pointer', width: isMobile ? 30 : 50 }}
            onClick={() => handleLogoClick('vk')}
          />
        </Box>
      </Box>

      {/* Основная секция */}
      <Box sx={{ width: isMobile ? '100%' : '75%', p: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ mb: 3 }}
          variant={isMobile ? 'scrollable' : 'standard'}
        >
          <Tab label="Профиль" onMouseDown={preventDefaultFocus} />
          <Tab label="Достижения" onMouseDown={preventDefaultFocus} />
        </Tabs>

        {activeTab === 0 && (
          <Box component="form">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Имя"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Фамилия"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Номер телефона"
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Город"
                  name="city"
                  value={profile.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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

            <Box sx={{ mt: 2, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
              {!isEditing ? (
                <>
                  <Button
                    variant="contained"
                    onClick={handleEditClick}
                    sx={{ flex: 1, textAlign: 'center' }}
                  >
                    Редактировать
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeleteAccount}
                    sx={{ flex: 1, textAlign: 'center' }}
                  >
                    Удалить аккаунт
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    sx={{ flex: 1, textAlign: 'center' }}
                  >
                    Сохранить
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    sx={{ flex: 1, textAlign: 'center' }}
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

      {/* Диалоговое окно подтверждения удаления аккаунта */}
      <Dialog open={openDialog} onClose={handleCancelDelete}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Отмена</Button>
          <Button onClick={handleConfirmDelete} color="error">Удалить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VolunteerProfile;
