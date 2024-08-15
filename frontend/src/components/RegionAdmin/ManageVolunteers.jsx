import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';

const ManageVolunteers = () => {
  const [volunteers, setVolunteers] = useState([
    { id: 1, name: 'Волонтёр 1', status: 'active' },
    { id: 2, name: 'Волонтёр 2', status: 'blocked' },
    { id: 3, name: 'Волонтёр 3', status: 'active' },
  ]);

  const handleBlock = (id) => {
    setVolunteers((prev) =>
      prev.map((volunteer) =>
        volunteer.id === id
          ? { ...volunteer, status: 'blocked' }
          : volunteer
      )
    );
  };

  const handleUnblock = (id) => {
    setVolunteers((prev) =>
      prev.map((volunteer) =>
        volunteer.id === id
          ? { ...volunteer, status: 'active' }
          : volunteer
      )
    );
  };

  const handleDelete = (id) => {
    setVolunteers((prev) => prev.filter((volunteer) => volunteer.id !== id));
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Имя</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {volunteers.map((volunteer) => (
              <TableRow key={volunteer.id}>
                <TableCell>{volunteer.name}</TableCell>
                <TableCell>{volunteer.status === 'active' ? 'Активный' : 'Заблокирован'}</TableCell>
                <TableCell>
                  {volunteer.status === 'active' ? (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleBlock(volunteer.id)}
                      sx={{ mr: 1 }}
                    >
                      Заблокировать
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleUnblock(volunteer.id)}
                      sx={{ mr: 1 }}
                    >
                      Разблокировать
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(volunteer.id)}
                  >
                    Удалить
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ManageVolunteers;
