import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import 'materialize-css/dist/css/materialize.min.css';
import { TextField, Button, List, ListItem } from '@mui/material';
import './ChatPage.css';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
const token = localStorage.getItem('token');
const socket = io(apiBaseUrl, {
  query: { token }
});

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [recipientId, setRecipientId] = useState(null);
  const [recipientName, setRecipientName] = useState('');
  const [onlineUsers, setOnlineUsers] = useState({});

  useEffect(() => {
    fetch(`${apiBaseUrl}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
    
    socket.on('chat_message', (msg) => {
      console.log('Message received:', msg);
      setMessages(prevMessages => [...prevMessages, msg]);
    });

    socket.on('user_status', (data) => {
      const { user_id, status } = data;
      setOnlineUsers(prevStatus => ({
        ...prevStatus,
        [user_id]: status === 'online'
      }));
      console.log(`User ${user_id} is now ${status}`);
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.off('chat_message');
      socket.off('user_status');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  useEffect(() => {
    if (recipientId) {
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

  return (
    <div className="chat-container">
      <div className="sidebar">
        <List className="contact-list">
          {users.map(user => (
            <ListItem 
              key={user.user_metadata_id} 
              onClick={() => setRecipientId(user.user_metadata_id)}
              style={{ cursor: 'pointer' }}
            >
              {`${user.user_name} ${user.user_surname}`} 
              {onlineUsers[user.user_metadata_id] ? ' (online)' : ' (offline)'}
            </ListItem>
          ))}
        </List>
      </div>
      <div className="chat-section">
        <div className="chat-header">
          <h3>{recipientName || 'Chat'} {onlineUsers[recipientId] ? '(online)' : '(offline)'}</h3>
        </div>
        <div className="chat-window">
          {messages.map((msg, index) => (
            <div key={index} className={`message-bubble ${msg.isUser ? 'user' : 'contact'}`}>
              <strong>{msg.user_name}</strong>: {msg.message} <br/>
              <small>{msg.time}</small>
            </div>
          ))}
        </div>
        <div className="input-field">
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
    </div>
  );
};

export default ChatPage;
