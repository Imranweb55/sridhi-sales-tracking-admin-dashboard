// FILE: src/api/distributorApi.js
// NEW FILE — Feature: Distributors module
import axiosInstance from "./axiosInstance";

// Distributors
export const getAllDistributors = () =>
  axiosInstance.get("/api/distributors/admin").then((r) => r.data);

export const getDistributorById = (id) =>
  axiosInstance.get(`/api/distributors/admin/${id}`).then((r) => r.data);

export const createDistributor = (payload) =>
  axiosInstance.post("/api/distributors/admin", payload).then((r) => r.data);

export const updateDistributor = (id, payload) =>
  axiosInstance.put(`/api/distributors/admin/${id}`, payload).then((r) => r.data);

export const resetDistributorPassword = (id, password) =>
  axiosInstance.put(`/api/distributors/admin/${id}/reset-password`, { password }).then((r) => r.data);

export const deleteDistributor = (id) =>
  axiosInstance.delete(`/api/distributors/admin/${id}`).then((r) => r.data);

export const assignCustomerToDistributor = (distributorId, customerId) =>
  axiosInstance.post(`/api/distributors/admin/${distributorId}/assign-customer`, { customerId }).then((r) => r.data);

export const unassignCustomer = (customerId) =>
  axiosInstance.put(`/api/distributors/admin/unassign-customer/${customerId}`).then((r) => r.data);

// Zones
export const getZones = () =>
  axiosInstance.get("/api/distributors/admin/zones").then((r) => r.data);

export const createZone = (payload) =>
  axiosInstance.post("/api/distributors/admin/zones", payload).then((r) => r.data);

export const deleteZone = (id) =>
  axiosInstance.delete(`/api/distributors/admin/zones/${id}`).then((r) => r.data);