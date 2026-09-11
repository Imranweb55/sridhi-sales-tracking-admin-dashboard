// FILE: src/api/whatsappApi.js
// NEW FILE — Feature: WhatsApp Automation
import axiosInstance from "./axiosInstance";

const BASE = "/api/admin/whatsapp";

// Preview how many invoices are ready to send today
export const getSendPreview = (date) =>
  axiosInstance.get(`${BASE}/preview`, { params: { date } }).then(r => r.data);

// Queue a new automation run (picked up by the local agent on the office PC)
export const startWhatsappAutomation = (date) =>
  axiosInstance.post(`${BASE}/start`, {}, { params: { date } }).then(r => r.data);

// Poll for the latest run's live status
export const getLatestWhatsappRun = () =>
  axiosInstance.get(`${BASE}/latest`).then(r => r.data);

// Run history for the Recent Activity table
export const getWhatsappRunHistory = () =>
  axiosInstance.get(`${BASE}/logs`).then(r => r.data);