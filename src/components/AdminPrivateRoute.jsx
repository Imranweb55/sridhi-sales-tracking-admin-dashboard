// FILE: src/components/AdminPrivateRoute.jsx
// OWNER: Imran
// CHANGE (additive) — Feature: two Admin Dashboard login types. Added
// one check: an admin logged in with role "distributor_admin" is
// redirected to their own dashboard instead of the field-sales pages.
// Everything else about this file (the token check) is unchanged.
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
export default function AdminPrivateRoute({ children }) {
  const { token, admin } = useAdminAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (admin && admin.role === "distributor_admin") return <Navigate to="/distributor-admin/dashboard" replace />;
  return children;
}