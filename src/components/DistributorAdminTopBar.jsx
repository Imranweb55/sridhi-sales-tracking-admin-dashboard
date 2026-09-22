// FILE: src/components/DistributorAdminTopBar.jsx
// NEW FILE — Feature: two Admin Dashboard login types. Fixed top bar
// (search + notifications + admin avatar), used only inside
// DistributorAdminLayout. Structurally similar "always fixed" pattern
// to the reference screenshot's top nav, styled to match this
// dashboard's own dark/teal premium identity.
import { useAdminAuth } from "../context/AdminAuthContext";

export default function DistributorAdminTopBar({ title, subtitle }) {
  const { admin } = useAdminAuth();
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-lg font-bold text-gray-900">{title}</h1>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle || today}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
          <input
            placeholder="Search distributors, zones..."
            className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <button className="relative w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-teal-500 text-white text-[9px] rounded-full flex items-center justify-center">•</span>
        </button>

        <div className="flex items-center gap-2 pl-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 text-white text-xs font-bold flex items-center justify-center">
            {admin?.name?.[0]?.toUpperCase() || "D"}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-700 leading-tight">{admin?.name || "Distributor Admin"}</p>
            <p className="text-[11px] text-gray-400 leading-tight">Distributor Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}