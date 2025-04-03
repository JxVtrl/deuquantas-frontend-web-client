import { User } from '@/interfaces/user';
import api from '../../services/api';

const getUserById = async (id: string) => {
  const response = await fetch(`https://api.example.com/users/${id}`);
  const user = await response.json();
  return user;
};

const createUser = async (user: Omit<User, 'notification' | 'birth'>) => {
  const response = await api.post('https://api.example.com/users', {
    user,
  });
  const createdUser = response.data;
  return createdUser;
};

const deleteUser = async (id: string) => {
  const response = await api.delete(`https://api.example.com/users/${id}`);
  return response.data;
};

const updateUser = async (
  id: string,
  user: Omit<User, 'notification' | 'birth'>,
) => {
  const response = await api.put(`https://api.example.com/users/${id}`, {
    user,
  });
  const updatedUser = response.data;
  return updatedUser;
};

export { getUserById, createUser, deleteUser, updateUser };
