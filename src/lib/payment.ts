import { json, text } from "stream/consumers";

// lib/payment.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

// Export interfaces at the top
export interface PaymentFormData {
  email: string;
  phone: string;
  cohort: string;
  university: string;
}

export interface University {
  id: string;
  name: string;
  code?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Cohort {
  id: number;
  title: string;
  description?: string;
  university_id?: string;
  current_price: number;
  original_price: number;
  currency?: string;
  login_allowed: boolean;
  created_at: string;
  expires_at: string;
  // Legacy fields for backward compatibility
  name?: string;
  start_date?: string;
  end_date?: string;
  max_students?: number;
  current_students?: number;
  status?: "active" | "inactive" | "full" | "completed";
  updated_at?: string;
}

export interface PaymentInitResponse {
  status: string;
  message: string;
  data?: {
    reference: string;
    url: string;
    access_code: string;
  };
}

export interface PaymentStatusResponse {
  status: string;
  message: string;
  data?: {
    reference: string;
    amount: number;
    currency: string;
    status: string;
    gateway_response: string;
    paid_at?: string;
    created_at: string;
    customer: {
      email: string;
      phone: string;
    };
  };
}

class PaymentService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
    console.log("Payment Service initialized with base URL:", this.baseURL);
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;

    console.log(`🌐 Making request to: ${url}`);
    console.log(`📤 Request method: ${options.method || "GET"}`);
    console.log(`📤 Request headers:`, options.headers);

    if (options.body) {
      console.log(`📤 Request body:`, options.body);
    }

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      console.log(
        `📥 Response status: ${response.status} ${response.statusText}`
      );
      /** 
      console.log(
        `📥 Response headers:`,
        Object.fromEntries(response.headers.entries())
      );
      */

      // Handle different response types
      let data;

      // const contentType = response.headers.get("content-type");
      try {
        data = await response.json();
        console.log("Parsed JSON data:", data);
      } catch (parseError) {
        console.log('Failed to parse JSON respose: ' , parseError);
        throw new Error(`invalid JSON response from ${url}`)
      }

      /** 
      if (contentType && contentType.includes("application/json")) {
        console.log(response);
        const responseText = await response.json();

        try {
          data = JSON.parse(responseText);
          console.log(`📥 Parsed response data:`, data);
        } catch (parseError) {
          console.error("❌ JSON parsing failed:", parseError, "Raw", json);
          throw new Error(`Invalid JSON response: ${json}`);
        }
      } else {
        const text = await response.text();
        console.log(`📥 Non-JSON response:`, text);
        throw new Error(
          `Invalid response format. Expected JSON, got: ${contentType}. Response: ${text}`
        );
      }
*/

