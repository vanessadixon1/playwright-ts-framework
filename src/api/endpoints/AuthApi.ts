import { APIRequestContext, APIResponse } from '@playwright/test';
import { ApiClient } from '../ApiClient';
import { LoginPayload, LoginResponse } from '../../types';

export class AuthApi extends ApiClient {
  constructor(request: APIRequestContext, baseUrl: string) {
    super(request, baseUrl);
  }

  async login(payload: LoginPayload): Promise<{ response: APIResponse; data: LoginResponse }> {
    return this.post<LoginResponse>('/auth/login', payload);
  }

  async loginWithExpiry(payload: LoginPayload, expiresInMins: number): Promise<{ response: APIResponse; data: LoginResponse }> {
    return this.post<LoginResponse>('/auth/login', { ...payload, expiresInMins });
  }

  async refreshToken(refreshToken: string): Promise<{ response: APIResponse; data: LoginResponse }> {
    return this.post<LoginResponse>('/auth/refresh', { refreshToken });
  }

  async getCurrentUser(token: string): Promise<{ response: APIResponse; data: LoginResponse }> {
    const response = await this.request.get(`${this.baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json() as LoginResponse;
    return { response, data };
  }
}
