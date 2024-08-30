import React, { useState } from 'react';
import { Box, Button, Paper, Typography, IconButton, Drawer, BottomNavigation, BottomNavigationAction, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import PeopleIcon from '@mui/icons-material/People';
import '../pages/globalStyless.css';

import VolunteerProfile from '../components/Volunteer/VolunteerProfile';
import Friends from '../components/Volunteer/Friends';
import Groups from '../components/Volunteer/Groups';
import VolunteerAchievements from '../components/Volunteer/VolunteerAchievements';
import VolunteerEvents from '../components/Volunteer/VolunteerEvents'

const friends = [{ id: 1, name: 'Friend 1' }];
const groups = [{ id: 1, name: 'Group 1' }];
const rank = 'Gold';
const points = 1500;
const awards = ['Award 1', 'Award 2'];
const completedEvents = ['Event 1', 'Event 2'];

const VolunteerPage = () => {
  const [selectedSection, setSelectedSection] = useState('profile');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const renderContent = () => {
    switch (selectedSection) {
      case 'profile':
        return <VolunteerProfile />;
      case 'achievements':
        return <VolunteerAchievements rank={rank} points={points} awards={awards} completedEvents={completedEvents} />;
      case 'events':
        return <VolunteerEvents />;
      case 'friends':
        return <Friends friends={friends} />;
      case 'groups':
        return <Groups groups={groups} />;
      default:
        return <VolunteerProfile />;
    }
  };

  const preventDefaultFocus = (e) => e.preventDefault();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
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
                setIsDrawerOpen(false);
              }}
              sx={{ width: '100%' }} 
            >
              <BottomNavigationAction label="Профиль" value="profile" icon={<AccountCircleIcon />} />
              <BottomNavigationAction label="Достижения" value="achievements" icon={<EmojiEventsIcon />} />
              <BottomNavigationAction label="Мероприятия" value="events" icon={<EventIcon />} />
              <BottomNavigationAction label="Друзья" value="friends" icon={<PeopleIcon />} />
              <BottomNavigationAction label="Группы" value="groups" icon={<GroupIcon />} />
            </BottomNavigation>
          </Drawer>
        </>
      ) : (
        <Box sx={{ width: '300px', p: 4, color: 'white', position: 'fixed', top: 65, left: 0, height: '100vh' }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'black' }}>
            Волонтёр
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Button
              variant="contained"
              onClick={() => setSelectedSection('profile')}
              sx={{ mb: 1 }}
              onMouseDown={preventDefaultFocus} // Убираем стандартное поведение при нажатии
              className="left-column-button"
            >
              Настройки профиля
            </Button>
            <Button
              variant="contained"
              onClick={() => setSelectedSection('achievements')}
              sx={{ mb: 1 }}
              onMouseDown={preventDefaultFocus} // Убираем стандартное поведение при нажатии
              className="left-column-button"
            >
              Достижения
            </Button>
            <Button
              variant="contained"
              onClick={() => setSelectedSection('events')}
              sx={{ mb: 1 }}
              onMouseDown={preventDefaultFocus} // Убираем стандартное поведение при нажатии
              className="left-column-button"
            >
              Мероприятия на карте
            </Button>
            <Button
              variant="contained"
              onClick={() => setSelectedSection('friends')}
              sx={{ mb: 1 }}
              onMouseDown={preventDefaultFocus} // Убираем стандартное поведение при нажатии
              className="left-column-button"
            >
              Друзья
            </Button>
            <Button
              variant="contained"
              onClick={() => setSelectedSection('groups')}
              sx={{ mb: 1 }}
              onMouseDown={preventDefaultFocus} // Убираем стандартное поведение при нажатии
              className="left-column-button"
            >
              Группы
            </Button>
          </Box>
        </Box>
      )}

      {/* Контентная область */}
      <Box
        sx={{
          flexGrow: 1,
          ml: isMobile ? 0 : '100px', // Отступ для ПК
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

export default VolunteerPage;