// FILE: src/pages/distributor-admin/DistributorsMapPage.jsx
// UI REDESIGN ONLY — matches the reference screenshot exactly (4
// gradient stat cards, map + search/zone-filter bar, a right-side
// "Distributor Details" panel for the selected pin, and a zone summary
// strip at the bottom with a "View All" link). Still built on
// react-leaflet (no Google Maps key needed) — no data calls changed.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, CircleMarker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import DistributorAdminLayout from "../../components/DistributorAdminLayout";
import GradientStatCard from "../../components/GradientStatCard";
import { getAllDistributors, getZones, resetDistributorPassword } from "../../api/distributorApi";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const CHENNAI_CENTER = [13.0827, 80.2707];

function FlyTo({ position }) {
  const map = useMap();
  useEffect(() => { if (position) map.flyTo(position, 13, { duration: 0.6 }); }, [position]);
  return null;
}

export default function DistributorsMapPage() {
  const navigate = useNavigate();
  const [zones, setZones] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [zoneFilter, setZoneFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetMsg, setResetMsg] = useState("");

  useEffect(() => {
    Promise.all([getZones(), getAllDistributors()])
      .then(([zoneData, distData]) => {
        setZones(zoneData.zones || []);
        setDistributors(distData.distributors || []);
        setSelected(distData.distributors?.[0] || null);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredDistributors = distributors.filter((d) => {
    const matchesSearch = (d.name + d.employeeId).toLowerCase().includes(search.toLowerCase());
    const matchesZone = !zoneFilter || d.zone?._id === zoneFilter;
    return matchesSearch && matchesZone;
  });

  const handleResetPassword = async () => {
    if (!selected || !newPassword || newPassword.length < 6) { setResetMsg("Password must be at least 6 characters."); return; }
    const data = await resetDistributorPassword(selected._id, newPassword);
    setResetMsg(`New login: ${data.loginCredentials.employeeId} / ${data.loginCredentials.password}`);
    setNewPassword("");
  };

  return (
    <DistributorAdminLayout
      icon="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
      title="Distributors Map"
      subtitle="View and manage distributor locations across your region"
      showBell
    >
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <GradientStatCard color="purple" icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" label="Total Distributors" value={distributors.length} subtext="Active distributor(s)" />
        <GradientStatCard color="green" icon="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" label="Active" value={distributors.filter((d) => d.isActive).length} subtext="Currently active" />
        <GradientStatCard color="pink" icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" label="Assigned Customers" value={distributors.reduce((s, d) => s + (d.customerCount || 0), 0)} subtext={distributors.some((d) => d.customerCount) ? "Customers assigned" : "No customers assigned yet"} />
        <GradientStatCard color="orange" icon="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" label="Stock (Idly/Dosa Kg)" value={`${distributors.reduce((s, d) => s + (d.currentStockKg?.idly || 0), 0)} / ${distributors.reduce((s, d) => s + (d.currentStockKg?.dosa || 0), 0)}`} subtext="Current stock level" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">Distributors Location</p>
            <p className="text-xs text-gray-400">Live map view of all distributors</p>
          </div>
          <div className="flex-1 flex items-center gap-2 justify-end flex-wrap">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"/></svg>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, ID or area…" className="pl-10 pr-3 py-2 rounded-xl border border-gray-200 text-sm w-56" />
            </div>
            <select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-600">
              <option value="">All Zones</option>
              {zones.map((z) => <option key={z._id} value={z._id}>{z.name}</option>)}
            </select>
            <button className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
              Filter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-[480px] rounded-xl overflow-hidden">
            {!loading && (
              <MapContainer center={CHENNAI_CENTER} zoom={11} style={{ height: "100%", width: "100%" }}>
                <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {selected?.fridgeLocation?.latitude && <FlyTo position={[selected.fridgeLocation.latitude, selected.fridgeLocation.longitude]} />}

                {zones.map((z) => (
                  <CircleMarker key={z._id} center={[z.latitude, z.longitude]} radius={16} pathOptions={{ color: "#2563eb", fillColor: "#3b82f6", fillOpacity: 0.2 }} />
                ))}

                {filteredDistributors
                  .filter((d) => d.fridgeLocation?.latitude && d.fridgeLocation?.longitude)
                  .map((d) => (
                    <Marker
                      key={d._id}
                      position={[d.fridgeLocation.latitude, d.fridgeLocation.longitude]}
                      eventHandlers={{ click: () => setSelected(d) }}
                    />
                  ))}
              </MapContainer>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </div>
              <p className="font-semibold text-gray-800 text-sm">Distributor Details</p>
            </div>

            {selected ? (
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">
                      {selected.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{selected.name}</p>
                      <p className="text-xs text-gray-400">{selected.employeeId} · Distributor</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${selected.isActive ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-500"}`}>
                    {selected.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-gray-500 mb-4">
                  <p className="flex justify-between"><span className="text-gray-400">Phone</span><span className="text-gray-700 font-medium">{selected.phone}</span></p>
                  <p className="flex justify-between"><span className="text-gray-400">Address</span><span className="text-gray-700 font-medium text-right">{selected.address ? `${selected.address}, Chennai Tamil Nadu` : "—"}</span></p>
                  <p className="flex justify-between"><span className="text-gray-400">Zone</span><span className="text-gray-700 font-medium">{selected.zone?.name || "—"}</span></p>
                  <p className="flex justify-between"><span className="text-gray-400">Fridge Location</span><span className="text-gray-700 font-medium">{selected.fridgeLocation?.address || "—"}</span></p>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <p className="text-xs font-semibold text-gray-700 mb-0.5">Reset PWA Login Password</p>
                  <p className="text-[11px] text-gray-400 mb-2">Create a new password for distributor PWA access</p>
                  <input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs mb-2"
                  />
                  <button onClick={handleResetPassword} className="w-full py-2 rounded-lg border border-teal-200 text-teal-600 text-xs font-medium flex items-center justify-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                    Reset Password
                  </button>
                  {resetMsg && <p className="text-[10px] text-green-600 mt-2">{resetMsg}</p>}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400 py-6 text-center">Click a pin on the map to see distributor details.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {zones.map((z) => {
          const zoneDistributors = distributors.filter((d) => d.zone?._id === z._id);
          return (
            <div key={z._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{z.name}</p>
                  <p className="text-xs text-gray-400">{zoneDistributors.length} distributor(s)</p>
                  {zoneDistributors.slice(0, 2).map((d) => (
                    <p key={d._id} className="text-xs text-gray-500">• {d.name} ({d.employeeId})</p>
                  ))}
                </div>
              </div>
              <button onClick={() => navigate("/distributor-admin/all")} className="text-xs text-teal-600 font-medium whitespace-nowrap flex items-center gap-1">
                View All
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
          );
        })}
      </div>
    </DistributorAdminLayout>
  );
}