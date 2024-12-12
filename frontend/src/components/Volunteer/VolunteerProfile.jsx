import React, { useState, useEffect } from 'react';
import { Avatar, Button, TextField, Typography, Box, Tab, Tabs, Grid, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import vkLogo from '../../images/vk-logo.png';
import avatarImage from '../../images/your-avatar-image.gif';
import '../../pages/globalStyless.css';
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
const VolunteerProfile = () => {
  const [profile, setProfile] = useState({
    photo: avatarImage,
    firstName: 'Имя',
    lastName: 'Фамилия',
    phoneNumber: '',
    email: '',
    city: '',
    country: '',
  });

  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Запрос данных профиля с сервера
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/profile`,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }); // Замените на актуальный URL
        const data = await response.json();
        setProfile({
          photo: data.avatar_image || avatarImage,
          firstName: data.user_name,
          lastName: data.user_surname,
          email: data.email,
          city: data.city_name, // Преобразовать в название города, если нужно
          country: data.country_name, // Преобразовать в название страны
        });
      } catch (error) {
        console.error('Ошибка при загрузке профиля:', error);
      }
    };

    fetchUserProfile();
  }, []);

  
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
    <Box sx={{ 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row', 
      p: 2,
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%',
      ml: isMobile ? 'auto' : '0px',
      mr: isMobile ? 'auto' : '200px'
    }}>
      {/* Боковая панель */}
      <Box
        sx={{
          width: isMobile ? '100%' : '25%',
          p: 2,
          backgroundColor: 'var(--secondary-bg-color)',
          textAlign: 'center',
          color: 'var(--primary-text-color)',
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
      <Box sx={{ 
        width: isMobile ? '100%' : '75%', 
        p: 2,
        pl: isMobile ? 2 : 4,
        pr: isMobile ? 2 : 6
      }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ mb: 3 }}
          variant={isMobile ? 'scrollable' : 'standard'}
        >
          <Tab label="Профиль" onMouseDown={preventDefaultFocus} />
          <Tab label="Баллы" onMouseDown={preventDefaultFocus} />
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
            <Typography variant="h6" sx={{ mb: 3 }}>История баллов</Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2 
            }}>
              {[
                {
                  date: '15.11.2023',
                  event: 'Помощь в организации городского субботника',
                  points: 150,
                  status: 'получено'
                },
                {
                  date: '02.11.2023',
                  event: 'Участие в благотворительном марафоне',
                  points: 200,
                  status: 'получено'
                },
                {
                  date: '25.10.2023',
                  event: 'Помощь в приюте для животных',
                  points: 100,
                  status: 'получено'
                },
                {
                  date: '15.10.2023',
                  event: 'Сбор макулатуры',
                  points: 50,
                  status: 'получено'
                }
              ].map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    backgroundColor: 'var(--secondary-bg-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 1
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" sx={{ color: 'var(--primary-text-color)' }}>
                      {item.event}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--secondary-text-color)' }}>
                      {item.date}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1 
                  }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'var(--accent-color)',
                        fontWeight: 'bold' 
                      }}
                    >
                      +{item.points}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'var(--success-color)',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        padding: '4px 8px',
                        borderRadius: '4px'
                      }}
                    >
                      {item.status}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Диалоговое окно подтверждения удаления аккаунта */}
      <Dialog open={openDialog} onClose={handleCancelDelete}>
        <DialogTitle>Удаление аккаунта</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо.</Typography>
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
