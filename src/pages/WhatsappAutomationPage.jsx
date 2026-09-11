// FILE: src/pages/WhatsappAutomationPage.jsx
// NEW FILE — Feature: WhatsApp Automation
// Lets the admin trigger the local WhatsApp-sending agent (running on the
// office PC) with one click, and watch live status + history. The actual
// mouse/keyboard automation runs locally via whatsapp_agent.py — this page
// only queues the job on the backend and shows what the agent reports back.
import { useState, useEffect, useRef } from "react";
import AdminLayout from "../components/AdminLayout";
import {
  getSendPreview,
  startWhatsappAutomation,
  getLatestWhatsappRun,
  getWhatsappRunHistory,
} from "../api/whatsappApi";

const todayIST = () => new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);

const STATUS_BADGE = {
  queued:  "bg-blue-100 text-blue-700",
  running: "bg-blue-100 text-blue-700",
  success: "bg-green-100 text-green-700",
  failed:  "bg-red-100 text-red-600",
};

export default function WhatsappAutomationPage() {
  const [preview, setPreview]   = useState(null);
  const [latest, setLatest]     = useState(null);
  const [history, setHistory]   = useState([]);
  const [starting, setStarting] = useState(false);
  const [banner, setBanner]     = useState(null);
  const pollRef = useRef(null);

  const loadPreview = () => getSendPreview(todayIST()).then(setPreview).catch(() => {});
  const loadHistory = () => getWhatsappRunHistory().then(setHistory).catch(() => {});
  const loadLatest  = () => getLatestWhatsappRun().then(setLatest).catch(() => {});

  useEffect(() => {
    loadPreview();
    loadLatest();
    loadHistory();
  }, []);

  useEffect(() => {
    if (latest && (latest.status === "queued" || latest.status === "running")) {
      pollRef.current = setTimeout(() => { loadLatest(); loadHistory(); }, 4000);
      return () => clearTimeout(pollRef.current);
    }
  }, [latest]);

  const handleStart = async () => {
    setStarting(true);
    setBanner(null);
    try {
      const run = await startWhatsappAutomation(todayIST());
      setLatest(run);
      setBanner({ type: "info", text: "Job queued. Waiting for the local sender on your PC to pick it up..." });
      loadHistory();
    } catch (e) {
      setBanner({ type: "warning", text: e.response?.data?.message || "Could not start automation." });
    } finally {
      setStarting(false);
    }
  };

  const isBusy = latest && (latest.status === "queued" || latest.status === "running");

  return (
    <AdminLayout title="WhatsApp Automation">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">WhatsApp Automation</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Send today's generated invoices to their WhatsApp groups automatically. The local sender
          running on your PC picks up the job and does the sending — keep that PC on and WhatsApp Web logged in.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Card 1 — Start Automation */}
        <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
          <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center mb-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </div>
          <p className="text-sm font-bold text-gray-900 mb-1">Send Today's PDFs</p>
          <p className="text-xs text-gray-500 mb-4">
            {preview ? `${preview.count} invoice${preview.count === 1 ? "" : "s"} ready to send today.` : "Loading..."}
          </p>
          <button
            onClick={handleStart}
            disabled={starting || isBusy || !preview?.count}
            className="w-full py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 transition"
          >
            {isBusy ? "Running..." : starting ? "Starting..." : "Start Automation"}
          </button>
        </div>

        {/* Card 2 — View Logs */}
        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mb-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <p className="text-sm font-bold text-gray-900 mb-1">View Logs</p>
          <p className="text-xs text-gray-500 mb-4">Check the latest sending logs, status and history.</p>
          <a href="#history" className="block text-center w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition">
            Jump to Logs
          </a>
        </div>

        {/* Card 3 — Manage Groups */}
        <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
          <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center mb-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <p className="text-sm font-bold text-gray-900 mb-1">Manage Groups</p>
          <p className="text-xs text-gray-500 mb-4">WhatsApp group names are set per customer in the Customers tab.</p>
          <a href="/customers" className="block text-center w-full py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700 transition">
            Open Customers
          </a>
        </div>
      </div>

      {banner && (
        <div className={`rounded-2xl px-4 py-3 mb-5 text-sm ${
          banner.type === "info"
            ? "bg-blue-50 text-blue-700 border border-blue-100"
            : "bg-amber-50 text-amber-700 border border-amber-100"
        }`}>
          {banner.text}
        </div>
      )}

      <div id="history" className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-700">Recent Activity</p>
        </div>
        <div className="hidden sm:grid grid-cols-12 gap-2 px-5 py-3 border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase">
          <div className="col-span-3">Time</div>
          <div className="col-span-3">Business Date</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-4">Details</div>
        </div>
        {history.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-400">No runs yet. Click "Start Automation" to begin.</div>
        ) : history.map(run => (
          <div key={run._id} className="grid grid-cols-2 sm:grid-cols-12 gap-2 px-5 py-3 border-b border-gray-50 last:border-0 items-center">
            <div className="col-span-2 sm:col-span-3 text-xs text-gray-600">
              {new Date(run.createdAt).toLocaleString("en-IN")}
            </div>
            <div className="col-span-2 sm:col-span-3 text-xs text-gray-600">{run.businessDate}</div>
            <div className="sm:col-span-2">
              <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${STATUS_BADGE[run.status] || "bg-gray-100 text-gray-500"}`}>
                {run.status}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-4 text-xs text-gray-500">
              {run.message || (run.status === "success" ? `Sent ${run.sentCount}, skipped ${run.skippedCount}` : "")}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}