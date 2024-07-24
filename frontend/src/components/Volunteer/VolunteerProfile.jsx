import React, { useState } from 'react';
import { Avatar, Button, FormControl, FormLabel, Input, Typography } from '@mui/joy';

const VolunteerProfile = () => {
  const [profile, setProfile] = useState({
    photo: '',
    email: '',
    password: '',
    fullName: '',
    age: '',
    country: '',
    city: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // логика обновления профиля
  };

  return (
    <div>
      <Avatar src={profile.photo} />
      <FormControl>
        <FormLabel>Фото URL</FormLabel>
        <Input name="photo" value={profile.photo} onChange={handleChange} />
      </FormControl>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input name="email" type="email" value={profile.email} onChange={handleChange} />
      </FormControl>
      <FormControl>
        <FormLabel>Пароль</FormLabel>
        <Input name="password" type="password" value={profile.password} onChange={handleChange} />
      </FormControl>
      <FormControl>
        <FormLabel>Full Name</FormLabel>
        <Input name="fullName" value={profile.fullName} onChange={handleChange} />
      </FormControl>
      <FormControl>
        <FormLabel>Возраст</FormLabel>
        <Input name="age" type="number" value={profile.age} onChange={handleChange} />
      </FormControl>
      <FormControl>
        <FormLabel>Страна</FormLabel>
        <Input name="country" value={profile.country} onChange={handleChange} />
      </FormControl>
      <FormControl>
        <FormLabel>Город</FormLabel>
        <Input name="city" value={profile.city} onChange={handleChange} />
      </FormControl>
      <Button onClick={handleSubmit}>Обновить профиль</Button>
      <Button color="danger">Удалить аккаунт</Button>
    </div>
  );
};

export default VolunteerProfile;
