import { styled } from '@mui/material/styles';
import { BottomNavigationAction, ListItem, ListItemIcon } from '@mui/material';

export const StyledBottomNavigationAction = styled(BottomNavigationAction)(({ theme }) => ({
  minWidth: 80,
  '& .MuiBottomNavigationAction-label': {
    fontSize: '1.2rem',
  },
  '& .MuiSvgIcon-root': {
    fontSize: 40,
  },
}));

export const StyledListItem = styled(ListItem)(({ theme }) => ({
  py: 2,
}));

export const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  '& .MuiSvgIcon-root': {
    fontSize: 40,
  },
}));
