import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipos de datos para WhatsApp Business
export interface WhatsAppStatus {
  isConnected: boolean;
  phoneNumber: string;
  businessName: string;
  lastSync: string;
  webhookStatus: 'active' | 'inactive' | 'error';
  apiLimits: {
    messagesPerDay: number;
    messagesUsed: number;
    resetTime: string;
  };
}

export interface WhatsAppMetrics {
  overview: {
    totalMessages: number;
    totalContacts: number;
    activeConversations: number;
    messagesSent: number;
    messagesReceived: number;
    deliveryRate: number;
    readRate: number;
    responseRate: number;
  };
  timeline: Array<{
    date: string;
    messagesSent: number;
    messagesReceived: number;
    newContacts: number;
    deliveryRate: number;
  }>;
  topTemplates: Array<{
    templateId: string;
    name: string;
    usage: number;
    deliveryRate: number;
    readRate: number;
  }>;
  conversationMetrics: {
    averageResponseTime: string;
    resolutionRate: number;
    customerSatisfaction: number;
  };
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  status: 'approved' | 'pending' | 'rejected';
  category: 'marketing' | 'utility' | 'authentication';
  language: string;
  components: Array<{
    type: 'header' | 'body' | 'footer' | 'buttons';
    format?: 'text' | 'image' | 'video' | 'document';
    text?: string;
    example?: object;
  }>;
  createdAt: string;
  lastModified: string;
}

export interface WhatsAppContact {
  id: string;
  phoneNumber: string;
  name: string;
  firstName: string;
  lastName: string;
  email?: string;
  tags: string[];
  segments: string[];
  lastMessageDate: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'blocked' | 'unsubscribed';
  createdAt: string;
}

export interface WhatsAppCampaign {
  id: string;
  name: string;
  description?: string;
  templateId: string;
  targetAudience: {
    segments?: string[];
    tags?: string[];
    customFilters?: object;
  };
  variables: object;
  scheduling: {
    type: 'immediate' | 'scheduled';
    scheduledDate?: string;
    timezone?: string;
  };
  rateLimiting: {
    messagesPerMinute: number;
    dailyLimit: number;
  };
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'paused';
  createdAt: string;
  metrics?: {
    totalSent: number;
    delivered: number;
    read: number;
    replied: number;
    errors: number;
    deliveryRate: number;
    readRate: number;
    replyRate: number;
    cost: {
      total: number;
      perMessage: number;
      currency: string;
    };
  };
}

