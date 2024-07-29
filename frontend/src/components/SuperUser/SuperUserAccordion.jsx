import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CreateRanks from './CreateRanks';
import CreateCategories from './CreateCategories';
import CreateAwards from './CreateAwards';

const SuperUserAccordion = () => {
  return (
    <Box>
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Создание рангов</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CreateRanks />
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Создание категорий</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CreateCategories />
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Создание наград</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CreateAwards />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default SuperUserAccordion;
