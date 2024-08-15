import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VolunteerAchievements from './VolunteerAchievements';
import VolunteerEvents from './VolunteerEvents';
import Friends from './Friends';
import Groups from './Groups';
import Messages from './VolunteerMessages';
import Balance from './Balance';

const VolunteerAccordion = ({ rank, points, awards, completedEvents, friends, groups, messages, coins }) => {
  return (
    <Box>
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Достижения</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <VolunteerAchievements
            rank={rank}
            points={points}
            awards={awards}
            completedEvents={completedEvents}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography> Мероприятия на карте </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ width: '100%', overflowX: 'auto' }}>
            <VolunteerEvents />
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Друзья</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Friends friends={friends} />
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Группы</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Groups groups={groups} />
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Сообщения</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Messages messages={messages} />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Баланс</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Balance coins={coins} />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default VolunteerAccordion;
