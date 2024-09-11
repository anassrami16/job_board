import React, { useState, useEffect, useRef } from 'react';
import { Job } from '../../models/jobs.model';
import { FaSearch, FaFilter, FaSortDown, FaSortUp } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useAtom } from 'jotai'; // Import jotai hook
import {
  selectedCategoriesWithPersistence,
  sortCriteriaWithPersistence,
  sortOrderWithPersistence, // Import the sort order atom with persistence
} from '../../store/filters'; // Updated atoms with persistence

interface JobTableProps {
  jobs: Job[];
  onSelectJob: (jobId: number) => void;
  isLoading: boolean;
  isError: boolean;
}

const JobTable: React.FC<JobTableProps> = ({
  jobs,
  onSelectJob,
  isLoading,
  isError,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortedJobs, setSortedJobs] = useState<Job[]>(jobs);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);
  const [categories, setCategories] = useState<string[]>([
    'AI / Research & Development',
    'Artificial Intelligence',
    'Financial Services',
    'Human Resources',
    'Software Engineering',
  ].map(item => item.toUpperCase()));
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  // Jotai state atoms
  const [sortCriteria, setSortCriteria] = useAtom(sortCriteriaWithPersistence); // Sort criteria with persistence
  const [sortOrder, setSortOrder] = useAtom(sortOrderWithPersistence); // Sort order with persistence
  const [selectedCategories, setSelectedCategories] = useAtom(
    selectedCategoriesWithPersistence
  ); // Selected categories with persistence

  // Update the sorted jobs whenever the jobs or filters change
  useEffect(() => {
    const filteredAndSortedJobs = filterJobsByCategory(
      sortJobs(
        jobs.filter((job) =>
          job.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
    setSortedJobs(filteredAndSortedJobs);
  }, [searchTerm, sortCriteria, sortOrder, selectedCategories, jobs]);

  // Reset sorting to default
  const resetSort = () => {
    setSortCriteria(null); // Reset sort criteria to default (null or 'name')
    setSortOrder('asc'); // Reset sort order to 'asc'
  };

  const sortJobs = (jobs: any) => {
    if (!sortCriteria) return jobs;

    return [...jobs].sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';

      // Handle different sorting criteria
      switch (sortCriteria) {
        case 'name':
          aValue = a.name ? a.name.toString() : '';
          bValue = b.name ? b.name.toString() : '';
          break;

        case 'created_at':
          aValue = a.created_at ? new Date(a.created_at).getTime() : 0;
          bValue = b.created_at ? new Date(b.created_at).getTime() : 0;
          break;

        case 'category':
          aValue =
            a?.tags?.find(
              (tag: { name: string }) => tag?.name.toUpperCase() === 'CATEGORY'
            )?.value || '';
          bValue =
            b?.tags?.find(
              (tag: { name: string }) => tag?.name.toUpperCase() === 'CATEGORY'
            )?.value || '';
          break;

        default:
          aValue = '';
          bValue = '';
      }

      // Handle the sorting order (ascending or descending)
      if (sortOrder === 'asc') {
        return aValue.toString().localeCompare(bValue.toString());
      } else {
        return bValue.toString().localeCompare(aValue.toString());
      }
    });
  };

  // Filter jobs by selected categories
  const filterJobsByCategory = (jobs: Job[]) => {
    if (selectedCategories.length === 0) return jobs;
    return jobs.filter((job) => {
      const category = job?.tags?.find(
        (tag) => tag?.name.toUpperCase() === 'CATEGORY'
      )?.value?.toUpperCase();
      return category && selectedCategories.includes(category);
    });
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node) &&
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
        setIsCategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
    setIsCategoryDropdownOpen(false);
  };

  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
    setDropdownOpen(false);
  };

  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder); // Persist new sort order
  };

  // Handle sort criteria change
  const handleSortCriteriaChange = (
    criteria: 'name' | 'category' | 'created_at'
  ) => {
    if (sortCriteria === criteria) {
      toggleSortOrder();
    } else {
      setSortCriteria(criteria);
      setSortOrder('asc'); // Default to ascending when changing sort criteria
    }
  };

  // Handle drag and drop of job listings
  const handleOnDragEnd = (result: any) => {
    const { destination, source } = result;
    if (!destination) return;
    const reorderedJobs = Array.from(sortedJobs);
    const [movedJob] = reorderedJobs.splice(source.index, 1);
    reorderedJobs.splice(destination.index, 0, movedJob);
    setSortedJobs(reorderedJobs);
  };

  // Toggle job details expansion
  const toggleJobExpansion = (jobId: number) => {
    setExpandedJobId((prev) => (prev === jobId ? null : jobId));
  };

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    console.log('handleCategoryChange');
    console.log(category);
    setSelectedCategories(
      selectedCategories.includes(category)
        ? selectedCategories.filter((cat: any) => cat !== category)
        : [...selectedCategories, category]
    );
  };

  // Clear category filter
  const clearCategoryFilter = () => {
    setSelectedCategories([]); // Persist the cleared categories
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Search and Filter Bar */}
      <div className="flex flex-col lg:flex-row justify-between w-[95%] lg:w-full mb-5 py-2">
        {/* Search Bar */}
        <div className="relative w-full lg:w-[300px]">
          <input
            type="text"
            placeholder="Search jobs by title..."
            className="input input-bordered w-full pl-10 pr-4 py-2 text-sm md:text-base rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex lg:justify-center lg:align-middle lg:gap-2">
          {/* Sort Filter */}
          <div
            ref={sortDropdownRef}
            className="relative mt-3 lg:mt-0 w-full lg:w-auto z-50"
          >
            <button
              className="btn btn-outline flex items-center gap-2 relative"
              onClick={toggleDropdown}
            >
              <FaFilter />
              <span>Sort</span>
              {sortCriteria && (
                <span className="absolute -translate-y-[3px] translate-x-[3px] top-0 right-0 w-2 h-2 bg-pink-600 rounded-full" />
              )}
            </button>

            {isDropdownOpen && (
              <ul className="absolute border-[#202A37] border-[1px] flex items-center flex-col left-0 mt-2 min-w-full bg-white shadow-lg rounded-md py-2 z-50 lg:right-0 lg:left-auto lg:w-48">
                <li
                  className={`w-[90%] rounded-md mt-1 cursor-pointer px-4 py-2 hover:bg-gray-100 flex justify-between items-center ${
                    sortCriteria === 'name' ? 'font-bold bg-gray-100' : ''
                  }`}
                  onClick={() => handleSortCriteriaChange('name')}
                >
                  Name
                  {sortCriteria === 'name' &&
                    (sortOrder === 'asc' ? (
                      <FaSortUp className="ml-2" />
                    ) : (
                      <FaSortDown className="ml-2" />
                    ))}
                </li>
                <li
                  className={`w-[90%] rounded-md mt-1 cursor-pointer px-4 py-2 hover:bg-gray-100 flex justify-between items-center ${
                    sortCriteria === 'category' ? 'font-bold bg-gray-100' : ''
                  }`}
                  onClick={() => handleSortCriteriaChange('category')}
                >
                  Category
                  {sortCriteria === 'category' &&
                    (sortOrder === 'asc' ? (
                      <FaSortUp className="ml-2" />
                    ) : (
                      <FaSortDown className="ml-2" />
                    ))}
                </li>
                <li
                  className={`w-[90%] rounded-md mt-1 cursor-pointer px-4 py-2 hover:bg-gray-100 flex justify-between items-center ${
                    sortCriteria === 'created_at' ? 'font-bold bg-gray-100' : ''
                  }`}
                  onClick={() => handleSortCriteriaChange('created_at')}
                >
                  Creation Date
                  {sortCriteria === 'created_at' &&
                    (sortOrder === 'asc' ? (
                      <FaSortUp className="ml-2" />
                    ) : (
                      <FaSortDown className="ml-2" />
                    ))}
                </li>
                {sortCriteria && (
                  <li
                    onClick={resetSort}
                    className="w-[90%] rounded-md mt-1 cursor-pointer px-4 py-2 bg-red-100 text-red-700 hover:bg-gray-100 flex justify-between items-center"
                  >
                    Reset
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* Category Filter Dropdown */}
          <div
            ref={categoryDropdownRef}
            className="relative mt-3 lg:mt-0 w-full lg:w-auto z-50"
          >
            <button
              className="btn btn-outline flex items-center gap-2 relative"
              onClick={toggleCategoryDropdown}
            >
              <FaFilter />
              <span>Category Filter</span>
              {selectedCategories.length > 0 && (
                <span className="absolute -translate-y-[3px] translate-x-[3px] top-0 right-0 w-2 h-2 bg-pink-600 rounded-full" />
              )}
            </button>

            {isCategoryDropdownOpen && (
              <ul className="absolute border-[#202A37] border-[1px] flex items-center flex-col left-0 mt-2 min-w-full bg-white shadow-lg rounded-md py-2 z-50 lg:right-0 lg:left-auto lg:w-64">
                {categories.map((category) => (
                  <li
                    key={category}
                    className={`w-[90%] rounded-md mt-1 cursor-pointer px-4 py-2 hover:bg-gray-100 flex justify-between items-center ${
                      selectedCategories.includes(category)
                        ? 'font-bold bg-gray-100'
                        : ''
                    }`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </li>
                ))}
                <li
                  onClick={clearCategoryFilter}
                  className="w-[90%] rounded-md mt-1 cursor-pointer px-4 py-2 bg-red-100 text-red-700 hover:bg-gray-100 flex justify-between items-center"
                >
                  Clear
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Job Listings Table */}
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="jobs">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="overflow-x-auto w-full border-[1px] input-bordered shadow-lg rounded-md"
            >
              <table className="table w-full table-auto overflow-scroll">
                {/* Table Header */}
                <thead className="bg-base-200">
                  <tr>
                    <th className="text-left px-4 py-2">Title</th>
                    <th className="text-left px-4 py-2 hidden sm:table-cell">
                      Company
                    </th>
                    <th className="text-left px-4 py-2">Location</th>
                    <th className="text-left px-4 py-2 hidden lg:table-cell">
                      Category
                    </th>
                    <th className="text-left px-4 py-2">Posted Date</th>
                    <th className="text-left px-4 py-2">Actions</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody
                  style={{
                    display: 'block',
                    height: '500px',
                    overflow: 'scroll',
                  }}
                >
                  {isError ? (
                    <div className="flex justify-center items-center w-full py-10 h-full">
                      <div className="text-center text-red-600">
                        <h2 className="text-2xl font-semibold">
                          Something went wrong!
                        </h2>
                        <p className="mt-2">
                          We encountered an error while fetching the jobs.
                          Please try again later.
                        </p>
                      </div>
                    </div>
                  ) : isLoading ? (
                    <div className="flex justify-center items-center w-full py-10 h-full">
                      <AiOutlineLoading3Quarters className="text-4xl text-indigo-600 animate-spin" />
                    </div>
                  ) : (
                    sortedJobs.map((job, index) => (
                      <React.Fragment key={job.id}>
                        <Draggable
                          key={job.id}
                          draggableId={String(job.id)}
                          index={index}
                        >
                          {(provided) => (
                            <tr
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="hover:bg-base-100 cursor-pointer transition duration-200 ease-in-out"
                            >
                              <td className="px-4 py-2 font-semibold">
                                {job.name}
                              </td>
                              <td className="px-4 py-2 hidden sm:table-cell">
                                {
                                  job?.tags?.find(
                                    (tag) =>
                                      tag?.name.toUpperCase() === 'COMPANY'
                                  )?.value
                                }
                              </td>
                              <td className="px-4 py-2">
                                {job.location?.text}
                              </td>
                              <td className="px-4 py-2 hidden lg:table-cell">
                                {
                                  job?.tags?.find(
                                    (tag) =>
                                      tag?.name.toUpperCase() === 'CATEGORY'
                                  )?.value
                                }
                              </td>
                              <td className="px-4 py-2">
                                {job?.created_at &&
                                  new Date(
                                    job?.created_at
                                  ).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-2">
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() => toggleJobExpansion(job.id)}
                                >
                                  {expandedJobId === job.id ? 'Close' : 'Open'}
                                </button>
                              </td>
                            </tr>
                          )}
                        </Draggable>

                        {/* Expanded Row - Details */}
                        {expandedJobId === job.id && (
                          <tr>
                            <td colSpan={6} className="bg-gray-50">
                              <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
                                <h3 className="font-bold text-2xl text-indigo-700 mb-4">
                                  Job Details
                                </h3>
                                <div className="space-y-3">
                                  <p className="text-gray-700">
                                    <strong className="font-semibold text-indigo-700">
                                      Summary:
                                    </strong>{' '}
                                    {job.summary || 'N/A'}
                                  </p>

                                  {job.skills && (
                                    <p className="text-gray-700">
                                      <strong className="font-semibold text-indigo-700">
                                        Skills:
                                      </strong>{' '}
                                      {job.skills.map((skill) => (
                                        <span
                                          key={skill.name}
                                          className="badge badge-outline badge-primary mr-1"
                                        >
                                          {skill.name}
                                        </span>
                                      ))}
                                    </p>
                                  )}

                                  <p className="text-gray-700">
                                    <strong className="font-semibold text-indigo-700">
                                      Location:
                                    </strong>{' '}
                                    {job.location?.text || 'N/A'}
                                  </p>

                                  <p className="text-gray-700">
                                    <strong className="font-semibold text-indigo-700">
                                      Category:
                                    </strong>{' '}
                                    {job?.tags?.find(
                                      (tag) =>
                                        tag?.name.toUpperCase() === 'CATEGORY'
                                    )?.value || 'N/A'}
                                  </p>

                                  <p className="text-gray-700">
                                    <strong className="font-semibold text-indigo-700">
                                      Posted Date:
                                    </strong>{' '}
                                    {new Date(
                                      job.created_at
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                  {provided.placeholder}
                </tbody>
              </table>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default JobTable;
