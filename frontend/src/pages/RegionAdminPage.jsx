import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemText, ListItemIcon, Typography, Paper, IconButton, BottomNavigation, BottomNavigationAction, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupIcon from '@mui/icons-material/Group';
import EventIcon from '@mui/icons-material/Event';
import MessageIcon from '@mui/icons-material/Message';
import BarChartIcon from '@mui/icons-material/BarChart';

import RegionAdminProfile from '../components/RegionAdmin/RegionAdminProfile';
import ManageVolunteers from '../components/RegionAdmin/ManageVolunteers';
import ManageEvents from '../components/RegionAdmin/ManageEvents';
import MessageDispatch from '../components/RegionAdmin/MessageDispatch';
import RegionalStatistics from '../components/RegionAdmin/RegionalStatistics';

const drawerWidth = 240;

const RegionAdminPage = () => {
  const [selectedSection, setSelectedSection] = useState('profile');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const renderContent = () => {
    switch (selectedSection) {
      case 'profile':
        return <RegionAdminProfile />;
      case 'volunteers':
        return <ManageVolunteers />;
      case 'events':
        return <ManageEvents />;
      case 'messages':
        return <MessageDispatch />;
      case 'statistics':
        return <RegionalStatistics />;
      default:
        return <RegionAdminProfile />;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>      {/* Мобильная навигационная панель */}
      {isMobile ? (
        <>
          {/* Кнопка меню для мобильных устройств */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1201 }}
          >
            <MenuIcon fontSize="large" />
          </IconButton>

          <Drawer
            anchor="bottom"
            variant="persistent"
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            sx={{
              '& .MuiDrawer-paper': {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxSizing: 'border-box',
                border: 'none',
                height: 'auto',
                width: '100%', 
              },
            }}
          >
            <BottomNavigation showLabels>
              <BottomNavigationAction
                label="Профиль"
                icon={<AccountCircleIcon />}
                onClick={() => { setSelectedSection('profile'); setIsDrawerOpen(false); }}
              />
              <BottomNavigationAction
                label="Волонтёры"
                icon={<GroupIcon />}
                onClick={() => { setSelectedSection('volunteers'); setIsDrawerOpen(false); }}
              />
              <BottomNavigationAction
                label="Мероприятия"
                icon={<EventIcon />}
                onClick={() => { setSelectedSection('events'); setIsDrawerOpen(false); }}
              />
              <BottomNavigationAction
                label="Сообщения"
                icon={<MessageIcon />}
                onClick={() => { setSelectedSection('messages'); setIsDrawerOpen(false); }}
              />
              <BottomNavigationAction
                label="Статистика"
                icon={<BarChartIcon />}
                onClick={() => { setSelectedSection('statistics'); setIsDrawerOpen(false); }}
              />
            </BottomNavigation>
          </Drawer>
        </>
      ) : (
        // Навигационная панель для больших экранов
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
              border: 'none',
              marginTop: '80px', // Отступ, чтобы панель не перекрывала шапку
              backgroundColor: 'rgba(255, 255, 255, 0.00001)',
            },
          }}
        >
          <List>
            <Typography variant="h5" gutterBottom sx={{ mt: 3, ml: 3, mb: 3, fontWeight: 'bold', color: 'black' }}>
              Администратор региона
            </Typography>
            <ListItem button onClick={() => setSelectedSection('profile')}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Настройки профиля" />
            </ListItem>
            <ListItem button onClick={() => setSelectedSection('volunteers')}>
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary="Управление волонтёрами" />
            </ListItem>
            <ListItem button onClick={() => setSelectedSection('events')}>
              <ListItemIcon>
                <EventIcon />
              </ListItemIcon>
              <ListItemText primary="Управление мероприятиями" />
            </ListItem>
            <ListItem button onClick={() => setSelectedSection('messages')}>
              <ListItemIcon>
                <MessageIcon />
              </ListItemIcon>
              <ListItemText primary="Рассылка сообщений" />
            </ListItem>
            <ListItem button onClick={() => setSelectedSection('statistics')}>
              <ListItemIcon>
                <BarChartIcon />
              </ListItemIcon>
              <ListItemText primary="Статистика по региону" />
            </ListItem>
          </List>
        </Drawer>
      )}

      {/* Основной контент */}
      <Box
        sx={{
          flexGrow: 1,
          ml: isMobile ? 0 : '50px', // Отступ для ПК
          p: 4,
          overflow: 'auto', 
          width: '100%', 
        }}
      >
        <Paper elevation={3} sx={{ p: 4 }}>
          {renderContent()}
        </Paper>
      </Box>
    </Box>
  );
};

export default RegionAdminPage;
