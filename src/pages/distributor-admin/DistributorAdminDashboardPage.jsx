// FILE: src/pages/distributor-admin/DistributorAdminDashboardPage.jsx
// NEW FILE — Feature: two Admin Dashboard login types. The landing page
// after a "Distributors" login. Unlike the PWA's HomePage (still dummy
// data, by your instruction), this page pulls REAL, live data from your
// existing, unchanged APIs (getAllDistributors, getAllBatterRequests) —
// no new backend endpoint, no dummy numbers.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DistributorAdminLayout from "../../components/DistributorAdminLayout";
import GradientStatCard from "../../components/GradientStatCard";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { getAllDistributors } from "../../api/distributorApi";
import { getAllBatterRequests } from "../../api/batterRequestApi";

export default function DistributorAdminDashboardPage() {
  const { admin } = useAdminAuth();
  const navigate = useNavigate();
  const [distributors, setDistributors] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllDistributors(), getAllBatterRequests({ status: "pending" })])
      .then(([d, r]) => {
        setDistributors(d.distributors || []);
        setPendingRequests(r.requests || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalCustomers = distributors.reduce((s, d) => s + (d.customerCount || 0), 0);
  const activeCount = distributors.filter((d) => d.isActive).length;

  return (
    <DistributorAdminLayout title="Dashboard" subtitle="Distributor operations overview">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-700 p-6 mb-6 text-white">
        <svg className="absolute right-4 bottom-0 w-40 h-40 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
        </svg>
        <span className="inline-flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1 text-[11px] font-medium mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" /> All systems operational
        </span>
        <h1 className="text-2xl font-bold mb-1">Good Morning, {admin?.name?.split(" ")[0] || "Admin"} 👋</h1>
        <p className="text-teal-100 text-sm max-w-lg mb-4">
          Monitor distributor zones, approve daily batter requirements, and keep every customer's deliveries on track — all from one dashboard.
        </p>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate("/distributor-admin/add")} className="bg-white text-teal-800 px-4 py-2 rounded-xl text-sm font-semibold">
            + Add Distributor
          </button>
          <button onClick={() => navigate("/distributor-admin/daily-requirement")} className="bg-white/15 border border-white/30 px-4 py-2 rounded-xl text-sm font-semibold">
            View Daily Requirements
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <GradientStatCard
          color="teal" icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
          label="Total Distributors" value={loading ? "…" : distributors.length} subtext="Live from your database"
        />
        <GradientStatCard
          color="green" icon="M5 13l4 4L19 7"
          label="Active" value={loading ? "…" : activeCount} subtext={`${distributors.length ? Math.round((activeCount / distributors.length) * 100) : 0}% currently active`}
        />
        <GradientStatCard
          color="purple" icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          label="Customers Assigned" value={loading ? "…" : totalCustomers} subtext="Across all zones"
        />
        <GradientStatCard
          color="orange" icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          label="Pending Requests" value={loading ? "…" : pendingRequests.length} subtext="Awaiting your approval"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold text-gray-800">Today's Pending Requests</p>
          <button onClick={() => navigate("/distributor-admin/daily-requirement")} className="text-sm text-teal-600 font-medium">View All →</button>
        </div>

        {loading && <p className="text-gray-400 text-sm">Loading…</p>}
        {!loading && pendingRequests.length === 0 && <p className="text-gray-400 text-sm">No pending requests right now.</p>}

        <div className="divide-y divide-gray-50">
          {pendingRequests.slice(0, 5).map((r) => (
            <div key={r._id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-gray-800">{r.distributor?.name} <span className="text-gray-400 font-normal">({r.distributor?.employeeId})</span></p>
                <p className="text-xs text-gray-400">{r.distributor?.zone?.name || "—"}</p>
              </div>
              <p className="text-sm text-gray-600">{r.requestedIdlyKg}kg idly / {r.requestedDosaKg}kg dosa</p>
            </div>
          ))}
        </div>
      </div>
    </DistributorAdminLayout>
  );
}