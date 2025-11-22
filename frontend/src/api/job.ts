// src/types/job.ts
export interface Job {
  id: number;
  title: string;
  body: string;
  postedDate: string;
  posterName: string;
  posterId: number;
  interestedCount: number;
}

export interface PaginatedJobsResponse {
  data: Job[];
  total: number;
  page: number;
  pageSize: number;
}

export interface InterestedUser {
  jobTitle: string;
  userName: string;
  userEmail: string;
  interestedAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface CreateJobRequest {
  title: string;
  body: string;
}

export interface UpdateJobRequest {
  title: string;
  body: string;
}