import { APIRequestContext, APIResponse } from '@playwright/test';
import { ApiClient } from '../ApiClient';
import {
  User,              
  UserListResponse,
  CreateUserPayload,
  UpdateUserPayload,
} from '../../types';

export class UsersApi extends ApiClient {
  constructor(request: APIRequestContext, baseUrl: string) {
    super(request, baseUrl);
  }

  async getUsers(limit = 10, skip = 0): Promise<{ response: APIResponse; data: UserListResponse }> {
    return this.get<UserListResponse>('/users', {
      limit: String(limit),
      skip: String(skip),
    });
  }       

  async getUserById(id: number): Promise<{ response: APIResponse; data: User }> {
    return this.get<User>(`/users/${id}`);
  }

  async searchUsers(query: string): Promise<{ response: APIResponse; data: UserListResponse }> {
    return this.get<UserListResponse>('/users/search', { q: query });
  }

  async createUser(payload: CreateUserPayload): Promise<{ response: APIResponse; data: User }> {
    return this.post<User>('/users/add', payload);
  }

  async updateUser(id: number, payload: UpdateUserPayload): Promise<{ response: APIResponse; data: User }> {
    return this.put<User>(`/users/${id}`, payload);
  }

  async patchUser(id: number, payload: UpdateUserPayload): Promise<{ response: APIResponse; data: User }> {
    return this.patch<User>(`/users/${id}`, payload);
  }

  async deleteUser(id: number): Promise<{ response: APIResponse; data: User & { isDeleted: boolean; deletedOn: string } }> {
    return this.delete_json<User & { isDeleted: boolean; deletedOn: string }>(`/users/${id}`);
  }

  async getUsersWithPagination(limit: number, skip: number): Promise<{ response: APIResponse; data: UserListResponse }> {
    return this.getUsers(limit, skip);
  }
}
