// src/features/users/types/index.ts

// Lo que viene de la API (JSONPlaceholder)
export interface UserDTO {
  id:       number;
  name:     string;
  username: string;
  email:    string;
  address:  {
    street:  string;
    city:    string;
    zipcode: string;
  };
}

// Lo que usa mi aplicación (Clean Data)
export interface UserUI {
  id:        number;
  fullName:  string;
  email:     string;
  location:  string;
}