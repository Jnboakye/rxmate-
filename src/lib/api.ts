
// Types for API integration
export interface CheckoutData {
  email: string;
  phone: string;
  cohort: string;
  amount: number;
  currency: string;
}

export interface PaymentResponse {
  success: boolean;
  url?: string;           // Paystack checkout URL
  paymentUrl?: string;    // Alternative field name
  sessionId?: string;
  message?: string;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public response?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    if (!this.baseUrl) {
      console.warn('NEXT_PUBLIC_API_URL is not defined');
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body !== 'string') {
      config.body = JSON.stringify(config.body);
    }

    try {
      console.log(`Making API request to: ${url}`);
      const response = await fetch(url, config);
      
      console.log(`Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          errorData
        );
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      console.error('API Request failed:', error);
      throw new ApiError(
        0,
        'Network error or server is unavailable',
        error
      );
    }
  }

  // Test basic connection
  async testConnection(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/');
  }

  // Create payment session - tries multiple endpoint patterns
  async createPaymentSession(checkoutData: CheckoutData): Promise<PaymentResponse> {
    const possibleEndpoints = [
      '/api/payment/create',
      '/api/payments/create',
      '/api/checkout/create',
      '/payment/initialize',
      '/payments/initialize',
      '/api/payments',
      '/checkout',
      '/payment'
    ];

    let lastError: ApiError | null = null;

    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        const response = await this.request<PaymentResponse>(endpoint, {
          method: 'POST',
          body: checkoutData,
        });
        
        console.log(`Success with endpoint: ${endpoint}`, response);
        return response;
        
      } catch (error) {
        console.log(`Endpoint ${endpoint} failed:`, error);
        lastError = error as ApiError;
        continue;
      }
    }
    
    throw lastError || new ApiError(404, 'No valid payment endpoint found');
  }

  // Contact form submission
  async submitContactForm(contactData: {
    name: string;
    email: string;
    message: string;
    phone?: string;
  }): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/api/contact', {
      method: 'POST',
      body: contactData,
    });
  }

  // Newsletter subscription
  async subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/api/newsletter/subscribe', {
      method: 'POST',
      body: { email },
    });
  }
}

export const apiService = new ApiService();
export default apiService;