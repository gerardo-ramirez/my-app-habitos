// src/features/users/adapters/user.adapter.ts
import { UserDTO, UserUI } from "../types";

/**
 * Convierte los datos crudos de la API (DTO) 
 * al formato amigable que usará nuestra interfaz (UI).
 */
export const userAdapter = (user: UserDTO): UserUI => {
  return {
    id: user.id,
    fullName: user.name, // Renombramos para seguir camelCase
    email: user.email.toLowerCase(),
    // Ejemplo de transformación: Combinamos campos o limpiamos data
    location: `${user.address.city}, ${user.address.street}`,
  };
};

/**
 * Adaptador para listas: útil cuando el servicio devuelve un array.
 */
export const usersListAdapter = (users: UserDTO[]): UserUI[] => {
  return users.map(userAdapter);
};