// FILE: src/api/batterRequestApi.js
// NEW FILE — Feature: Distributors module — "Daily Requirement"
import axiosInstance from "./axiosInstance";

export const getAllBatterRequests = (params = {}) =>
  axiosInstance.get("/api/batter-requests/admin", { params }).then((r) => r.data);

export const approveBatterRequest = (id, payload) =>
  axiosInstance.put(`/api/batter-requests/admin/${id}/approve`, payload).then((r) => r.data);

export const rejectBatterRequest = (id, adminNote) =>
  axiosInstance.put(`/api/batter-requests/admin/${id}/reject`, { adminNote }).then((r) => r.data);