      if (!response.ok) {
        const errorMessage =
          data?.message ||
          data?.error ||
          `API Error: ${response.status} ${response.statusText}`;
        console.error(`❌ API Error Response:`, {
          status: response.status,
          statusText: response.statusText,
          data: data,
          url: url,
        });
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error("❌ Payment Service Error:", error);


      // Enhanced error reporting
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          `Network error: Unable to connect to ${url}. Please check your internet connection.`
        );
      }

      throw error;
    }
  }

  /**
   * Get all universities
   */
  async getUniversities(): Promise<University[]> {
    try {
      const response = await this.makeRequest("/universities", {
        method: "GET",
      });

      if (Array.isArray(response)) {
        return response;
      } else if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (
        response.universities &&
        Array.isArray(response.universities)
      ) {
        return response.universities;
      } else {
        console.warn("Unexpected universities response structure:", response);
        return [];
      }
    } catch (error) {
      console.error("Failed to fetch universities:", error);
      throw new Error(
        `Failed to fetch universities: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get all cohorts
   */
  async getCohorts(): Promise<Cohort[]> {
    try {
      const response = await this.makeRequest("/cohort", {
        method: "GET",
      });

      if (Array.isArray(response)) {
        return response.map((cohort) => ({
          ...cohort,
          name: cohort.name || cohort.title,
          currency: cohort.currency || "GHS",
          status: cohort.status || "active",
        }));
      } else if (response.data && Array.isArray(response.data)) {
        return response.data.map((cohort: any) => ({
          ...cohort,
          name: cohort.name || cohort.title,
          currency: cohort.currency || "GHS",
          status: cohort.status || "active",
        }));
      } else if (response.cohorts && Array.isArray(response.cohorts)) {
        return response.cohorts.map((cohort: any) => ({
          ...cohort,
          name: cohort.name || cohort.title,
          currency: cohort.currency || "GHS",
          status: cohort.status || "active",
        }));
      } else {
        console.warn("Unexpected cohorts response structure:", response);
        return [];
      }
    } catch (error) {
      console.error("Failed to fetch cohorts:", error);
      throw new Error(
        `Failed to fetch cohorts: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get cohorts by university ID
   */
  async getCohortsByUniversity(universityId: string): Promise<Cohort[]> {
    try {
      const allCohorts = await this.getCohorts();

      if (allCohorts.length > 0 && allCohorts[0].university_id !== undefined) {
        return allCohorts.filter(
          (cohort) =>
            cohort.university_id === universityId ||
            cohort.university_id === parseInt(universityId, 10).toString()
        );
      }

      console.warn(
        "Cohorts do not have university_id field. Returning all cohorts."
      );
      return allCohorts;
    } catch (error) {
      throw new Error(
        `Failed to fetch cohorts for university: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get university by ID
   */
  async getUniversityById(
    universityId: string
  ): Promise<University | undefined> {
    try {
      const universities = await this.getUniversities();
      return universities.find(
        (u) =>
          u.id === universityId ||
          u.id === parseInt(universityId, 10).toString()
      );
    } catch (error) {
      throw new Error(
        `Failed to fetch university: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get cohort by ID
   */
  async getCohortById(cohortId: string): Promise<Cohort | undefined> {
    try {
      const cohorts = await this.getCohorts();
      return cohorts.find(
        (c) => c.id.toString() === cohortId || c.id === parseInt(cohortId, 10)
      );
    } catch (error) {
      throw new Error(
        `Failed to fetch cohort: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Test API connectivity
   */
  async testConnection(): Promise<boolean> {
    try {
      console.log("🔍 Testing API connection...");

      // Try to fetch universities as a simple connectivity test
      const response = await fetch(`${this.baseURL}/universities`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      console.log(
        `🔍 Connection test response: ${response.status} ${response.statusText}`
      );
      return response.status < 500; // Accept 4xx but not 5xx errors
    } catch (error) {
      console.error("🔍 Connection test failed:", error);
      return false;
    }
  }

  /**
   * Initiate a payment transaction
   * POST /payment/initialise
   */
  async initiatePayment(
    formData: PaymentFormData,
    cohort: Cohort,
    callbackUrl?: string
  ): Promise<PaymentInitResponse> {
    console.log("🚀 Starting payment initiation process...");
    console.log("📋 Form data received:", formData);
    console.log("📋 Cohort data received:", cohort);
    console.log("📋 Callback URL:", callbackUrl);

    // Test connection first
    const connectionOk = await this.testConnection();
    if (!connectionOk) {
      throw new Error(
        "Unable to connect to payment service. Please check your internet connection and try again."
      );
    }

    // Validate required data before sending
    if (
      !formData.email ||
      !formData.phone ||
      !formData.cohort ||
      !formData.university
    ) {
      const missingFields = [];
      if (!formData.email) missingFields.push("email");
      if (!formData.phone) missingFields.push("phone");
      if (!formData.cohort) missingFields.push("cohort");
      if (!formData.university) missingFields.push("university");

      console.error("❌ Missing required form fields:", missingFields);
      throw new Error(
        `Missing required form data: ${missingFields.join(", ")}`
      );
    }

    if (!cohort || !cohort.current_price) {
      console.error("❌ Invalid cohort data:", cohort);
      throw new Error("Invalid cohort data - missing price information");
    }

    // Format phone number properly
    let phoneNumber = formData.phone.trim();
    console.log("📞 Original phone number:", phoneNumber);

    phoneNumber = phoneNumber.replace(/[^\d+]/g, "");
    console.log("📞 After removing non-digits:", phoneNumber);

    if (!phoneNumber.startsWith("+233")) {
      if (phoneNumber.startsWith("0")) {
        phoneNumber = phoneNumber.substring(1);
      }
      phoneNumber = `+233${phoneNumber}`;
    }
    console.log("📞 Final formatted phone number:", phoneNumber);

    // Validate phone number length
    if (phoneNumber.length !== 13) {
      console.error("❌ Invalid phone number length:", phoneNumber.length);
      throw new Error(
        `Invalid phone number format. Expected 13 characters (+233XXXXXXXXX), got ${phoneNumber.length}. Please enter a valid Ghanaian phone number.`
      );
    }

    // Generate unique payment reference
    const paymentReference = `RX_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    console.log("🔢 Generated payment reference:", paymentReference);

    // Prepare payment data according to API schema
    const paymentData = {
      payment_reference: paymentReference,
      phone: phoneNumber,
      email: formData.email.trim().toLowerCase(),
      cohort_id: parseInt(formData.cohort, 10),
      ...(callbackUrl && { callback_url: callbackUrl }),
    };

    console.log("📤 Final payment data to be sent:", paymentData);

    // Validate cohort_id is a valid number
    if (isNaN(paymentData.cohort_id)) {
      console.error("❌ Invalid cohort_id:", formData.cohort);
      throw new Error(
        "Invalid cohort selection. Please refresh the page and try again."
      );
    }

    try {
      let response;
      try {
        response = await this.makeRequest("/payment/initialise", {
          method: "POST",
          body: JSON.stringify(paymentData),
        });
        console.log("response from makeRequest:", response);
      } catch (error) {
        console.error(" Error calling payment/initialise endpoint:", error);
        throw new Error(
          "Payment initialization request failed. Please try again."
        );
      }

      // Check if payment initialization was successful
      if (response.status === "success" && response.data?.url) {
        console.log("🎉 Payment initialization successful!");
        console.log("🔗 URL:", response.data.url);

        // Store payment reference and form data in sessionStorage
        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem("payment_reference", paymentReference);
            sessionStorage.setItem(
              "payment_form_data",
              JSON.stringify({
                email: formData.email,
                phone: phoneNumber,
                cohort_id: formData.cohort,
                university_id: formData.university,
              })
            );
            sessionStorage.setItem("selected_cohort", JSON.stringify(cohort));
            console.log("💾 Payment data stored in session storage");
          } catch (storageError) {
            console.warn(
              "⚠️ Failed to store payment data in session storage:",
              storageError
            );
          }
        }

        // Redirect user to the URL
        if (typeof window !== "undefined") {
          console.log("🔄 Redirecting to payment gateway...");
          window.location.href = response.data.url;
        }

        return response;
      } else {
        console.error(
          "❌ Payment initialization failed - invalid response:",
          response
        );
        throw new Error(
          response.message ||
            response.error ||
            "Payment initialization failed - no authorization URL received"
        );
      }
    } catch (error) {
      console.error("❌ Payment initialization error:", error);

      // Enhanced error handling with more specific messages
      if (error instanceof Error) {
        if (error.message.includes("422")) {
          throw new Error(
            "Payment validation failed. Please check that all your details are correct and try again."
          );
        } else if (error.message.includes("400")) {
          throw new Error(
            "Bad request. Please check your form data and try again."
          );
        } else if (error.message.includes("401")) {
          throw new Error("Authentication failed. Please contact support.");
        } else if (error.message.includes("403")) {
          throw new Error("Access denied. Please contact support.");
        } else if (error.message.includes("404")) {
          throw new Error("Payment service not found. Please contact support.");
        } else if (error.message.includes("500")) {
          throw new Error("Server error. Please try again in a few minutes.");
        } else if (error.message.includes("Network error")) {
          throw new Error(
            "Network connection failed. Please check your internet connection and try again."
          );
        }

        // If it's already a formatted error message, use it
        throw error;
      }

      throw new Error("Payment initialization failed. Please try again.");
    }
  }

  /**
   * Get payment status by reference
   */
  async getPaymentStatus(reference: string): Promise<PaymentStatusResponse> {
    try {
      console.log("🔍 Checking payment status for reference:", reference);
      const response = await this.makeRequest(`/payment/${reference}`, {
        method: "GET",
      });
      console.log("📊 Payment status response:", response);
      return response;
    } catch (error) {
      throw new Error(
        `Failed to get payment status: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Handle webhook
   */
  async handleWebhook(webhookData: any): Promise<any> {
    try {
      return await this.makeRequest("/payment/webhook", {
        method: "POST",
        body: JSON.stringify(webhookData),
      });
    } catch (error) {
      throw new Error(
        `Failed to process webhook: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Verify a payment transaction
   */
  async verifyPayment(reference: string): Promise<boolean> {
    try {
      const response = await this.getPaymentStatus(reference);
      return (
        response.status === "success" && response.data?.status === "success"
      );
    } catch (error) {
      console.error("Payment verification failed:", error);
      return false;
    }
  }

  /**
   * Get stored payment data from sessionStorage
   */
  getStoredPaymentData() {
    if (typeof window === "undefined") return null;

    try {
      const reference = sessionStorage.getItem("payment_reference");
      const formData = sessionStorage.getItem("payment_form_data");
      const cohort = sessionStorage.getItem("selected_cohort");

      return {
        reference,
        formData: formData ? JSON.parse(formData) : null,
        cohort: cohort ? JSON.parse(cohort) : null,
      };
    } catch (error) {
      console.error("Error retrieving stored payment data:", error);
      return null;
    }
  }

  /**
   * Clear stored payment data
   */
  clearStoredPaymentData() {
    if (typeof window === "undefined") return;

    sessionStorage.removeItem("payment_reference");
    sessionStorage.removeItem("payment_form_data");
    sessionStorage.removeItem("selected_cohort");
  }
}

// Export singleton instance as default
const paymentService = new PaymentService();
export default paymentService;
