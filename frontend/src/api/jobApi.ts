import api from './api';

export const jobApi = {
  getAllWithParams: (page = 1, size = 6, search = "") =>
    api.get(`/jobs?page=${page}&size=${size}${search ? `&search=${encodeURIComponent(search)}` : ''}`),

  getAll: () => api.get('/jobs'),
  getMy: () => api.get('/jobs/my'),
  getInterestedUsers: () => api.get('/jobs/my-interested-users'),

  create: (data: any) => api.post('/jobs', data),
  update: (id: number, data: any) => api.put(`/jobs/${id}`, data),
  remove: (id: number) => api.delete(`/jobs/${id}`),
  interest: (id: number) => api.post(`/jobs/${id}/interest`),
};