import api from "./api";

export const jobApi = {
  getAll: () => api.get("/jobs"),
  getMy: () => api.get("/jobs/my"),
  create: (data: any) => api.post("/jobs", data),
  update: (id: number, data: any) => api.put(`/jobs/${id}`, data),
  remove: (id: number) => api.delete(`/jobs/${id}`),
  interest: (id: number) => api.post(`/jobs/${id}/interest`)
}
