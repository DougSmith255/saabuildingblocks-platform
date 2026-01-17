'use client';

import { useState } from 'react';

export default function IconTestPage() {
  const [selectedPack, setSelectedPack] = useState<string | null>(null);

  const iconPacks = [
    {
      name: "Lucide Icons",
      description: "Beautiful & consistent open-source icons. Modern, clean, and well-designed.",
      npm: "lucide-react",
      sampleIcons: ["Video", "Users", "GraduationCap", "Calendar", "PhoneCall", "MessageCircle", "Star", "Trophy", "Rocket", "Sparkles"],
      colors: ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"],
      website: "https://lucide.dev",
      preview: "https://lucide.dev/icons/video"
    },
    {
      name: "Tabler Icons",
      description: "Over 4500+ MIT licensed SVG icons. Colorful and highly customizable.",
      npm: "@tabler/icons-react",
      sampleIcons: ["IconVideo", "IconUsers", "IconSchool", "IconCalendar", "IconPhone", "IconMessage", "IconStar", "IconTrophy", "IconRocket", "IconSparkles"],
      colors: ["#0ea5e9", "#f43f5e", "#f59e0b", "#22c55e", "#a855f7"],
      website: "https://tabler-icons.io"
    },
    {
      name: "Phosphor Icons",
      description: "Flexible icon family. 6 weights available. Perfect for colorful UIs.",
      npm: "@phosphor-icons/react",
      sampleIcons: ["VideoCamera", "UsersThree", "GraduationCap", "Calendar", "PhoneCall", "ChatCircle", "Star", "Trophy", "Rocket", "Sparkle"],
      colors: ["#3b82f6", "#ec4899", "#eab308", "#10b981", "#8b5cf6"],
      website: "https://phosphoricons.com"
    },
    {
      name: "Remix Icon",
      description: "Neutral-style system symbols. 2700+ icons. Very comprehensive.",
      npm: "remixicon-react",
      sampleIcons: ["VideoLine", "TeamLine", "GraduationCapLine", "CalendarLine", "PhoneLine", "Message2Line", "StarLine", "TrophyLine", "RocketLine", "SparklingLine"],
      colors: ["#2563eb", "#db2777", "#d97706", "#059669", "#7c3aed"],
      website: "https://remixicon.com"
    },
    {
      name: "Iconoir",
      description: "High-quality stroke-based icons. 1400+ SVG icons. Beautiful and consistent.",
      npm: "iconoir-react",
      sampleIcons: ["VideoCamera", "Community", "GraduationCap", "Calendar", "Phone", "ChatBubble", "Star", "Trophy", "Rocket", "Sparkles"],
      colors: ["#3b82f6", "#f472b6", "#fbbf24", "#34d399", "#a78bfa"],
      website: "https://iconoir.com"
    },
    {
      name: "Heroicons",
      description: "Beautiful hand-crafted SVG icons by Tailwind CSS makers.",
      npm: "@heroicons/react",
      sampleIcons: ["VideoCameraIcon", "UserGroupIcon", "AcademicCapIcon", "CalendarIcon", "PhoneIcon", "ChatBubbleLeftRightIcon", "StarIcon", "TrophyIcon", "RocketLaunchIcon", "SparklesIcon"],
      colors: ["#3b82f6", "#ec4899", "#f59e0b", "#10b981", "#8b5cf6"],
      website: "https://heroicons.com"
    },
    {
      name: "Feather Icons",
      description: "Simply beautiful open source icons. Minimalist and consistent.",
      npm: "react-feather",
      sampleIcons: ["Video", "Users", "BookOpen", "Calendar", "Phone", "MessageCircle", "Star", "Award", "Zap", "Sun"],
      colors: ["#0ea5e9", "#f43f5e", "#f59e0b", "#22c55e", "#a855f7"],
      website: "https://feathericons.com"
    },
    {
      name: "Bootstrap Icons",
      description: "Official SVG icon library for Bootstrap. 1800+ icons.",
      npm: "react-bootstrap-icons",
      sampleIcons: ["CameraVideo", "People", "Mortarboard", "Calendar3", "Telephone", "ChatDots", "Star", "Trophy", "RocketTakeoff", "Stars"],
      colors: ["#0d6efd", "#d63384", "#fd7e14", "#198754", "#6610f2"],
      website: "https://icons.getbootstrap.com"
    },
    {
      name: "Akar Icons",
      description: "Perfectly rounded icon library. Clean and modern.",
      npm: "akar-icons",
      sampleIcons: ["Video", "PeopleGroup", "BookOpen", "Calendar", "Phone", "ChatBubble", "Star", "Trophy", "Rocket", "Sparkle"],
      colors: ["#3b82f6", "#ec4899", "#f59e0b", "#10b981", "#8b5cf6"],
      website: "https://akaricons.com"
    },
    {
      name: "Majesticons",
      description: "400+ beautiful hand-crafted SVG icons. Line & solid styles.",
      npm: "majesticons-react",
      sampleIcons: ["VideoCamera", "Users", "AcademicCap", "Calendar", "Phone", "Messages", "Star", "Trophy", "Rocket", "Sparkles"],
      colors: ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#8b5cf6"],
      website: "https://www.majesticons.com"
    },
    {
      name: "Ionicons",
      description: "Premium icons for Ionic Framework. Clean and modern.",
      npm: "ionicons",
      sampleIcons: ["videocam", "people", "school", "calendar", "call", "chatbubbles", "star", "trophy", "rocket", "sparkles"],
      colors: ["#3880ff", "#eb445a", "#ffc409", "#2dd36f", "#5260ff"],
      website: "https://ionic.io/ionicons"
    },
    {
      name: "Carbon Icons",
      description: "IBM's professional icon library. Comprehensive and polished.",
      npm: "@carbon/icons-react",
      sampleIcons: ["Video", "UserMultiple", "Education", "Calendar", "Phone", "Chat", "Star", "Trophy", "Rocket", "RainDrop"],
      colors: ["#0f62fe", "#d12771", "#ff832b", "#24a148", "#8a3ffc"],
      website: "https://carbondesignsystem.com/guidelines/icons/library"
    },
    {
      name: "Teenyicons",
      description: "Tiny minimal 1px icons. Super clean and lightweight.",
      npm: "teenyicons-react",
      sampleIcons: ["video", "users", "book-open", "calendar", "phone", "message-text", "star", "trophy", "rocket", "sparkles"],
      colors: ["#3b82f6", "#ec4899", "#f59e0b", "#10b981", "#a855f7"],
      website: "https://teenyicons.com"
    },
    {
      name: "Radix Icons",
      description: "Crisp 15×15 icons designed by Modulz. Perfect for UI.",
      npm: "@radix-ui/react-icons",
      sampleIcons: ["VideoIcon", "PersonIcon", "ReaderIcon", "CalendarIcon", "MobileIcon", "ChatBubbleIcon", "StarIcon", "ComponentInstanceIcon", "RocketIcon", "DotFilledIcon"],
      colors: ["#3b82f6", "#ec4899", "#f59e0b", "#10b981", "#8b5cf6"],
      website: "https://www.radix-ui.com/icons"
    },
    {
      name: "Solar Icons",
      description: "1000+ outline, bold, and bulk icons. Modern and trendy.",
      npm: "solar-icon-set",
      sampleIcons: ["video-library", "users-group-rounded", "diploma", "calendar", "phone-calling", "chat-round-dots", "star", "cup-star", "rocket-2", "stars"],
      colors: ["#6366f1", "#f43f5e", "#f59e0b", "#10b981", "#8b5cf6"],
      website: "https://www.figma.com/community/file/1166831539721848736"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-taskor">
            Icon Pack Showcase
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-3xl mx-auto">
            15 modern, colorful, flat icon packs for Team Calls, Elite Courses & more
            <br />
            <span className="text-sm">Click any pack to see details & installation instructions</span>
          </p>
        </div>

        {/* Grid of Icon Packs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {iconPacks.map((pack, packIdx) => (
            <div
              key={pack.name}
              onClick={() => setSelectedPack(selectedPack === pack.name ? null : pack.name)}
              className={`
                relative rounded-2xl border p-4 sm:p-6 cursor-pointer transition-all duration-300
                ${selectedPack === pack.name
                  ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/50 shadow-2xl shadow-blue-500/20 scale-[1.02]'
                  : 'bg-[#1a1a1a]/50 border-white/10 hover:border-white/20 hover:bg-[#1a1a1a]/70'
                }
              `}
            >
              {/* Pack Name */}
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg sm:text-xl font-bold pr-2">
                  {pack.name}
                </h3>
                {selectedPack === pack.name && (
                  <span className="text-[10px] bg-blue-500 px-2 py-1 rounded-full whitespace-nowrap">
                    Selected
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-400 mb-4 line-clamp-2">
                {pack.description}
              </p>

              {/* Icon Grid with Colors */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                {pack.sampleIcons.slice(0, 10).map((icon, idx) => {
                  const color = pack.colors[idx % pack.colors.length];
                  return (
                    <div
                      key={idx}
                      className="aspect-square rounded-lg p-2 flex items-center justify-center transition-all hover:scale-110"
                      style={{
                        backgroundColor: `${color}15`,
                        border: `1px solid ${color}40`
                      }}
                      title={icon}
                    >
                      <div className="w-full h-full" style={{ color }}>
                        {/* Icon placeholder with different shapes */}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          {idx === 0 && <><rect x="2" y="2" width="20" height="20" rx="2.18" /><line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" /><line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="17" x2="22" y2="17" /><line x1="17" y1="7" x2="22" y2="7" /></>}
                          {idx === 1 && <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>}
                          {idx === 2 && <><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></>}
                          {idx === 3 && <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>}
                          {idx === 4 && <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></>}
                          {idx === 5 && <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></>}
                          {idx === 6 && <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></>}
                          {idx === 7 && <><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></>}
                          {idx === 8 && <><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></>}
                          {idx === 9 && <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></>}
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Color Palette */}
              <div className="flex gap-1 mb-3">
                {pack.colors.map((color, idx) => (
                  <div
                    key={idx}
                    className="flex-1 h-2 rounded-full transition-all hover:h-3"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-2 text-xs">
                <a
                  href={pack.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 text-center py-2 px-3 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 transition-colors"
                >
                  Website →
                </a>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(`npm install ${pack.npm}`);
                    alert('Copied to clipboard!');
                  }}
                  className="flex-1 py-2 px-3 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30 transition-colors"
                >
                  Copy Install
                </button>
              </div>

              {/* Expanded Details */}
              {selectedPack === pack.name && (
                <div className="mt-4 pt-4 border-t border-white/10 animate-in slide-in-from-top duration-300">
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-slate-400 mb-2">Installation:</div>
                      <code className="block text-xs bg-black/30 p-3 rounded-lg text-green-400 border border-white/10 font-mono">
                        npm install {pack.npm}
                      </code>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-400 mb-2">Icon Names:</div>
                      <div className="text-[10px] text-slate-500 grid grid-cols-2 gap-1 max-h-32 overflow-y-auto">
                        {pack.sampleIcons.map((icon, idx) => (
                          <div key={idx} className="truncate">• {icon}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Recommendations */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            Top Recommendations
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="font-semibold text-white">🎨 Most Colorful & Modern:</div>
              <ul className="space-y-1 text-slate-300">
                <li>• <strong className="text-blue-400">Phosphor Icons</strong> - 6 weights, super versatile</li>
                <li>• <strong className="text-purple-400">Tabler Icons</strong> - 4500+ icons, huge variety</li>
                <li>• <strong className="text-pink-400">Solar Icons</strong> - Trendy bulk/outline styles</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="font-semibold text-white">✨ Best for Team Calls/Courses:</div>
              <ul className="space-y-1 text-slate-300">
                <li>• <strong className="text-green-400">Lucide</strong> - Clean, consistent, popular</li>
                <li>• <strong className="text-yellow-400">Iconoir</strong> - Professional stroke design</li>
                <li>• <strong className="text-red-400">Heroicons</strong> - Tailwind team quality</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-8 text-center text-sm text-slate-500">
          All icon packs are MIT licensed and free to use. Click any pack for installation details.
        </div>
      </div>
    </div>
  );
}