export interface WhatsAppAutomation {
  id: string;
  name: string;
  trigger: {
    type: 'new_contact' | 'keyword' | 'time_based' | 'order_status';
    condition: string;
  };
  flow: Array<{
    step: number;
    type: 'message' | 'wait' | 'condition' | 'action';
    templateId?: string;
    variables?: object;
    duration?: string;
    condition?: string;
    trueAction?: string;
    falseAction?: string;
  }>;
  status: 'active' | 'paused';
  metrics: {
    totalTriggered: number;
    completed: number;
    conversionRate: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

class WhatsAppApiServiceImpl {
  private baseUrl = 'https://api.burbujapp.com'; // Cambiar por URL real
  private mockData = true; // Cambiar a false en producción

  // Configuración y conexión
  async configurarConexion(
    apiKey: string, 
    phoneNumberId: string, 
    businessAccountId: string,
    webhookUrl: string,
    webhookVerifyToken: string
  ): Promise<ApiResponse<WhatsAppStatus>> {
    try {
      if (this.mockData) {
        // Simular configuración exitosa
        const mockStatus: WhatsAppStatus = {
          isConnected: true,
          phoneNumber: '+591 75123456',
          businessName: 'BurbujApp',
          lastSync: new Date().toISOString(),
          webhookStatus: 'active',
          apiLimits: {
            messagesPerDay: 1000,
            messagesUsed: 245,
            resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          }
        };

        await AsyncStorage.setItem('whatsapp_config', JSON.stringify({
          apiKey,
          phoneNumberId,
          businessAccountId,
          webhookUrl,
          webhookVerifyToken,
          configuredAt: new Date().toISOString()
        }));

        await AsyncStorage.setItem('whatsapp_status', JSON.stringify(mockStatus));

        return {
          success: true,
          data: mockStatus,
          message: 'WhatsApp Business configurado exitosamente'
        };
      }

      // Lógica real de API
      const response = await fetch(`${this.baseUrl}/api/v1/whatsapp/configure`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          phoneNumberId,
          businessAccountId,
          webhookUrl,
          webhookVerifyToken
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Error al configurar WhatsApp Business'
      };
    }
  }

  async obtenerEstado(): Promise<ApiResponse<WhatsAppStatus>> {
    try {
      if (this.mockData) {
        const storedStatus = await AsyncStorage.getItem('whatsapp_status');
        if (storedStatus) {
          const status = JSON.parse(storedStatus);
          // Actualizar algunos valores dinámicos
          status.lastSync = new Date().toISOString();
          status.apiLimits.messagesUsed = Math.floor(Math.random() * 300) + 200;
          
          return {
            success: true,
            data: status
          };
        }

        return {
          success: false,
          error: 'WhatsApp Business no configurado'
        };
      }

      const response = await fetch(`${this.baseUrl}/api/v1/whatsapp/status`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Error al obtener estado de WhatsApp'
      };
    }
  }

  async obtenerMetricas(dateRange?: { from: string; to: string }): Promise<ApiResponse<WhatsAppMetrics>> {
    try {
      if (this.mockData) {
        const mockMetrics: WhatsAppMetrics = {
          overview: {
            totalMessages: 2450,
            totalContacts: 850,
            activeConversations: 120,
            messagesSent: 1800,
            messagesReceived: 650,
            deliveryRate: 96.5,
            readRate: 78.2,
            responseRate: 25.8
          },
          timeline: [
            {
              date: '2025-08-09',
              messagesSent: 150,
              messagesReceived: 45,
              newContacts: 12,
              deliveryRate: 95.5
            },
            {
              date: '2025-08-08',
              messagesSent: 180,
              messagesReceived: 52,
              newContacts: 8,
              deliveryRate: 97.2
            }
          ],
          topTemplates: [
            {
              templateId: 'template_1',
              name: 'orden_confirmacion',
              usage: 245,
              deliveryRate: 98.0,
              readRate: 85.2
            },
            {
              templateId: 'template_2',
              name: 'estado_orden',
              usage: 189,
              deliveryRate: 96.8,
              readRate: 82.1
            }
          ],
          conversationMetrics: {
            averageResponseTime: '5 minutos',
            resolutionRate: 92.5,
            customerSatisfaction: 4.7
          }
        };

        return {
          success: true,
          data: mockMetrics
        };
      }

      const queryParams = dateRange ? `?dateFrom=${dateRange.from}&dateTo=${dateRange.to}` : '';
      const response = await fetch(`${this.baseUrl}/api/v1/whatsapp/analytics${queryParams}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Error al obtener métricas de WhatsApp'
      };
    }
  }

  // Gestión de plantillas
  async obtenerPlantillas(filters?: {
    status?: string;
    category?: string;
    language?: string;
  }): Promise<ApiResponse<WhatsAppTemplate[]>> {
    try {
      if (this.mockData) {
        const mockTemplates: WhatsAppTemplate[] = [
          {
            id: 'template_1',
            name: 'orden_confirmacion',
            status: 'approved',
            category: 'utility',
            language: 'es',
            components: [
              {
                type: 'header',
                format: 'text',
                text: '✅ Orden Confirmada'
              },
              {
                type: 'body',
                text: 'Hola {{1}}, tu orden {{2}} ha sido confirmada. Total: Bs {{3}}. Fecha estimada: {{4}}.'
              },
              {
                type: 'footer',
                text: 'BurbujApp - Lavandería Premium'
              }
            ],
            createdAt: '2025-08-01T10:00:00.000Z',
            lastModified: '2025-08-01T10:00:00.000Z'
          },
          {
            id: 'template_2',
            name: 'estado_orden',
            status: 'approved',
            category: 'utility',
            language: 'es',
            components: [
              {
                type: 'header',
                format: 'text',
                text: '📋 Estado de tu Orden'
              },
              {
                type: 'body',
                text: '¡Hola {{1}}! Tu orden {{2}} está {{3}}. {{4}}'
              },
              {
                type: 'footer',
                text: 'BurbujApp 🫧'
              }
            ],
            createdAt: '2025-08-02T14:30:00.000Z',
            lastModified: '2025-08-02T14:30:00.000Z'
          },
          {
            id: 'template_3',
            name: 'bienvenida',
            status: 'pending',
            category: 'marketing',
            language: 'es',
            components: [
              {
                type: 'header',
                format: 'text',
                text: '🎉 ¡Bienvenido a BurbujApp!'
              },
              {
                type: 'body',
                text: 'Hola {{1}}, gracias por elegir BurbujApp. Estamos aquí para cuidar tu ropa con el mejor servicio de lavandería. ¿En qué podemos ayudarte hoy?'
              },
              {
                type: 'footer',
                text: 'Tu lavandería de confianza 🫧'
              }
            ],
            createdAt: '2025-08-03T09:15:00.000Z',
            lastModified: '2025-08-03T09:15:00.000Z'
          }
        ];

        // Aplicar filtros si existen
        let filteredTemplates = mockTemplates;
        if (filters?.status) {
          filteredTemplates = filteredTemplates.filter(t => t.status === filters.status);
        }
        if (filters?.category) {
          filteredTemplates = filteredTemplates.filter(t => t.category === filters.category);
        }

        return {
          success: true,
          data: filteredTemplates
        };
      }

      const queryParams = new URLSearchParams();
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.category) queryParams.append('category', filters.category);
      if (filters?.language) queryParams.append('language', filters.language);

      const response = await fetch(`${this.baseUrl}/api/v1/whatsapp/templates?${queryParams}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Error al obtener plantillas'
      };
    }
  }

  async crearPlantilla(templateData: Partial<WhatsAppTemplate>): Promise<ApiResponse<{ templateId: string; status: string }>> {
    try {
      if (this.mockData) {
        // Simular creación exitosa
        const newTemplateId = `template_${Date.now()}`;
        
        return {
          success: true,
          data: {
            templateId: newTemplateId,
            status: 'pending'
          },
          message: 'Plantilla enviada para aprobación a Meta'
        };
      }

      const response = await fetch(`${this.baseUrl}/api/v1/whatsapp/templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData)
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Error al crear plantilla'
      };
    }
  }

  // Gestión de contactos
  async obtenerContactos(filters?: {
    page?: number;
    limit?: number;
    search?: string;
    tags?: string[];
    segment?: string;
  }): Promise<PaginatedResponse<WhatsAppContact>> {
    try {
      if (this.mockData) {
        const mockContacts: WhatsAppContact[] = [
          {
            id: 'contact_1',
            phoneNumber: '+591 75123456',
            name: 'María García',
            firstName: 'María',
            lastName: 'García',
            email: 'maria.garcia@email.com',
            tags: ['cliente_premium', 'activo'],
            segments: ['clientes_frecuentes'],
            lastMessageDate: '2025-08-09T10:30:00.000Z',
            totalOrders: 15,
            totalSpent: 850.50,
            status: 'active',
            createdAt: '2025-01-15T08:00:00.000Z'
          },
          {
            id: 'contact_2',
            phoneNumber: '+591 76234567',
            name: 'Carlos Mendoza',
            firstName: 'Carlos',
            lastName: 'Mendoza',
            tags: ['nuevo_cliente'],
            segments: ['clientes_nuevos'],
            lastMessageDate: '2025-08-08T15:45:00.000Z',
            totalOrders: 3,
            totalSpent: 125.00,
            status: 'active',
            createdAt: '2025-07-20T12:00:00.000Z'
          }
        ];

        const page = filters?.page || 1;
        const limit = filters?.limit || 20;
        const start = (page - 1) * limit;
        const end = start + limit;

        let filteredContacts = mockContacts;
        if (filters?.search) {
          const searchLower = filters.search.toLowerCase();
          filteredContacts = filteredContacts.filter(c => 
            c.name.toLowerCase().includes(searchLower) ||
            c.phoneNumber.includes(searchLower) ||
            c.email?.toLowerCase().includes(searchLower)
          );
        }

        const paginatedContacts = filteredContacts.slice(start, end);

        return {
          success: true,
          data: paginatedContacts,
          pagination: {
            page,
            totalPages: Math.ceil(filteredContacts.length / limit),
            totalItems: filteredContacts.length,
            itemsPerPage: limit
          }
        };
      }

      const queryParams = new URLSearchParams();
      if (filters?.page) queryParams.append('page', filters.page.toString());
      if (filters?.limit) queryParams.append('limit', filters.limit.toString());
      if (filters?.search) queryParams.append('search', filters.search);
      if (filters?.segment) queryParams.append('segment', filters.segment);

      const response = await fetch(`${this.baseUrl}/api/v1/whatsapp/contacts?${queryParams}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        data: [],
        pagination: {
          page: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 20
        }
      };
    }
  }

  // Gestión de campañas
  async crearCampana(campaignData: Partial<WhatsAppCampaign>): Promise<ApiResponse<{ campaignId: string; estimatedReach: number }>> {
    try {
      if (this.mockData) {
        const campaignId = `campaign_${Date.now()}`;
        const estimatedReach = Math.floor(Math.random() * 500) + 100;

        return {
          success: true,
          data: {
            campaignId,
            estimatedReach
          },
          message: 'Campaña creada exitosamente'
        };
      }

      const response = await fetch(`${this.baseUrl}/api/v1/whatsapp/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData)
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Error al crear campaña'
      };
    }
  }

  async obtenerCampanas(): Promise<ApiResponse<WhatsAppCampaign[]>> {
    try {
      if (this.mockData) {
        const mockCampaigns: WhatsAppCampaign[] = [
          {
            id: 'campaign_1',
            name: 'Promoción Fin de Mes',
            description: 'Descuento especial para clientes frecuentes',
            templateId: 'template_promo',
            targetAudience: {
              segments: ['clientes_frecuentes'],
              tags: ['cliente_premium']
            },
            variables: {
              descuento: '20%',
              validez: '31 de Agosto'
            },
            scheduling: {
              type: 'scheduled',
              scheduledDate: '2025-08-31T09:00:00.000Z'
            },
            rateLimiting: {
              messagesPerMinute: 50,
              dailyLimit: 500
            },
            status: 'scheduled',
            createdAt: '2025-08-09T10:00:00.000Z',
            metrics: {
              totalSent: 0,
              delivered: 0,
              read: 0,
              replied: 0,
              errors: 0,
              deliveryRate: 0,
              readRate: 0,
              replyRate: 0,
              cost: {
                total: 0,
                perMessage: 0.10,
                currency: 'BOB'
              }
            }
          }
        ];

        return {
          success: true,
          data: mockCampaigns
        };
      }

      const response = await fetch(`${this.baseUrl}/api/v1/whatsapp/campaigns`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Error al obtener campañas'
      };
    }
  }

  // Envío de mensajes
  async enviarMensaje(
    phoneNumber: string, 
    templateId: string, 
    variables: object
  ): Promise<ApiResponse<{ messageId: string }>> {
    try {
      if (this.mockData) {
        const messageId = `msg_${Date.now()}`;
        
        return {
          success: true,
          data: { messageId },
          message: 'Mensaje enviado exitosamente'
        };
      }

      const response = await fetch(`${this.baseUrl}/api/v1/whatsapp/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          templateId,
          variables
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Error al enviar mensaje'
      };
    }
  }
}

// Instancia del servicio
const whatsappApiServiceImpl = new WhatsAppApiServiceImpl();

// API wrapper con métodos en inglés para mejor integración
export const whatsappApiService = {
  // Configuración
  configureConnection: whatsappApiServiceImpl.configurarConexion.bind(whatsappApiServiceImpl),
  getStatus: whatsappApiServiceImpl.obtenerEstado.bind(whatsappApiServiceImpl),
  getMetrics: whatsappApiServiceImpl.obtenerMetricas.bind(whatsappApiServiceImpl),

  // Plantillas
  getTemplates: whatsappApiServiceImpl.obtenerPlantillas.bind(whatsappApiServiceImpl),
  createTemplate: whatsappApiServiceImpl.crearPlantilla.bind(whatsappApiServiceImpl),

  // Contactos
  getContacts: whatsappApiServiceImpl.obtenerContactos.bind(whatsappApiServiceImpl),

  // Campañas
  createCampaign: whatsappApiServiceImpl.crearCampana.bind(whatsappApiServiceImpl),
  getCampaigns: whatsappApiServiceImpl.obtenerCampanas.bind(whatsappApiServiceImpl),

  // Mensajes
  sendMessage: whatsappApiServiceImpl.enviarMensaje.bind(whatsappApiServiceImpl),

  // Métodos en español para compatibilidad
  obtenerEstado: whatsappApiServiceImpl.obtenerEstado.bind(whatsappApiServiceImpl),
  obtenerMetricas: whatsappApiServiceImpl.obtenerMetricas.bind(whatsappApiServiceImpl),
  obtenerPlantillas: whatsappApiServiceImpl.obtenerPlantillas.bind(whatsappApiServiceImpl),
  obtenerContactos: whatsappApiServiceImpl.obtenerContactos.bind(whatsappApiServiceImpl),
};
