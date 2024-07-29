// src/components/RegionAdmin/RegionAdminAccordion.jsx
import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ManageVolunteers from './ManageVolunteers';
import ManageEvents from './ManageEvents';
import RegionalStatistics from './RegionalStatistics';
import MessageDispatch from './MessageDispatch';

const RegionAdminAccordion = () => {
  return (
    <Box>
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Управление волонтерами</Typography>
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
          <Typography>Статистика региона</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <RegionalStatistics />
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Рассылка сообщений</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <MessageDispatch />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default RegionAdminAccordion;
