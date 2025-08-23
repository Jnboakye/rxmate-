// hooks/useUniversitiesAndCohorts.ts
import { useState, useEffect, useCallback } from 'react';
import paymentService, { University, Cohort } from '@/lib/payment';

// Hook for fetching universities
export function useUniversities() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUniversities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🏫 Fetching universities...');
      const data = await paymentService.getUniversities();
      console.log('🏫 Universities fetched successfully:', data);
      setUniversities(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch universities';
      console.error('❌ Error fetching universities:', errorMessage);
      setError(errorMessage);
      setUniversities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  return { 
    universities, 
    loading, 
    error, 
    refetch: fetchUniversities 
  };
}

// Hook for fetching cohorts
export function useCohorts(universityId?: string) {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCohorts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('📚 Fetching cohorts for university:', universityId || 'all');
      let data: Cohort[];
      
      if (universityId) {
        data = await paymentService.getCohortsByUniversity(universityId);
      } else {
        data = await paymentService.getCohorts();
      }
      
      console.log('📚 Cohorts fetched successfully:', data);
      setCohorts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch cohorts';
      console.error('❌ Error fetching cohorts:', errorMessage);
      setError(errorMessage);
      setCohorts([]);
    } finally {
      setLoading(false);
    }
  }, [universityId]);

  useEffect(() => {
    fetchCohorts();
  }, [fetchCohorts]);

  return { 
    cohorts, 
    loading, 
    error, 
    refetch: fetchCohorts 
  };
}

