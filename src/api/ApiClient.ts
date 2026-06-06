import { APIRequestContext, APIResponse } from '@playwright/test';
import { logger } from '../utils/logger';

export class ApiClient {
  protected readonly request: APIRequestContext;
  protected readonly baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  protected async get<T>(endpoint: string, params?: Record<string, string>): Promise<{ response: APIResponse; data: T }> {
    logger.info(`GET ${this.baseUrl}${endpoint}`);
    const response = await this.request.get(`${this.baseUrl}${endpoint}`, { params });
    const data = await response.json() as T;
    logger.info(`Response [${response.status()}]: ${JSON.stringify(data).slice(0, 200)}`);
    return { response, data };
  }

  protected async post<T>(endpoint: string, body: unknown): Promise<{ response: APIResponse; data: T }> {
    logger.info(`POST ${this.baseUrl}${endpoint} — body: ${JSON.stringify(body)}`);
    const response = await this.request.post(`${this.baseUrl}${endpoint}`, { data: body });
    const data = await response.json() as T;
    logger.info(`Response [${response.status()}]: ${JSON.stringify(data).slice(0, 200)}`);
    return { response, data };
  }

  protected async put<T>(endpoint: string, body: unknown): Promise<{ response: APIResponse; data: T }> {
    logger.info(`PUT ${this.baseUrl}${endpoint}`);
    const response = await this.request.put(`${this.baseUrl}${endpoint}`, { data: body });
    const data = await response.json() as T;
    logger.info(`Response [${response.status()}]: ${JSON.stringify(data).slice(0, 200)}`);
    return { response, data };
  }

  protected async patch<T>(endpoint: string, body: unknown): Promise<{ response: APIResponse; data: T }> {
    logger.info(`PATCH ${this.baseUrl}${endpoint}`);
    const response = await this.request.patch(`${this.baseUrl}${endpoint}`, { data: body });
    const data = await response.json() as T;
    logger.info(`Response [${response.status()}]: ${JSON.stringify(data).slice(0, 200)}`);
    return { response, data };
  }

  protected async delete(endpoint: string): Promise<APIResponse> {
    logger.info(`DELETE ${this.baseUrl}${endpoint}`);
    const response = await this.request.delete(`${this.baseUrl}${endpoint}`);
    logger.info(`Response [${response.status()}]`);
    return response;
  }

  protected async delete_json<T>(endpoint: string): Promise<{ response: APIResponse; data: T }> {
    logger.info(`DELETE ${this.baseUrl}${endpoint}`);
    const response = await this.request.delete(`${this.baseUrl}${endpoint}`);
    const data = await response.json() as T;
    logger.info(`Response [${response.status()}]: ${JSON.stringify(data).slice(0, 200)}`);
    return { response, data };
  }
}
