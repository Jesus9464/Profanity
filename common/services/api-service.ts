import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

class ApiService {
  private api: AxiosInstance;

  constructor(baseURL: string = "http://localhost:3000/api") {
    this.api = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error("API Error:", error);
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get<T>(url, config);
    return response.data;
  }

  async post<T, D = Record<string, unknown>>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }

  async put<T, D = Record<string, unknown>>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.api.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.delete<T>(url, config);
    return response.data;
  }
}

export const apiService = new ApiService();
