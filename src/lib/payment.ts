// lib/payment.ts
import axios, { AxiosInstance, AxiosError } from "axios";

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

export interface PaymentInitRequest {
  payment_reference: string;
  phone: string;
  email: string;
  cohort_id: number;
  university_id?: number;
  callback_url?: string;
}

export interface PaymentInitResponse {
  url: string;
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

// Add proper types for API error responses
interface ApiErrorResponse {
  message?: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

// Add proper types for API responses
interface UniversitiesResponse {
  data?: University[];
  universities?: University[];
}

interface CohortsResponse {
  data?: Cohort[];
  cohorts?: Cohort[];
}

class PaymentService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL as string;

    if (!this.baseURL) {
      throw new Error("NEXT_PUBLIC_API_URL environment variable is not set");
    }

    // Create axios instance with default config
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000, // 30 seconds timeout
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Setup request interceptor for logging
    this.api.interceptors.request.use(
      (config) => {
        console.log(
          `🌐 Making ${config.method?.toUpperCase()} request to: ${config.url}`
        );
        if (config.data) {
          console.log("📤 Request data:", config.data);
        }
        return config;
      },
      (error) => {
        console.error("❌ Request error:", error);
        return Promise.reject(error);
      }
    );

    // Setup response interceptor for logging and error handling
    this.api.interceptors.response.use(
      (response) => {
        console.log(
          `📥 Response ${response.status} from ${response.config.url}`
        );
        console.log("📥 Response data:", response.data);
        return response;
      },
      (error: AxiosError) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );

    console.log("Payment Service initialized with base URL:", this.baseURL);
  }

  private handleError(error: AxiosError): never {
    console.error("❌ API Error:", error);

    // Add enhanced error handling for API responses
    if (error.response && error.response.data) {
      const errorData = error.response.data as ApiErrorResponse;
      if (errorData.detail) {
        throw new Error(errorData.detail);
      }
      if (errorData.message) {
        throw new Error(errorData.message);
      }
    }

    if (error.code === "ECONNABORTED") {
      throw new Error(
        "Request timeout. Please check your internet connection and try again."
      );
    }

    if (error.code === "ERR_NETWORK") {
      throw new Error(
        "Network error. Unable to connect to the server. Please check your internet connection."
      );
    }

    if (error.response) {
      const { status, data } = error.response;
      const errorData = data as ApiErrorResponse;
      let message: string;

      switch (status) {
        case 400:
          message =
            errorData?.message ||
            "Bad request. Please check your input and try again.";
          break;
        case 401:
          message = "Authentication failed. Please contact support.";
          break;
        case 403:
          message = "Access denied. Please contact support.";
          break;
        case 404:
          message = "Service not found. Please contact support.";
          break;
        case 422:
          message =
            errorData?.message ||
            "Validation failed. Please check your details and try again.";
          break;
        case 500:
          message = "Server error. Please try again in a few minutes.";
          break;
        default:
          message =
            errorData?.message ||
            `Server error (${status}). Please try again.`;
      }

      throw new Error(message);
    }

    // If no response (network error, etc.)
    throw new Error(
      error.message || "An unexpected error occurred. Please try again."
    );
  }

  /**
   * Test API connectivity
   */
  async testConnection(): Promise<boolean> {
    try {
      console.log("🔍 Testing API connection...");
      const response = await this.api.get("/universities", { timeout: 5000 });
      console.log(`🔍 Connection test successful: ${response.status}`);
      return true;
    } catch (error) {
      console.error("🔍 Connection test failed:", error);
      return false;
    }
  }

  /**
   * Get all universities
   */
  async getUniversities(): Promise<University[]> {
    try {
      const response = await this.api.get<
        University[] | UniversitiesResponse
      >("/universities");

      // Handle different response structures
      if (Array.isArray(response.data)) {
        return response.data;
      } 
      
      const responseData = response.data as UniversitiesResponse;
      if (responseData.data && Array.isArray(responseData.data)) {
        return responseData.data;
      } 
      
      if (responseData.universities && Array.isArray(responseData.universities)) {
        return responseData.universities;
      } 
      
      console.warn(
        "Unexpected universities response structure:",
        response.data
      );
      return [];
    } catch (error) {
      console.error("Failed to fetch universities:", error);
      throw error;
    }
  }

  /**
   * Get all cohorts
   */
  async getCohorts(): Promise<Cohort[]> {
    try {
      const response = await this.api.get<
        Cohort[] | CohortsResponse
      >("/cohort");

      let cohorts: Cohort[] = [];

      // Handle different response structures
      if (Array.isArray(response.data)) {
        cohorts = response.data;
      } else {
        const responseData = response.data as CohortsResponse;
        if (responseData.data && Array.isArray(responseData.data)) {
          cohorts = responseData.data;
        } else if (responseData.cohorts && Array.isArray(responseData.cohorts)) {
          cohorts = responseData.cohorts;
        } else {
          console.warn("Unexpected cohorts response structure:", response.data);
          return [];
        }
      }

      // Normalize cohort data
      return cohorts.map((cohort) => ({
        ...cohort,
        name: cohort.name || cohort.title,
        currency: cohort.currency || "GHS",
        status: cohort.status || "active",
      }));
    } catch (error) {
      console.error("Failed to fetch cohorts:", error);
      throw error;
    }
  }

