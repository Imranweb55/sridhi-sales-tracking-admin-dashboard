// // FILE: src/components/GradientStatCard.jsx
// // NEW FILE — UI-ONLY component (no API/logic). Shared gradient stat card
// // used across the 4 Distributors pages to exactly match the reference
// // design (soft gradient background, icon circle, decorative watermark
// // icon on the right, small trend/subtext line at the bottom).
// const THEMES = {
//   blue:   { bg: "from-blue-50 to-blue-100/60",     iconBg: "bg-blue-600",   text: "text-blue-600",   sub: "text-blue-500" },
//   green:  { bg: "from-green-50 to-green-100/60",   iconBg: "bg-green-500",  text: "text-green-600",  sub: "text-green-600" },
//   purple: { bg: "from-purple-50 to-purple-100/60", iconBg: "bg-purple-600", text: "text-purple-600", sub: "text-purple-500" },
//   orange: { bg: "from-orange-50 to-orange-100/60", iconBg: "bg-orange-500", text: "text-orange-600", sub: "text-orange-500" },
//   pink:   { bg: "from-pink-50 to-pink-100/60",     iconBg: "bg-pink-500",   text: "text-pink-600",   sub: "text-pink-500" },
// };

// export default function GradientStatCard({ icon, label, value, subtext, color = "blue", watermark }) {
//   const t = THEMES[color] || THEMES.blue;
//   return (
//     <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${t.bg} p-5 border border-white`}>
//       {/* decorative watermark icon, bottom-right, matches reference cards */}
//       {watermark && (
//         <svg className={`absolute -bottom-2 -right-2 w-20 h-20 opacity-10 ${t.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d={watermark} />
//         </svg>
//       )}
//       <div className="relative flex items-center gap-3 mb-3">
//         <div className={`w-10 h-10 rounded-xl ${t.iconBg} text-white flex items-center justify-center flex-shrink-0`}>
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
//           </svg>
//         </div>
//         <p className="text-sm font-medium text-gray-600">{label}</p>
//       </div>
//       <p className="relative text-3xl font-bold text-gray-800">{value}</p>
//       {subtext && <p className={`relative text-xs mt-1 ${t.sub}`}>{subtext}</p>}
//     </div>
//   );
// }


// FILE: src/components/GradientStatCard.jsx
// NEW FILE — UI-ONLY component (no API/logic). Shared gradient stat card
// used across the 4 Distributors pages to exactly match the reference
// design (soft gradient background, icon circle, decorative watermark
// icon on the right, small trend/subtext line at the bottom).
const THEMES = {
  blue:   { bg: "from-blue-50 to-blue-100/60",     iconBg: "bg-blue-600",   text: "text-blue-600",   sub: "text-blue-500" },
  green:  { bg: "from-green-50 to-green-100/60",   iconBg: "bg-green-500",  text: "text-green-600",  sub: "text-green-600" },
  purple: { bg: "from-purple-50 to-purple-100/60", iconBg: "bg-purple-600", text: "text-purple-600", sub: "text-purple-500" },
  orange: { bg: "from-orange-50 to-orange-100/60", iconBg: "bg-orange-500", text: "text-orange-600", sub: "text-orange-500" },
  pink:   { bg: "from-pink-50 to-pink-100/60",     iconBg: "bg-pink-500",   text: "text-pink-600",   sub: "text-pink-500" },
  // NEW (additive) — Feature: two Admin Dashboard login types. Teal
  // theme used only by the new premium Distributor Admin dashboard.
  teal:   { bg: "from-teal-50 to-teal-100/60",     iconBg: "bg-teal-600",   text: "text-teal-600",   sub: "text-teal-600" },
};

export default function GradientStatCard({ icon, label, value, subtext, color = "blue", watermark }) {
  const t = THEMES[color] || THEMES.blue;
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${t.bg} p-5 border border-white`}>
      {/* decorative watermark icon, bottom-right, matches reference cards */}
      {watermark && (
        <svg className={`absolute -bottom-2 -right-2 w-20 h-20 opacity-10 ${t.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d={watermark} />
        </svg>
      )}
      <div className="relative flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl ${t.iconBg} text-white flex items-center justify-center flex-shrink-0`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
      </div>
      <p className="relative text-3xl font-bold text-gray-800">{value}</p>
      {subtext && <p className={`relative text-xs mt-1 ${t.sub}`}>{subtext}</p>}
    </div>
  );
}