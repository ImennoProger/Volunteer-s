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
  // Инициализируем состояние для волонтеров
  const [volunteers, setVolunteers] = useState([]);

  // Функция для получения всех пользователей с сервера
  const fetchVolunteers = async () => {
    try {
      const token = localStorage.getItem('token'); 
      const response = await axios.get('http://185.242.118.144:8000/users/', {
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
  /*const handleBlock = async (id) => {
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
            ? { ...volunteer, isActive: false }
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
            ? { ...volunteer, isActive: true }
            : volunteer
        )
      );
    } catch (error) {
      console.error('Ошибка при разблокировке волонтера:', error.response?.data || error.message);
    }
  };*/

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://185.242.118.144:8000/users/${id}`, {
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
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
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
                  {volunteer.isActive ? 'Активный' : 'Заблокирован'}
                </TableCell>
                <TableCell>
                  {volunteer.isActive ? (
                    <Button
                      variant="outlined"
                      color="secondary"
                      //onClick={() => handleBlock(volunteer.user_id)}
                      sx={{ mr: 1 }}
                    >
                      Заблокировать
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      color="primary"
                      //onClick={() => handleUnblock(volunteer.user_id)}
                      sx={{ mr: 1 }}
                    >
                      Разблокировать
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
