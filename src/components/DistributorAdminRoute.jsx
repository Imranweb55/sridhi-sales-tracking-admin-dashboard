// FILE: src/components/DistributorAdminRoute.jsx
// NEW FILE — Feature: two Admin Dashboard login types. Guards every
// /distributor-admin/* route: requires a valid token AND
// admin.role === "distributor_admin" (the same `role` field the login
// API already returns — no backend change). A field-sales admin who
// somehow lands on one of these URLs is bounced to their own dashboard
// instead of seeing distributor-only pages.
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function DistributorAdminRoute({ children }) {
  const { token, admin } = useAdminAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (admin && admin.role !== "distributor_admin") return <Navigate to="/dashboard" replace />;
  return children;
}