import React, { useState } from 'react';
import { Box, Drawer, List, ListItemText, Typography, IconButton, BottomNavigation, useMediaQuery, useTheme, Paper } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupIcon from '@mui/icons-material/Group';
import EventIcon from '@mui/icons-material/Event';
import MessageIcon from '@mui/icons-material/Message';
import BarChartIcon from '@mui/icons-material/BarChart';

import { StyledBottomNavigationAction, StyledListItem, StyledListItemIcon } from './UsersPage';
import CityAdminProfile from '../components/CityAdmin/CityAdminProfile';
import ManageVolunteers from '../components/CityAdmin/ManageVolunteers';
import ManageEvents from '../components/CityAdmin/ManageEvents';
import MessageBroadcast from '../components/CityAdmin/MessageBroadcast';
import CityStatistics from '../components/CityAdmin/CityStatistics';

const drawerWidth = 300;

const CityAdminPage = () => {
  const [selectedSection, setSelectedSection] = useState('profile');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const renderContent = () => {
    switch (selectedSection) {
      case 'profile':
        return <CityAdminProfile />;
      case 'volunteers':
        return <ManageVolunteers />;
      case 'events':
        return <ManageEvents />;
      case 'messages':
        return <MessageBroadcast />;
      case 'statistics':
        return <CityStatistics />;
      default:
        return <CityAdminProfile />;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Мобильная навигационная панель */}
      {isMobile ? (
        <>
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
            <BottomNavigation
              showLabels
              value={selectedSection}
              onChange={(event, newValue) => {
                setSelectedSection(newValue);
                if (isMobile) setIsDrawerOpen(false);
              }}
              sx={{ width: '100%' }}
            >
              <StyledBottomNavigationAction
                label="Профиль"
                value="profile"
                icon={<AccountCircleIcon />}
              />
              <StyledBottomNavigationAction
                label="Волонтёры"
                value="volunteers"
                icon={<GroupIcon />}
              />
              <StyledBottomNavigationAction
                label="Мероприятия"
                value="events"
                icon={<EventIcon />}
              />
              <StyledBottomNavigationAction
                label="Сообщения"
                value="messages"
                icon={<MessageIcon />}
              />
              <StyledBottomNavigationAction
                label="Статистика"
                value="statistics"
                icon={<BarChartIcon />}
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
              borderRight: '2px solid #ccc', // Добавление вертикальной линии
            },
          }}
        >
          <List>
            <Typography variant="h5" gutterBottom sx={{ mt: 3, ml: 3, mb: 3, fontWeight: 'bold', color: 'black' }}>
              Администратор города
            </Typography>
            <StyledListItem button onClick={() => setSelectedSection('profile')}>
              <StyledListItemIcon>
                <AccountCircleIcon />
              </StyledListItemIcon>
              <ListItemText primary="Настройки профиля" />
            </StyledListItem>
            <StyledListItem button onClick={() => setSelectedSection('volunteers')}>
              <StyledListItemIcon>
                <GroupIcon />
              </StyledListItemIcon>
              <ListItemText primary="Управление волонтёрами" />
            </StyledListItem>
            <StyledListItem button onClick={() => setSelectedSection('events')}>
              <StyledListItemIcon>
                <EventIcon />
              </StyledListItemIcon>
              <ListItemText primary="Управление мероприятиями" />
            </StyledListItem>
            <StyledListItem button onClick={() => setSelectedSection('messages')}>
              <StyledListItemIcon>
                <MessageIcon />
              </StyledListItemIcon>
              <ListItemText primary="Рассылка сообщений" />
            </StyledListItem>
            <StyledListItem button onClick={() => setSelectedSection('statistics')}>
              <StyledListItemIcon>
                <BarChartIcon />
              </StyledListItemIcon>
              <ListItemText primary="Статистика по городу" />
            </StyledListItem>
          </List>
        </Drawer>
      )}

      {/* Контентная область */}
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

export default CityAdminPage;
