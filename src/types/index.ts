// Tipos globales para la aplicación
import type { Cliente, Servicio } from '../services/OrderApiService';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'operator' | 'client' | 'user' | 'manager';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
  status: 'available' | 'out_of_stock' | 'discontinued';
}

export interface Order {
  id: string;
  clientId: string;
  products: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // en minutos
  price: number;
  category: string;
  status: 'active' | 'inactive';
}

export interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  date: Date;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: 'cash' | 'card' | 'transfer' | 'digital_wallet';
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

// Tipos para navegación
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Dashboard: undefined;
  NuevaOrden: { clienteSeleccionado?: Cliente } | undefined;
  SelectCliente: undefined;
  SelectArticulos: { cliente: { id: string; nombre: string; apellido: string; telefono: string; direccion: string } };
  ReviewOrden: { 
    cliente?: { id: string; nombre: string; apellido: string; telefono: string; direccion: string };
    articulos?: Array<{ servicio: Servicio; cantidad: number; subtotal: number; instrucciones?: string }>;
    total?: number;
  } | undefined;
  MisOrdenes: undefined;
  DetalleOrden: { ordenId: string };
  Turnos: undefined;
  Turno: undefined;
  HistorialTurnos: undefined;
  Clients: undefined;
  ClientDetail: { clientId: string };
  Orders: undefined;
  OrderDetail: { orderId: string };
  Products: undefined;
  ProductDetail: { productId: string };
  Services: undefined;
  ServiceDetail: { serviceId: string };
  Payments: undefined;
  Reports: undefined;
  Settings: undefined;
  GestionUsuarios: undefined;
  ControlFinanciero: undefined;
  ReportesAnalytics: undefined;
  ConfiguracionSistema: undefined;
  FuncionesAvanzadas: undefined;
  ActividadLogs: undefined;
  GestionHorarios: undefined;
  GestionPermisos: undefined;
  // WhatsApp Business screens
  WhatsAppAdmin: undefined;
  WhatsAppConfig: undefined;
  WhatsAppTemplates: undefined;
  WhatsAppContacts: undefined;
  WhatsAppCampaigns: undefined;
  WhatsAppAutomation: undefined;
  WhatsAppAnalytics: undefined;
};

// Tipos para formularios
export interface LoginForm {
  email: string;
  password: string;
}

export interface ClientForm {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface ProductForm {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

// Tipos para API responses
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipos para estado global
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface ClientsState {
  clients: Client[];
  loading: boolean;
  error: string | null;
}

export interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}
