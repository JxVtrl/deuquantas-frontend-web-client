import {
  AvailableLanguages,
  AvailableThemes,
} from '../../src/contexts/AuthContext';
import api from '../api';
import { User } from '../api/types';

export interface ListUserFilters {
  name?: string;
  email?: string;
  groups?: string;
  permission_level?: string;
  ids?: number[];
}

export const listUsers = async (): Promise<User[]> => {
  const res = await api.get(`api/v1/users`);
  return res.data;
};

export const createUser = async (
  name: string,
  email: string,
): Promise<User> => {
  const res = await api.post('api/v1/users', { name, email });
  return res.data;
};

export const editUser = async (
  id: number,
  permission_level: number,
): Promise<User> => {
  const res = await api.put(`api/v1/users/${id}`, { permission_level });
  return res.data;
};

export const saveUserPreferences = async (
  theme: AvailableThemes,
  language: AvailableLanguages,
): Promise<{ theme: AvailableThemes; language: AvailableLanguages }> => {
  const res = await api.post('api/v1/users/preferences', {
    theme,
    language,
  });
  return res.data;
};

export const viewUserPreferences = async (): Promise<{
  theme: AvailableThemes;
  language: AvailableLanguages;
}> => {
  const res = await api.get('api/v1/users/preferences');
  return res.data;
};
