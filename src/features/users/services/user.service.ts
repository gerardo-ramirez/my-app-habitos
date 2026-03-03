// src/features/users/services/user.service.ts
import axios from 'axios';
import { UserDTO } from '../types';


export const getUsers = async (): Promise<UserDTO[]> => {
  const { data } = await axios.get('https://jsonplaceholder.typicode.com/users');
  return data;
};
