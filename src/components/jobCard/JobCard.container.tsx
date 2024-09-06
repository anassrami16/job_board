import React, { useState } from 'react';
import { Job } from '../../models/jobs.model'; // Assuming Job model is defined here

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle card expand/collapse
  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className="card w-full bg-base-100 shadow-md my-4">
      {/* Card Header - clickable to expand/collapse */}
      <div className="card-body" onClick={toggleExpand}>
        <h2 className="card-title">{job.name}</h2>
        <p className="text-sm text-gray-500">
          Posted: {new Date(job.created_at).toLocaleDateString()}
        </p>
        <div className="flex justify-end">
          <button className="btn btn-sm btn-outline">
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      {/* Expanded Section */}
      {isExpanded && (
        <div className="card-body bg-gray-50">
          <p>
            <strong>Company:</strong>{' '}
            {job?.tags &&
              job?.tags.find((tag) => tag.name === 'company')?.value}
          </p>
          <p>
            <strong>Category:</strong>{' '}
            {job?.tags &&
              job?.tags.find((tag) => tag.name === 'category')?.value}
          </p>
          <p>
            <strong>Location:</strong> {job.location?.text}
          </p>
          <p>
            <strong>Summary:</strong> {job.summary}
          </p>

          <div className="mt-4">
            <h3 className="text-md font-semibold">Skills Required:</h3>
            <ul className="list-disc pl-6">
              {job.skills?.map((skill, index) => (
                <li key={index}>{skill.name}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h3 className="text-md font-semibold">Certifications:</h3>
            <ul className="list-disc pl-6">
              {job.certifications?.map((cert, index) => (
                <li key={index}>{cert.name}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h3 className="text-md font-semibold">Tasks:</h3>
            <ul className="list-disc pl-6">
              {job.tasks?.map((task, index) => (
                <li key={index}>{task.name}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard;
