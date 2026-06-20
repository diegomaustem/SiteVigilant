export interface User {
  id: number;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InputUser {
  email: string;
  password: string;
  name: string;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
}