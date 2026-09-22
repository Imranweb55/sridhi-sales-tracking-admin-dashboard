// FILE: src/pages/distributor-admin/AddDistributorPage.jsx
// NEW FILE — Feature: Distributors module — "Add Distributor" tab
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import { createDistributor } from "../../api/distributorApi";
import { getZones, createZone } from "../../api/distributorApi";

export default function AddDistributorPage() {
  const navigate = useNavigate();
  const [zones, setZones] = useState([]);
  const [showNewZone, setShowNewZone] = useState(false);
  const [newZone, setNewZone] = useState({ name: "", latitude: "", longitude: "" });

  const [form, setForm] = useState({
    name: "", phone: "", address: "", zone: "",
    fridgeLatitude: "", fridgeLongitude: "", fridgeAddress: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(null); // { employeeId, password }

  const loadZones = () => getZones().then((data) => setZones(data.zones || []));
  useEffect(() => { loadZones(); }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleCreateZone = async () => {
    if (!newZone.name || !newZone.latitude || !newZone.longitude) {
      alert("Zone name, latitude and longitude are required.");
      return;
    }
    const data = await createZone(newZone);
    await loadZones();
    setForm((f) => ({ ...f, zone: data.zone._id }));
    setShowNewZone(false);
    setNewZone({ name: "", latitude: "", longitude: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.phone) { setError("Name and phone are required."); return; }
    setSaving(true);
    try {
      const data = await createDistributor(form);
      setCreated(data.loginCredentials);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create distributor.");
    } finally {
      setSaving(false);
    }
  };

  if (created) {
    return (
      <AdminLayout title="Add Distributor">
        <div className="max-w-lg mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Distributor created</h2>
          <p className="text-sm text-gray-500 mb-6">
            Share these login details with the distributor for the Distributors-PWA-App. This password is shown only once.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 text-left mb-6">
            <p className="text-xs text-gray-400 mb-1">Employee ID</p>
            <p className="font-mono text-lg font-semibold text-gray-800 mb-3">{created.employeeId}</p>
            <p className="text-xs text-gray-400 mb-1">Password</p>
            <p className="font-mono text-lg font-semibold text-gray-800">{created.password}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setCreated(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium">Add Another</button>
            <button onClick={() => navigate("/distributor-admin/all")} className="flex-1 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-medium">Go to All Distributors</button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Add Distributor">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-xl">{error}</div>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500">Distributor Name *</label>
            <input value={form.name} onChange={(e) => set("name", e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Phone *</label>
            <input value={form.phone} onChange={(e) => set("phone", e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500">Address</label>
          <input value={form.address} onChange={(e) => set("address", e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500">Zone (Chennai area)</label>
          <div className="flex gap-2 mt-1">
            <select value={form.zone} onChange={(e) => set("zone", e.target.value)} className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option value="">— Select zone —</option>
              {zones.map((z) => <option key={z._id} value={z._id}>{z.name}</option>)}
            </select>
            <button type="button" onClick={() => setShowNewZone((s) => !s)} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-teal-600 font-medium whitespace-nowrap">
              + New Zone
            </button>
          </div>
          {showNewZone && (
            <div className="mt-2 grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-xl">
              <input placeholder="Zone name" value={newZone.name} onChange={(e) => setNewZone((z) => ({ ...z, name: e.target.value }))} className="px-3 py-2 rounded-lg border border-gray-200 text-sm" />
              <input placeholder="Latitude" value={newZone.latitude} onChange={(e) => setNewZone((z) => ({ ...z, latitude: e.target.value }))} className="px-3 py-2 rounded-lg border border-gray-200 text-sm" />
              <input placeholder="Longitude" value={newZone.longitude} onChange={(e) => setNewZone((z) => ({ ...z, longitude: e.target.value }))} className="px-3 py-2 rounded-lg border border-gray-200 text-sm" />
              <button type="button" onClick={handleCreateZone} className="col-span-3 px-3 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium">Save Zone</button>
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">Fridge / Godown Location (shown on Distributors Map)</p>
          <div className="grid grid-cols-3 gap-3">
            <input placeholder="Latitude" value={form.fridgeLatitude} onChange={(e) => set("fridgeLatitude", e.target.value)} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm" />
            <input placeholder="Longitude" value={form.fridgeLongitude} onChange={(e) => set("fridgeLongitude", e.target.value)} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm" />
            <input placeholder="Address label" value={form.fridgeAddress} onChange={(e) => set("fridgeAddress", e.target.value)} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm" />
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Tip: right-click a spot on Google Maps to copy its lat/lng.</p>
        </div>

        <button type="submit" disabled={saving} className="w-full py-3 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 disabled:opacity-60">
          {saving ? "Creating…" : "Create Distributor & Generate Login"}
        </button>
      </form>
    </AdminLayout>
  );
}