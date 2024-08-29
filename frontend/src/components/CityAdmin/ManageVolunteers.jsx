import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Импортируем axios для HTTP-запросов
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from '@mui/material';

const ManageVolunteers = () => {

  const [volunteers, setVolunteers] = useState([]);

  const fetchVolunteers = async () => {
    try {
      const token = localStorage.getItem('token'); 
      const response = await axios.get('http://localhost:8000/users/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setVolunteers(response.data); 
    } catch (error) {
      console.error('Ошибка при получении волонтеров:', error.response?.data || error.message);
    }
  };

  // Используем useEffect для получения данных при монтировании компонента
  useEffect(() => {
    fetchVolunteers(); // Вызываем функцию получения данных
  }, []); // Пустой массив зависимостей означает, что эффект выполнится один раз при монтировании

  // Функция для блокировки волонтера
  const handleBlock = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8000/users/block/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setVolunteers((prev) =>
        prev.map((volunteer) =>
          volunteer.user_metadata_id === id
            ? { ...volunteer, status: false }
            : volunteer
        )
      );
    } catch (error) {
      console.error('Ошибка при блокировке волонтера:', error.response?.data || error.message);
    }
  };

  // Функция для разблокировки волонтера
  const handleUnblock = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8000/users/unblock/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setVolunteers((prev) =>
        prev.map((volunteer) =>
          volunteer.user_metadata_id === id
            ? { ...volunteer, status: true }
            : volunteer
        )
      );
    } catch (error) {
      console.error('Ошибка при разблокировке волонтера:', error.response?.data || error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setVolunteers((prev) => prev.filter((volunteer) => volunteer.user_metadata_id !== id));
    } catch (error) {
      console.error('Ошибка при удалении волонтера:', error.response?.data || error.message);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
      Управление волонтёрами
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Имя</TableCell>
              <TableCell>Фамилия</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {volunteers.map((volunteer) => (
              <TableRow key={volunteer.user_metadata_id}>
                <TableCell>{volunteer.user_name}</TableCell>
                <TableCell>{volunteer.user_surname}</TableCell>
                <TableCell>{volunteer.email}</TableCell> 
                <TableCell>
                  {volunteer.status ? 'Заблокирован' : 'Активный'}
                </TableCell>
                <TableCell>
                  {volunteer.status ? (
                    <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleUnblock(volunteer.user_metadata_id)}
                    sx={{ mr: 1 }}
                  >
                    Разблокировать
                  </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleBlock(volunteer.user_metadata_id)}
                      sx={{ mr: 1 }}
                    >
                      Заблокировать
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(volunteer.user_metadata_id)}
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
