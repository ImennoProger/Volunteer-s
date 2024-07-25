// src/components/CityAdmin/CityAdminAccordion.jsx
import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ManageVolunteers from './ManageVolunteers';
import ManageEvents from './ManageEvents';
import SendMessage from './MessageBroadcast';
import CityStatistics from './CityStatistics';

const CityAdminAccordion = () => {
  return (
    <Box>
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Управление волонтёрами</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ManageVolunteers />
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Управление мероприятиями</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ManageEvents />
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Рассылка сообщений</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SendMessage />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Статистика по городу</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CityStatistics />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default CityAdminAccordion;
