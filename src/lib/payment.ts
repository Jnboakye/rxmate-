// src/lib/payment.ts

import { apiService, CheckoutData, PaymentResponse, ApiError } from './api';

export interface PaymentFormData {
  email: string;
  phone: string;
  cohort: string;
}

export class PaymentService {
  /**
   * Validate payment form data
   */
  static validatePaymentForm(formData: PaymentFormData): { isValid: boolean; error?: string } {
    if (!formData.email) {
      return { isValid: false, error: "Email is required" };
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return { isValid: false, error: "Please enter a valid email address" };
    }
    
    if (!formData.phone) {
      return { isValid: false, error: "Phone number is required" };
    }
    
    if (formData.phone.length < 9) {
      return { isValid: false, error: "Please enter a valid phone number" };
    }
    
    return { isValid: true };
  }

  /**
   * Initialize payment and redirect to payment provider
   * Set testMode to true for testing without backend
   */
  static async initiatePayment(
    formData: PaymentFormData, 
    amount: number = 1000, 
    testMode: boolean = true
  ): Promise<void> {
    // Validate form first
    const validation = this.validatePaymentForm(formData);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    console.log("Initiating payment with data:", formData);

    if (testMode) {
      // Test mode - simulate API call and redirect to test URL
      return this.initiateTestPayment(formData, amount);
    }

    // Production mode - call real API
    return this.initiateRealPayment(formData, amount);
  }

  /**
   * Test payment flow - simulates backend and redirects to test URL
   */
  private static async initiateTestPayment(formData: PaymentFormData, amount: number): Promise<void> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store form data for testing
      this.storePaymentData(formData, 'test_session_123');

      console.log("Test payment initialized, redirecting to test Paystack URL...");
      
      // Redirect to test Paystack URL
      window.location.href = "https://paystack.com/checkout/xyz";
      
    } catch (error) {
      console.error("Test payment error:", error);
      throw new Error("Test payment initialization failed");
    }
  }

  /**
   * Real payment flow - calls actual backend API
   */
  private static async initiateRealPayment(formData: PaymentFormData, amount: number): Promise<void> {
    try {
      const checkoutData: CheckoutData = {
        email: formData.email,
        phone: `+233${formData.phone}`, // Add Ghana country code
        cohort: formData.cohort,
        amount: amount,
        currency: "GHS"
      };

      console.log("Calling real API with data:", checkoutData);

      // Call API to create payment session
      const paymentResponse = await apiService.createPaymentSession(checkoutData);

      if (!paymentResponse.success) {
        throw new Error(paymentResponse.message || "Failed to initialize payment");
      }

      // Handle both possible field names for the Paystack URL
      const checkoutUrl = paymentResponse.url || paymentResponse.paymentUrl;
      
      if (!checkoutUrl) {
        throw new Error("Paystack checkout URL not provided by server");
      }

      // Store user data for later use (e.g., on payment success callback)
      this.storePaymentData(formData, paymentResponse.sessionId);
      
      // Redirect to real Paystack checkout
      console.log("Redirecting to real Paystack URL:", checkoutUrl);
      window.location.href = checkoutUrl;

    } catch (error) {
      console.error("Payment initialization error:", error);
      
      if (error instanceof ApiError) {
        if (error.status === 0) {
          throw new Error("Unable to connect to payment service. Please check your internet connection.");
        } else if (error.status === 404) {
          throw new Error("Payment service is currently unavailable. Please try again later.");
        } else {
          throw new Error(error.message);
        }
      }
      
      throw error;
    }
  }

  /**
   * Store payment data in session storage
   */
  private static storePaymentData(formData: PaymentFormData, sessionId?: string): void {
    try {
      sessionStorage.setItem('rxmate_payment_data', JSON.stringify({
        ...formData,
        sessionId,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Could not store payment data in session storage:', error);
    }
  }

  /**
   * Retrieve stored payment data
   */
  static getStoredPaymentData(): (PaymentFormData & { sessionId?: string; timestamp?: number }) | null {
    try {
      const stored = sessionStorage.getItem('rxmate_payment_data');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn('Could not retrieve payment data from session storage:', error);
      return null;
    }
  }

  /**
   * Clear stored payment data
   */
  static clearStoredPaymentData(): void {
    try {
      sessionStorage.removeItem('rxmate_payment_data');
    } catch (error) {
      console.warn('Could not clear payment data from session storage:', error);
    }
  }

  /**
   * Test backend connection
   */
  static async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.testConnection();
      return {
        success: true,
        message: `Backend connected! Response: ${JSON.stringify(response)}`
      };
    } catch (error) {
      console.error("Backend connection failed:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown connection error"
      };
    }
  }
}

export default PaymentService;