// Hook for getting a specific cohort by ID
export function useCohort(cohortId: string | number | undefined) {
  const [cohort, setCohort] = useState<Cohort | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCohort = useCallback(async () => {
    if (!cohortId) {
      setCohort(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('📖 Fetching cohort by ID:', cohortId);
      const foundCohort = await paymentService.getCohortById(cohortId.toString());
      
      if (foundCohort) {
        console.log('📖 Cohort found:', foundCohort);
        setCohort(foundCohort);
      } else {
        console.warn('📖 Cohort not found for ID:', cohortId);
        setError('Cohort not found');
        setCohort(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch cohort';
      console.error('❌ Error fetching cohort:', errorMessage);
      setError(errorMessage);
      setCohort(null);
    } finally {
      setLoading(false);
    }
  }, [cohortId]);

  useEffect(() => {
    fetchCohort();
  }, [fetchCohort]);

  return { 
    cohort, 
    loading, 
    error, 
    refetch: fetchCohort 
  };
}

// Hook for getting a specific university by ID
export function useUniversity(universityId: string | undefined) {
  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUniversity = useCallback(async () => {
    if (!universityId) {
      setUniversity(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('🏢 Fetching university by ID:', universityId);
      const foundUniversity = await paymentService.getUniversityById(universityId);
      
      if (foundUniversity) {
        console.log('🏢 University found:', foundUniversity);
        setUniversity(foundUniversity);
      } else {
        console.warn('🏢 University not found for ID:', universityId);
        setError('University not found');
        setUniversity(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch university';
      console.error('❌ Error fetching university:', errorMessage);
      setError(errorMessage);
      setUniversity(null);
    } finally {
      setLoading(false);
    }
  }, [universityId]);

  useEffect(() => {
    fetchUniversity();
  }, [fetchUniversity]);

  return { 
    university, 
    loading, 
    error, 
    refetch: fetchUniversity 
  };
}

// Combined hook for universities and cohorts with filtering and utilities
export function useUniversitiesWithCohorts() {
  const { 
    universities, 
    loading: universitiesLoading, 
    error: universitiesError, 
    refetch: refetchUniversities 
  } = useUniversities();
  
  const { 
    cohorts, 
    loading: cohortsLoading, 
    error: cohortsError, 
    refetch: refetchCohorts 
  } = useCohorts();

  const loading = universitiesLoading || cohortsLoading;
  const error = universitiesError || cohortsError;

  // Function to get cohorts for a specific university
  const getCohortsByUniversity = useCallback((universityId: string | number) => {
    console.log('🔍 Filtering cohorts for university:', universityId);
    console.log('📚 Available cohorts:', cohorts);
    
    // Check if any cohorts have university_id field
    const hasUniversityId = cohorts.some(cohort => cohort.university_id !== undefined);
    
    if (!hasUniversityId) {
      console.warn('⚠️ Cohorts do not have university_id field. Returning all cohorts.');
      return cohorts;
    }
    
    const filtered = cohorts.filter(cohort => {
      // Handle both string and number IDs
      const cohortUniversityId = cohort.university_id;
      const targetUniversityId = universityId.toString();
      
      return cohortUniversityId === targetUniversityId || 
             cohortUniversityId === parseInt(targetUniversityId, 10).toString();
    });
    
    console.log('🔍 Filtered cohorts:', filtered);
    return filtered;
  }, [cohorts]);

  // Function to get university by ID
  const getUniversityById = useCallback((universityId: string | number) => {
    const targetId = universityId.toString();
    const found = universities.find(university => 
      university.id === targetId || 
      university.id === parseInt(targetId, 10).toString()
    );
    console.log(`🔍 Looking for university ID ${targetId}, found:`, found);
    return found;
  }, [universities]);

  // Function to get cohort by ID
  const getCohortById = useCallback((cohortId: string | number) => {
    const targetId = cohortId.toString();
    const found = cohorts.find(cohort => 
      cohort.id.toString() === targetId || 
      cohort.id === parseInt(targetId, 10)
    );
    console.log(`🔍 Looking for cohort ID ${targetId}, found:`, found);
    return found;
  }, [cohorts]);

  // Function to refresh all data
  const refetchAll = useCallback(async () => {
    console.log('🔄 Refreshing all universities and cohorts data...');
    await Promise.all([refetchUniversities(), refetchCohorts()]);
  }, [refetchUniversities, refetchCohorts]);

  return {
    universities,
    cohorts,
    loading,
    error,
    getCohortsByUniversity,
    getUniversityById,
    getCohortById,
    refetchAll,
    refetchUniversities,
    refetchCohorts,
  };
}

// Hook for payment status checking and verification
export function usePaymentStatus(paymentReference?: string) {
  const [paymentStatus, setPaymentStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  const checkPaymentStatus = useCallback(async (reference?: string) => {
    const refToCheck = reference || paymentReference;
    if (!refToCheck) {
      console.warn('⚠️ No payment reference provided for status check');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('💳 Checking payment status for reference:', refToCheck);
      const response = await paymentService.getPaymentStatus(refToCheck);
      console.log('💳 Payment status response:', response);
      
      setPaymentStatus(response.data);
      setIsVerified(response.status === 'success' && response.data?.status === 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check payment status';
      console.error('❌ Error checking payment status:', errorMessage);
      setError(errorMessage);
      setIsVerified(false);
    } finally {
      setLoading(false);
    }
  }, [paymentReference]);

  useEffect(() => {
    if (paymentReference) {
      checkPaymentStatus();
    }
  }, [paymentReference, checkPaymentStatus]);

  return {
    paymentStatus,
    loading,
    error,
    isVerified,
    refetch: checkPaymentStatus,
  };
}

// Hook for payment initiation with form handling
export function usePaymentInit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const initiatePayment = useCallback(async (
    formData: {
      email: string;
      phone: string;
      cohort: string;
      university: string;
    },
    cohort: Cohort,
    callbackUrl?: string
  ) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('💰 Initiating payment process...');
      const response = await paymentService.initiatePayment(formData, cohort, callbackUrl);
      console.log('💰 Payment initiation successful:', response);
      setSuccess(true);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initiate payment';
      console.error('❌ Payment initiation failed:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearState = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    initiatePayment,
    loading,
    error,
    success,
    clearState,
  };
}