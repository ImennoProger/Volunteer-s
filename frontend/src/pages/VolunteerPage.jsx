import React, { useState } from 'react';
import { Box, Paper, Typography, IconButton, Drawer, List, ListItemText, useMediaQuery, useTheme, BottomNavigation } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import PeopleIcon from '@mui/icons-material/People';

import { StyledBottomNavigationAction, StyledListItem, StyledListItemIcon } from './UsersPage';
import VolunteerProfile from '../components/Volunteer/VolunteerProfile';
import Friends from '../components/Volunteer/Friends';
import Groups from '../components/Volunteer/Groups';
import VolunteerAchievements from '../components/Volunteer/VolunteerAchievements';
import VolunteerEvents from '../components/Volunteer/VolunteerEvents';

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

  const handleSectionChange = (newSection) => {
    setSelectedSection(newSection);
    if (isMobile) {
      setIsDrawerOpen(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
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
                padding: '0',
                overflow: 'hidden',
              },
            }}
          >
            <BottomNavigation
              showLabels
              value={selectedSection}
              onChange={(event, newValue) => handleSectionChange(newValue)}
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                '& .MuiBottomNavigationAction-root': {
                  flex: 1,
                  minWidth: 0,
                  padding: 0,
                  '& .MuiBottomNavigationAction-label': {
                    fontSize: '0.6rem', // Уменьшение размера текста
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  },
                  '& .MuiBottomNavigationAction-icon': {
                    fontSize: '1.5rem', // Уменьшение размера иконок
                  },
                },
              }}
            >
              <StyledBottomNavigationAction
                label="Профиль"
                value="profile"
                icon={<AccountCircleIcon />}
              />
              <StyledBottomNavigationAction
                label="Достижения"
                value="achievements"
                icon={<EmojiEventsIcon />}
              />
              <StyledBottomNavigationAction
                label="Мероприятия"
                value="events"
                icon={<EventIcon />}
              />
              <StyledBottomNavigationAction
                label="Друзья"
                value="friends"
                icon={<PeopleIcon />}
              />
              <StyledBottomNavigationAction
                label="Группы"
                value="groups"
                icon={<GroupIcon />}
              />
            </BottomNavigation>
          </Drawer>
        </>
      ) : (
        // Навигационная панель для больших экранов
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: 240,
              boxSizing: 'border-box',
              border: 'none', // Убираем границу
              marginTop: '80px', // Отступ, чтобы панель не перекрывала шапку
              backgroundColor: 'rgba(255, 255, 255, 0.00001)',
            },
          }}
        >
          <List>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                mt: 3,
                ml: 3,
                mb: 3,
                fontWeight: 'bold',
                color: theme.palette.text.primary,  // Использование цвета текста из темы
              }}
            >
              Волонтёр
            </Typography>

            <StyledListItem button onClick={() => handleSectionChange('profile')}>
              <StyledListItemIcon>
                <AccountCircleIcon />
              </StyledListItemIcon>
              <ListItemText primary="Настройки профиля" />
            </StyledListItem>
            <StyledListItem button onClick={() => handleSectionChange('achievements')}>
              <StyledListItemIcon>
                <EmojiEventsIcon />
              </StyledListItemIcon>
              <ListItemText primary="Достижения" />
            </StyledListItem>
            <StyledListItem button onClick={() => handleSectionChange('events')}>
              <StyledListItemIcon>
                <EventIcon />
              </StyledListItemIcon>
              <ListItemText primary="Мероприятия на карте" />
            </StyledListItem>
            <StyledListItem button onClick={() => handleSectionChange('friends')}>
              <StyledListItemIcon>
                <PeopleIcon />
              </StyledListItemIcon>
              <ListItemText primary="Друзья" />
            </StyledListItem>
            <StyledListItem button onClick={() => handleSectionChange('groups')}>
              <StyledListItemIcon>
                <GroupIcon />
              </StyledListItemIcon>
              <ListItemText primary="Группы" />
            </StyledListItem>
          </List>
        </Drawer>
      )}

      {/* Контентная область */}
      <Box
        sx={{
          flexGrow: 1,
          ml: isMobile ? 0 : '240px', // Отступ для ПК
          p: 2,
          overflow: 'auto',
          width: '100%',
        }}
      >
        <Paper elevation={3} sx={{ p: 2 }}>
          {renderContent()}
        </Paper>
      </Box>
    </Box>
  );
};

export default VolunteerPage;
