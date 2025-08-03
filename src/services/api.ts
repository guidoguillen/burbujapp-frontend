import { API_URLS } from '../constants';

// Configuración base de la API
class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Métodos HTTP
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Instancia de la API
export const apiService = new ApiService(API_URLS.BASE_URL);

// Servicios específicos por entidad
export const authService = {
  login: async (email: string, password: string) => {
    return apiService.post(`${API_URLS.AUTH}/login`, { email, password });
  },
  
  logout: async () => {
    return apiService.post(`${API_URLS.AUTH}/logout`);
  },
  
  refreshToken: async (refreshToken: string) => {
    return apiService.post(`${API_URLS.AUTH}/refresh`, { refreshToken });
  },
  
  forgotPassword: async (email: string) => {
    return apiService.post(`${API_URLS.AUTH}/forgot-password`, { email });
  },
};

export const clientsService = {
  getAll: async (page: number = 1, limit: number = 20) => {
    return apiService.get(`${API_URLS.CLIENTS}?page=${page}&limit=${limit}`);
  },
  
  getById: async (id: string) => {
    return apiService.get(`${API_URLS.CLIENTS}/${id}`);
  },
  
  create: async (data: any) => {
    return apiService.post(API_URLS.CLIENTS, data);
  },
  
  update: async (id: string, data: any) => {
    return apiService.put(`${API_URLS.CLIENTS}/${id}`, data);
  },
  
  delete: async (id: string) => {
    return apiService.delete(`${API_URLS.CLIENTS}/${id}`);
  },
};

export const productsService = {
  getAll: async (page: number = 1, limit: number = 20) => {
    return apiService.get(`${API_URLS.PRODUCTS}?page=${page}&limit=${limit}`);
  },
  
  getById: async (id: string) => {
    return apiService.get(`${API_URLS.PRODUCTS}/${id}`);
  },
  
  create: async (data: any) => {
    return apiService.post(API_URLS.PRODUCTS, data);
  },
  
  update: async (id: string, data: any) => {
    return apiService.put(`${API_URLS.PRODUCTS}/${id}`, data);
  },
  
  delete: async (id: string) => {
    return apiService.delete(`${API_URLS.PRODUCTS}/${id}`);
  },
};

export const ordersService = {
  getAll: async (page: number = 1, limit: number = 20) => {
    return apiService.get(`${API_URLS.ORDERS}?page=${page}&limit=${limit}`);
  },
  
  getById: async (id: string) => {
    return apiService.get(`${API_URLS.ORDERS}/${id}`);
  },
  
  create: async (data: any) => {
    return apiService.post(API_URLS.ORDERS, data);
  },
  
  update: async (id: string, data: any) => {
    return apiService.put(`${API_URLS.ORDERS}/${id}`, data);
  },
  
  delete: async (id: string) => {
    return apiService.delete(`${API_URLS.ORDERS}/${id}`);
  },
};

export default apiService;
