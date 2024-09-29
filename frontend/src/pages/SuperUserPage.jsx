import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemText, ListItemIcon, Typography, Paper, IconButton, BottomNavigation, BottomNavigationAction, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StarIcon from '@mui/icons-material/Star';
import CategoryIcon from '@mui/icons-material/Category';
import BadgeIcon from '@mui/icons-material/Badge';
import { StyledBottomNavigationAction, StyledListItem, StyledListItemIcon } from './UsersPage';
import SuperUserProfile from '../components/SuperUser/SuperUserProfile';
import CreateRanks from '../components/SuperUser/CreateRanks';
import CreateCategories from '../components/SuperUser/CreateCategories';
import CreateAwards from '../components/SuperUser/CreateAwards';
import GroupIcon from '@mui/icons-material/Group';
import EventIcon from '@mui/icons-material/Event';
import MessageIcon from '@mui/icons-material/Message';
import BarChartIcon from '@mui/icons-material/BarChart';
import ManageVolunteers from '../components/CityAdmin/ManageVolunteers';
import ManageEvents from '../components/CityAdmin/ManageEvents';
import MessageBroadcast from '../components/CityAdmin/MessageBroadcast';
import CityStatistics from '../components/CityAdmin/CityStatistics';

const drawerWidth = 300;

const SuperUserPage = () => {
  const [selectedSection, setSelectedSection] = useState('profile');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const renderContent = () => {
    switch (selectedSection) {
      case 'profile':
        return <SuperUserProfile />;
      case 'ranks':
        return <CreateRanks />;
      case 'categories':
        return <CreateCategories />;
      case 'awards':
        return <CreateAwards />;
      case 'volunteers':
        return <ManageVolunteers />;
      case 'events':
        return <ManageEvents />;
      case 'messages':
        return <MessageBroadcast />;
      case 'statistics':
        return <CityStatistics />;
      default:
        return <SuperUserProfile />;
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
                label="Ранги"
                icon={<StarIcon />}
                onClick={() => { setSelectedSection('ranks'); setIsDrawerOpen(false); }}
              />
              <BottomNavigationAction
                label="Категории"
                icon={<CategoryIcon />}
                onClick={() => { setSelectedSection('categories'); setIsDrawerOpen(false); }}
              />
              <BottomNavigationAction
                label="Награды"
                icon={<BadgeIcon />}
                onClick={() => { setSelectedSection('awards'); setIsDrawerOpen(false); }}
              />
              <BottomNavigationAction
                label="Награды"
                icon={<BadgeIcon />}
                onClick={() => { setSelectedSection('volunteers'); setIsDrawerOpen(false); }}
              />
              <BottomNavigationAction
                label="Награды"
                icon={<BadgeIcon />}
                onClick={() => { setSelectedSection('events'); setIsDrawerOpen(false); }}
              />
              <BottomNavigationAction
                label="Награды"
                icon={<BadgeIcon />}
                onClick={() => { setSelectedSection('messages'); setIsDrawerOpen(false); }}
              />
              <BottomNavigationAction
                label="Награды"
                icon={<BadgeIcon />}
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
              marginTop: '80px',
              backgroundColor: 'rgba(255, 255, 255, 0.00001)',
            },
          }}
        >
          <List>
            <Typography variant="h5" gutterBottom sx={{ mt: 3, ml: 3, mb: 3, fontWeight: 'bold', color: 'black' }}>
              SuperUser
            </Typography>
            <ListItem button onClick={() => setSelectedSection('profile')} sx={{ minWidth: '250px' }}>
              <ListItemIcon sx={{ minWidth: '40px' }}>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Настройки профиля" />
            </ListItem>
            <ListItem button onClick={() => setSelectedSection('ranks')} sx={{ minWidth: '250px' }}>
              <ListItemIcon sx={{ minWidth: '40px' }}>
                <StarIcon />
              </ListItemIcon>
              <ListItemText primary="Создание рангов" />
            </ListItem>
            <ListItem button onClick={() => setSelectedSection('categories')} sx={{ minWidth: '250px' }}>
              <ListItemIcon sx={{ minWidth: '40px' }}>
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText primary="Создание категорий" />
            </ListItem>
            <ListItem button onClick={() => setSelectedSection('awards')} sx={{ minWidth: '250px' }}>
              <ListItemIcon sx={{ minWidth: '40px' }}>
                <BadgeIcon />
              </ListItemIcon>
              <ListItemText primary="Создание наград" />
            </ListItem>
            <ListItem button onClick={() => setSelectedSection('volunteers')} sx={{ minWidth: '250px' }}>
              <ListItemIcon sx={{ minWidth: '40px' }}>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary="Управление волонтёрами" />
            </ListItem>
            <ListItem button onClick={() => setSelectedSection('events')} sx={{ minWidth: '250px' }}>
              <ListItemIcon sx={{ minWidth: '40px' }}>
                <EventIcon />
              </ListItemIcon>
              <ListItemText primary="Управление мероприятиями" />
            </ListItem>
            <ListItem button onClick={() => setSelectedSection('messages')} sx={{ minWidth: '250px' }}>
              <ListItemIcon sx={{ minWidth: '40px' }}>
                <MessageIcon />
              </ListItemIcon>
              <ListItemText primary="Рассылка сообщений" />
            </ListItem>
            <ListItem button onClick={() => setSelectedSection('statistics')} sx={{ minWidth: '250px' }}>
              <ListItemIcon sx={{ minWidth: '40px' }}>
                <BarChartIcon />
              </ListItemIcon>
              <ListItemText primary="Статистика по городу" />
            </ListItem>
          </List>

        </Drawer>
      )}

      {/* Основной контент */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          //ml: -20,
          sm: drawerWidth, 
          p: 3,
          width: '100%',
          overflowX: 'hidden', 
        }}
      >
        <Paper elevation={0} sx={{ p: 3, height: '100%' }}>
          {renderContent()}
        </Paper>
      </Box>
    </Box>
  );
};

export default SuperUserPage;
