import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import 'materialize-css/dist/css/materialize.min.css';
import { TextField, Button, List, ListItem, Badge, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import './ChatPage.css';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
const token = localStorage.getItem('token');

const ChatPage = ({ socket }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [recipientId, setRecipientId] = useState(null);
  const [recipientName, setRecipientName] = useState('');
  const [onlineUsers, setOnlineUsers] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [currentUser, setCurrentUser] = useState(null); // Добавляем состояние для текущего пользователя
  const [currentChatPartnerId, setCurrentChatPartnerId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Проверка токена
    fetch(`${apiBaseUrl}/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,  // Используем токен для аутентификации
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Invalid token');
        }
        return response.json();
      })
      .then(data => {
        console.log('User token verified:', data);
        console.log('token:', token);
        setCurrentUser(data); // Предполагается, что ответ содержит информацию о текущем пользователе
        // Инициализация socket после успешной верификации токена

        // Обработка входящих сообщений
        socket.on('chat_message', (msg) => {
          console.log('Message received:', msg);
          if (msg.sender_id === currentUser?.user_metadata_id || msg.sender_id === currentChatPartnerId) {
            setMessages(prevMessages => [...prevMessages, msg]);
          }
        });

        // Обработка статуса пользователей
        socket.on('user_status', (data) => {
          const { user_id, status } = data;
          setOnlineUsers(prevStatus => ({
            ...prevStatus,
            [user_id]: status === 'online'
          }));
          console.log(`User ${user_id} is now ${status}`);
        });

        // Обработка количества непрочитанных сообщений
        socket.on('unread_messages_count', (data) => {
          const { user_id, unread_count } = data;
          console.log(`Unread count update: User ${user_id}, Count ${unread_count}`);
          setUnreadCounts(prevCounts => ({
            ...prevCounts,
            [user_id]: unread_count
          }));
        });

        socket.on('disconnect', () => {
          console.log('Socket disconnected');
        });
      })
      .catch(error => {
        console.error('Token verification error:', error);
        navigate('/login');
      });

    return () => {
      socket.off('chat_message');
      socket.off('user_status');
      socket.off('unread_messages_count');
      socket.off('disconnect');
    };
  }, [currentChatPartnerId]);

  useEffect(() => {
    // Загрузка пользователей
    fetch(`${apiBaseUrl}/chat-users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  useEffect(() => {
    if (recipientId) {
      // Загрузка истории сообщений
      fetch(`${apiBaseUrl}/chat/history/${recipientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
        .then(response => response.json())
        .then(data => {
          setMessages(Array.isArray(data) ? data : []);
          const selectedUser = users.find(user => user.user_metadata_id === recipientId);
          setRecipientName(`${selectedUser?.user_name || ''} ${selectedUser?.user_surname || ''}`);
          setUnreadCounts(prevCounts => ({
            ...prevCounts,
            [recipientId]: data.count
          }));
          console.log('Chat history and unread counts loaded:', data);
          socket.emit('select_chat_partner', {
            recipient_id: recipientId,
            token
          });
          setCurrentChatPartnerId(recipientId);
        })
        .catch(error => console.error('Error fetching chat history:', error));
    }
  }, [recipientId, users]);

  const handleSend = () => {
    if (message.trim() && recipientId) {
      console.log('Sending message:', message);
      socket.emit('chat_message', {
        message,
        token,
        recipient_id: recipientId
      });
      setMessage('');
    }
  };
  // Фильтрация пользователей, чтобы не отображать текущего пользователя
  const filteredUsers = users.filter(user => user.user_metadata_id !== currentUser?.user_metadata_id);

  return (
    <div className="chat-container">
      <div className="sidebar">
        <List className="contact-list">
          {filteredUsers.map(user => (
            <ListItem 
              key={user.user_metadata_id} 
              onClick={() => setRecipientId(user.user_metadata_id)}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Typography variant="body1" style={{ flexGrow: 1 }}>
                {`${user.user_name} ${user.user_surname}`}
              </Typography>
              <Badge badgeContent={unreadCounts[user.user_metadata_id] || 0} color="primary" style={{ marginLeft: 'auto' }} />
            </ListItem>
          ))}
        </List>
      </div>

      {/* Если не выбран получатель, показываем предложение выбрать собеседника */}
      {!recipientId ? (
        <div className="chat-section">
          <Typography variant="h6" align="center">
            Пожалуйста, выберите собеседника, чтобы начать чат
          </Typography>
        </div>
      ) : (
        <div className="chat-section">
          <div className="chat-header">
            <h3>{recipientName}</h3>
          </div>
          <div className="chat-window">
            {messages.map((msg, index) => (
              <div key={index} className={`message-bubble ${msg.sender_id === currentUser?.user_metadata_id ? 'message-right' : 'message-left'}`}>
                <strong>{msg.user_name}</strong>: {msg.message} <br/>
                <small>{format(new Date(msg.time), 'dd MMMM yyyy, HH:mm', { locale: ru })}</small>
              </div>
            ))}
          </div>
          <div
            className="input-field"
            tabIndex="0"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          >
            <TextField
              label="Ваше сообщение"
              variant="outlined"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              fullWidth
            />
            <Button variant="contained" color="primary" onClick={handleSend}>
              Отправить
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
