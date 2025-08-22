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
      console.log('Fetching universities...');
      const data = await paymentService.getUniversities();
      console.log('Universities fetched:', data);
      setUniversities(data);
    } catch (err) {
      console.error('Error fetching universities:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch universities');
      setUniversities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  return { universities, loading, error, refetch: fetchUniversities };
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
      console.log('Fetching cohorts for university:', universityId);
      let data: Cohort[];
      if (universityId) {
        data = await paymentService.getCohortsByUniversity(universityId);
      } else {
        data = await paymentService.getCohorts();
      }
      console.log('Cohorts fetched:', data);
      setCohorts(data);
    } catch (err) {
      console.error('Error fetching cohorts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch cohorts');
      setCohorts([]);
    } finally {
      setLoading(false);
    }
  }, [universityId]);

  useEffect(() => {
    fetchCohorts();
  }, [fetchCohorts]);

  return { cohorts, loading, error, refetch: fetchCohorts };
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
      console.log('Fetching cohort by ID:', cohortId);
      const foundCohort = await paymentService.getCohortById(cohortId.toString());
      console.log('Cohort found:', foundCohort);
      if (foundCohort) {
        setCohort(foundCohort);
      } else {
        setError('Cohort not found');
        setCohort(null);
      }
    } catch (err) {
      console.error('Error fetching cohort:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch cohort');
      setCohort(null);
    } finally {
      setLoading(false);
    }
  }, [cohortId]);

  useEffect(() => {
    fetchCohort();
  }, [fetchCohort]);

  return { cohort, loading, error, refetch: fetchCohort };
}

// Combined hook for universities and cohorts with filtering
export function useUniversitiesWithCohorts() {
  const { universities, loading: universitiesLoading, error: universitiesError } = useUniversities();
  const { cohorts, loading: cohortsLoading, error: cohortsError } = useCohorts();

  const loading = universitiesLoading || cohortsLoading;
  const error = universitiesError || cohortsError;

  // Function to get cohorts for a specific university
  const getCohortsByUniversity = useCallback((universityId: string | number) => {
    console.log('Filtering cohorts for university:', universityId);
    console.log('Available cohorts:', cohorts);
    
    // Check if any cohorts have university_id field
    const hasUniversityId = cohorts.some(cohort => cohort.university_id !== undefined);
    
    if (!hasUniversityId) {
      console.warn('Cohorts do not have university_id field. Returning all cohorts.');
      return cohorts;
    }
    
    const filtered = cohorts.filter(cohort => {
      // Handle both string and number IDs
      const cohortUniversityId = cohort.university_id;
      const targetUniversityId = universityId.toString();
      
      return cohortUniversityId === targetUniversityId || 
             cohortUniversityId === parseInt(targetUniversityId, 10).toString();
    });
    
    console.log('Filtered cohorts:', filtered);
    return filtered;
  }, [cohorts]);

  // Function to get university by ID
  const getUniversityById = useCallback((universityId: string | number) => {
    const targetId = universityId.toString();
    return universities.find(university => 
      university.id === targetId || 
      university.id === parseInt(targetId, 10).toString()
    );
  }, [universities]);

  // Function to get cohort by ID
  const getCohortById = useCallback((cohortId: string | number) => {
    const targetId = cohortId.toString();
    return cohorts.find(cohort => 
      cohort.id.toString() === targetId || 
      cohort.id === parseInt(targetId, 10)
    );
  }, [cohorts]);

  return {
    universities,
    cohorts,
    loading,
    error,
    getCohortsByUniversity,
    getUniversityById,
    getCohortById,
  };
}