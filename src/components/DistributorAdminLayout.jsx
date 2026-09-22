// FILE: src/components/DistributorAdminLayout.jsx
// NEW FILE — Feature: two Admin Dashboard login types. Replaces
// DistributorPageLayout.jsx (which you can now delete — see chat notes)
// for every page inside the new, fully separate Distributor Admin
// dashboard. Combines DistributorAdminSidebar + DistributorAdminTopBar.
import DistributorAdminSidebar from "./DistributorAdminSidebar";
import DistributorAdminTopBar from "./DistributorAdminTopBar";

export default function DistributorAdminLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DistributorAdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DistributorAdminTopBar title={title} subtitle={subtitle} />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}