  /**
   * Get cohorts by university ID
   */
  async getCohortsByUniversity(universityId: string): Promise<Cohort[]> {
    try {
      // First try to get cohorts with university filter if the API supports it
      // If not, we'll filter locally
      try {
        const response = await this.api.get<Cohort[]>(
          `/cohorts/university/${universityId}`
        );
        return Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        // If the endpoint doesn't exist, fall back to filtering all cohorts
        console.log(
          "University-specific cohort endpoint not available, filtering locally"
        );
        const allCohorts = await this.getCohorts();

        if (
          allCohorts.length > 0 &&
          allCohorts[0].university_id !== undefined
        ) {
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
      }
    } catch (error) {
      console.error("Failed to fetch cohorts for university:", error);
      throw error;
    }
  }

  /**
   * Get university by ID
   */
  async getUniversityById(
    universityId: string
  ): Promise<University | undefined> {
    try {
      // Try to get specific university first
      try {
        const response = await this.api.get<University>(
          `/universities/${universityId}`
        );
        return response.data;
      } catch (error) {
        // If specific endpoint doesn't exist, search in all universities
        const universities = await this.getUniversities();
        return universities.find(
          (u) =>
            u.id === universityId ||
            u.id === parseInt(universityId, 10).toString()
        );
      }
    } catch (error) {
      console.error("Failed to fetch university:", error);
      throw error;
    }
  }

  /**
   * Get cohort by ID
   */
  async getCohortById(cohortId: string): Promise<Cohort | undefined> {
    try {
      // Try to get specific cohort first
      try {
        const response = await this.api.get<Cohort>(`/cohort/${cohortId}`);
        return response.data;
      } catch (error) {
        // If specific endpoint doesn't exist, search in all cohorts
        const cohorts = await this.getCohorts();
        return cohorts.find(
          (c) => c.id.toString() === cohortId || c.id === parseInt(cohortId, 10)
        );
      }
    } catch (error) {
      console.error("Failed to fetch cohort:", error);
      throw error;
    }
  }

  /**
   * Initiate a payment transaction
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

    // Validate required data
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

      throw new Error(
        `Missing required form data: ${missingFields.join(", ")}`
      );
    }

    if (!cohort || !cohort.current_price) {
      throw new Error("Invalid cohort data - missing price information");
    }

    // Format phone number properly
    let phoneNumber = formData.phone.trim().replace(/[^\d+]/g, "");
    console.log("📞 Original phone number:", formData.phone);
    console.log("📞 After cleaning:", phoneNumber);

    if (!phoneNumber.startsWith("+233")) {
      if (phoneNumber.startsWith("0")) {
        phoneNumber = phoneNumber.substring(1);
      }
      phoneNumber = `+233${phoneNumber}`;
    }

    console.log("📞 Final formatted phone number:", phoneNumber);

    // Validate phone number length
    if (phoneNumber.length !== 13) {
      throw new Error(
        `Invalid phone number format. Expected 13 characters (+233XXXXXXXXX), got ${phoneNumber.length}. Please enter a valid Ghanaian phone number.`
      );
    }

    // Generate unique payment reference
    const paymentReference = `RX_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    console.log("🔢 Generated payment reference:", paymentReference);

    // Prepare payment data
    const paymentData: PaymentInitRequest = {
      payment_reference: paymentReference,
      phone: phoneNumber,
      email: formData.email.trim().toLowerCase(),
      cohort_id: parseInt(formData.cohort, 10),
      university_id: parseInt(formData.university, 10),
      ...(callbackUrl && { callback_url: callbackUrl }),
    };

    // Validate cohort_id is a valid number
    if (isNaN(paymentData.cohort_id)) {
      throw new Error(
        "Invalid cohort selection. Please refresh the page and try again."
      );
    }

    console.log("📤 Final payment data to be sent:", paymentData);

    try {
      const response = await this.api.post<PaymentInitResponse>(
        "/payment/initialise",
        paymentData
      );

      // Updated response handling to match actual API response structure
      if (response.data && response.data.url) {
        console.log("🎉 Payment initialization successful!");
        console.log("🔗 Redirect URL:", response.data.url);

        // Store payment data in sessionStorage
        this.storePaymentData(paymentReference, formData, cohort);

        // Redirect user to the payment URL
        if (typeof window !== "undefined") {
          console.log("🔄 Redirecting to payment gateway...");
          window.location.href = response.data.url;
        }

        return response.data;
      } else {
        console.error("Invalid response structure:", response.data);
        throw new Error(
          "Payment initialization failed - no authorization URL received"
        );
      }
    } catch (error) {
      console.error("❌ Payment initialization error:", error);
      throw error;
    }
  }

  /**
   * Get payment status by reference
   */
  async getPaymentStatus(reference: string): Promise<PaymentStatusResponse> {
    try {
      console.log("🔍 Checking payment status for reference:", reference);
      const response = await this.api.get<PaymentStatusResponse>(
        `/payment/${reference}`
      );
      console.log("📊 Payment status response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to get payment status:", error);
      throw error;
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
   * Store payment data in sessionStorage
   */
  private storePaymentData(
    reference: string,
    formData: PaymentFormData,
    cohort: Cohort
  ) {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("payment_reference", reference);
        sessionStorage.setItem(
          "payment_form_data",
          JSON.stringify({
            email: formData.email,
            phone: formData.phone,
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