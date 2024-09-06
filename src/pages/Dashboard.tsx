import React, { useEffect, useState } from 'react';
import JobsService from '../services/jobs.service';
import Pagination from '../components/pagination/Pagination.container';
import JobTable from '../components/jobTable/JobTable.container';
import { GetJobsApiResp, Job } from '../models/jobs.model';
import { useJobsQuery } from '../hooks/jobsHooks';

function Dashboard() {
  const [currentMaxPages, setCurrentMaxPages] = useState<number | undefined>(
    undefined
  );
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_LIMIT = 10; // This should come from the API response

  // Handle page change
  const onPageChange = (page: number) => {
    setCurrentPage(page);
    // Fetch new jobs based on the page number
  };

  const { data, isLoading, isError, error } = useJobsQuery({
    board_keys: ['887595b735d68f0bc0b0b0535f7d8f7d158a3f4e'],
    page: String(currentPage),
    limit: String(ITEMS_LIMIT),
  });

  useEffect(() => {
    console.log(data);
    if (data?.meta?.maxPage && data?.meta?.maxPage !== currentMaxPages) {
      setCurrentMaxPages(data?.meta?.maxPage);
    }
  }, [data]);

  return (
    <div>
      {/* Your jobs list rendering */}
      <div className="container mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-6 ml-2">Job Listings</h1>

        <JobTable
          isLoading={isLoading}
          isError={isError}
          jobs={data?.data?.jobs ? data?.data?.jobs : []}
          onSelectJob={() => {}} //look here chatgpt this what will open the car
        />
        {currentMaxPages && (
          <Pagination
            currentPage={currentPage}
            totalPages={currentMaxPages}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
