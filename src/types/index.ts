export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  age?: number;
  image?: string;
  token?: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email?: string;
  age?: number;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  age?: number;
}

export interface LoginPayload {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  accessToken: string;
  refreshToken: string;
}

export interface TestConfig {
  baseUrl: string;
  apiBaseUrl: string;
  credentials: {
    standardUser: string;
    lockedUser: string;
    password: string;
  };
}

export type Environment = 'dev' | 'staging' | 'prod';

export interface Product {
  id: number;
  title: string;
  price: number;
  description?: string;
  category?: string;
  thumbnail?: string;
}
