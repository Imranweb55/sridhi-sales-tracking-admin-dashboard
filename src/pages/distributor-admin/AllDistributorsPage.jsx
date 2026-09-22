// FILE: src/pages/distributor-admin/AllDistributorsPage.jsx
// UI REDESIGN ONLY — matches the reference screenshot exactly (gradient
// stat cards, zone/status filter dropdowns, avatar-initial table rows,
// kebab actions menu, pagination footer). Every data call
// (getAllDistributors / deleteDistributor / getZones) and the routes
// used are 100% unchanged — nothing in the backend or App.jsx needs to
// change for this update.
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DistributorAdminLayout from "../../components/DistributorAdminLayout";
import GradientStatCard from "../../components/GradientStatCard";
import { getAllDistributors, deleteDistributor, getZones } from "../../api/distributorApi";

const AVATAR_COLORS = ["bg-teal-600", "bg-purple-600", "bg-green-600", "bg-orange-500", "bg-pink-600", "bg-indigo-600"];
const initials = (name = "") => name.trim().split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
const avatarColor = (name = "") => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const PAGE_SIZE = 10;

function ActionsMenu({ distributor, onView, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 6a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4z"/></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
          <button onClick={() => { setOpen(false); onView(distributor); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            Edit
          </button>
          <button onClick={() => { setOpen(false); onView(distributor); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            View Details
          </button>
          <button onClick={() => { setOpen(false); onDelete(distributor); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

export default function AllDistributorsPage() {
  const navigate = useNavigate();
  const [distributors, setDistributors] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [zoneFilter, setZoneFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const load = () => {
    setLoading(true);
    Promise.all([getAllDistributors(), getZones()])
      .then(([d, z]) => { setDistributors(d.distributors || []); setZones(z.zones || []); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (d) => {
    if (!window.confirm(`Remove distributor "${d.name}"? Their assigned customers will be unassigned.`)) return;
    await deleteDistributor(d._id);
    load();
  };

  const filtered = distributors.filter((d) => {
    const matchesSearch = (d.name + d.employeeId + d.phone).toLowerCase().includes(search.toLowerCase());
    const matchesZone = !zoneFilter || d.zone?._id === zoneFilter;
    const matchesStatus = !statusFilter || (statusFilter === "active" ? d.isActive : !d.isActive);
    return matchesSearch && matchesZone && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <DistributorAdminLayout
      icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
      title="All Distributors"
      subtitle="Manage and track all your distributors in one place"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <GradientStatCard
          color="teal"
          icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
          label="Total Distributors"
          value={distributors.length}
          subtext="↑ Active distributors"
          watermark="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
        />
        <GradientStatCard
          color="green"
          icon="M5 13l4 4L19 7"
          label="Active"
          value={distributors.filter((d) => d.isActive).length}
          subtext={`● ${distributors.length ? Math.round((distributors.filter((d) => d.isActive).length / distributors.length) * 100) : 0}% currently active`}
          watermark="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
        <GradientStatCard
          color="purple"
          icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          label="Customers Assigned"
          value={distributors.reduce((s, d) => s + (d.customerCount || 0), 0)}
          subtext={distributors.some((d) => d.customerCount) ? "● Customers assigned" : "● No customers assigned yet"}
          watermark="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, ID or phone number…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <select value={zoneFilter} onChange={(e) => { setZoneFilter(e.target.value); setPage(1); }} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600">
          <option value="">All Zones</option>
          {zones.map((z) => <option key={z._id} value={z._id}>{z.name}</option>)}
        </select>

        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button
          onClick={() => navigate("/distributor-admin/add")}
          className="px-4 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 whitespace-nowrap flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          Add Distributor
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-wide">
            <tr>
              <th className="text-left px-5 py-3 font-medium">#</th>
              <th className="text-left px-5 py-3 font-medium">Name</th>
              <th className="text-left px-5 py-3 font-medium">Employee ID</th>
              <th className="text-left px-5 py-3 font-medium">Zone</th>
              <th className="text-left px-5 py-3 font-medium">Phone</th>
              <th className="text-left px-5 py-3 font-medium">Customers</th>
              <th className="text-left px-5 py-3 font-medium">Stock (Idly/Dosa kg)</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-right px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading && (
              <tr><td colSpan={9} className="px-5 py-10 text-center text-gray-400">Loading…</td></tr>
            )}
            {!loading && paged.length === 0 && (
              <tr><td colSpan={9} className="px-5 py-10 text-center text-gray-400">No distributors match this filter.</td></tr>
            )}
            {paged.map((d, i) => (
              <tr key={d._id} className="hover:bg-gray-50">
                <td className="px-5 py-3 text-gray-400">{(page - 1) * PAGE_SIZE + i + 1}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/distributor-admin/${d._id}`)}>
                    <div className={`w-9 h-9 rounded-full ${avatarColor(d.name)} text-white text-xs font-bold flex items-center justify-center flex-shrink-0`}>
                      {initials(d.name)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{d.name}</p>
                      <p className="text-xs text-gray-400">Distributor</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-600 text-xs font-medium">{d.employeeId}</span>
                </td>
                <td className="px-5 py-3 text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    {d.zone?.name || "—"}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                    {d.phone}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    {d.customerCount || 0}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                    {d.currentStockKg?.idly || 0} / {d.currentStockKg?.dosa || 0}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${d.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${d.isActive ? "bg-green-500" : "bg-gray-400"}`} />
                    {d.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <ActionsMenu distributor={d} onView={(dd) => navigate(`/distributor-admin/${dd._id}`)} onDelete={handleDelete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
          <span>Showing {paged.length} of {filtered.length} distributor{filtered.length === 1 ? "" : "s"}</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-medium">{page}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </DistributorAdminLayout>
  );
}