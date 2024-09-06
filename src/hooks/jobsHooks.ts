import { useQuery } from '@tanstack/react-query';
import JobsService from '../services/jobs.service';
import { GetJobReq } from '../models/jobs.model';

// Define a unique query key for caching
export const JOBS_QUERY_KEY = ['jobs'];

export const useJobsQuery = (params: GetJobReq) => {
  const jobsService = new JobsService();

  return useQuery({
    queryKey: [...JOBS_QUERY_KEY, params],
    queryFn: () => jobsService.getJobs(params),
    staleTime: 5000, // Data stays fresh for 5 seconds
  });
};
