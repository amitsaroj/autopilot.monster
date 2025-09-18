'use client';

import { useState, useEffect } from 'react';
import { contentApi } from '@/lib/api/client';
import Link from 'next/link';

interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience: 'entry' | 'mid' | 'senior' | 'lead';
  description: string;
  requirements: string[];
  benefits: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  postedAt: string;
  applicationDeadline?: string;
  isRemote: boolean;
  status: 'open' | 'closed' | 'paused';
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');

  useEffect(() => {
    fetchJobListings();
  }, []);

  const fetchJobListings = async () => {
    try {
      setLoading(true);
      const response = await contentApi.getJobListings({
        status: 'open',
        limit: 50,
        sort: 'postedAt',
        order: 'desc'
      });
      setJobs(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch job listings');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
    const matchesType = selectedType === 'all' || job.type === selectedType;
    const matchesExperience = selectedExperience === 'all' || job.experience === selectedExperience;
    
    return matchesSearch && matchesDepartment && matchesType && matchesExperience;
  });

  const departments = ['all', ...Array.from(new Set(jobs.map(job => job.department)))];
  const jobTypes = ['all', ...Array.from(new Set(jobs.map(job => job.type)))];
  const experienceLevels = ['all', ...Array.from(new Set(jobs.map(job => job.experience)))];

  const getExperienceColor = (level: string) => {
    switch (level) {
      case 'entry': return 'bg-green-100 text-green-800';
      case 'mid': return 'bg-blue-100 text-blue-800';
      case 'senior': return 'bg-purple-100 text-purple-800';
      case 'lead': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-blue-100 text-blue-800';
      case 'part-time': return 'bg-green-100 text-green-800';
      case 'contract': return 'bg-yellow-100 text-yellow-800';
      case 'internship': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job listings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Jobs</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchJobListings}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Team</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Build the future of AI automation with us. Explore exciting career opportunities at Autopilot.Monster
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search job titles, departments, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {jobTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.replace('-', ' ')}
                  </option>
                ))}
              </select>
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {experienceLevels.map(level => (
                  <option key={level} value={level}>
                    {level === 'all' ? 'All Levels' : level}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">💼</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">
              {searchQuery || selectedDepartment !== 'all' || selectedType !== 'all' || selectedExperience !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No job openings available at the moment'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(job.type)}`}>
                        {job.type.replace('-', ' ')}
                      </span>
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getExperienceColor(job.experience)}`}>
                        {job.experience}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center">
                        <span className="mr-1">🏢</span>
                        {job.department}
                      </span>
                      <span className="flex items-center">
                        <span className="mr-1">📍</span>
                        {job.isRemote ? 'Remote' : job.location}
                      </span>
                      {job.salary && (
                        <span className="flex items-center">
                          <span className="mr-1">💰</span>
                          {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {job.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.requirements.slice(0, 3).map((req, index) => (
                        <span key={index} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          {req}
                        </span>
                      ))}
                      {job.requirements.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{job.requirements.length - 3} more requirements
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Posted {new Date(job.postedAt).toLocaleDateString()}
                      </span>
                      {job.applicationDeadline && (
                        <span className="text-sm text-orange-600">
                          Apply by {new Date(job.applicationDeadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <Link
                      href={`/careers/${job.id}`}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Why Work With Us */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-6">Why Work With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="text-lg font-semibold mb-2">Innovation</h3>
              <p className="text-sm opacity-90">Work on cutting-edge AI and automation technologies</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🌍</div>
              <h3 className="text-lg font-semibold mb-2">Remote First</h3>
              <p className="text-sm opacity-90">Work from anywhere in the world with flexible hours</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📈</div>
              <h3 className="text-lg font-semibold mb-2">Growth</h3>
              <p className="text-sm opacity-90">Continuous learning and career development opportunities</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💝</div>
              <h3 className="text-lg font-semibold mb-2">Benefits</h3>
              <p className="text-sm opacity-90">Competitive salary, equity, and comprehensive benefits</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Don't see a role that fits?</h3>
          <p className="text-gray-600 mb-6">
            We're always looking for talented individuals. Send us your resume and let us know how you'd like to contribute.
          </p>
          <Link
            href="/contact"
            className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}