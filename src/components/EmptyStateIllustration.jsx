// FILE: src/components/EmptyStateIllustration.jsx
// NEW FILE — UI-ONLY. Reusable empty-state block (soft blue blob +
// icon + sparkle accents) used by the Distributors pages to match the
// reference design's "No customers assigned yet" / "No requests for
// this filter today" empty states.
export default function EmptyStateIllustration({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-4">
      <div className="relative w-28 h-28 mb-5">
        <div className="absolute inset-0 bg-blue-50 rounded-full" />
        <svg className="absolute top-2 left-2 w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l1.4 4.6L18 8l-4.6 1.4L12 14l-1.4-4.6L6 8l4.6-1.4z"/></svg>
        <svg className="absolute bottom-3 right-1 w-4 h-4 text-purple-200" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l1.4 4.6L18 8l-4.6 1.4L12 14l-1.4-4.6L6 8l4.6-1.4z"/></svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
            </svg>
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
          </div>
        </div>
      </div>
      <p className="font-semibold text-gray-700 text-sm mb-1">{title}</p>
      <p className="text-xs text-gray-400 max-w-xs mb-4">{description}</p>
      {action}
    </div>
  );
}