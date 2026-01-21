'use client';

import { useState } from 'react';

// Lucide Icons - Primary pack
import {
  Video, Users, GraduationCap, Calendar, PhoneCall,
  MessageCircle, Star, Trophy, Rocket, Sparkles,
  Home, Mail, Settings, Search, Heart
} from 'lucide-react';

// Heroicons - Tailwind's official icons
import {
  VideoCameraIcon, UserGroupIcon, AcademicCapIcon, CalendarIcon,
  PhoneIcon, ChatBubbleLeftRightIcon, StarIcon, TrophyIcon,
  RocketLaunchIcon, SparklesIcon, HomeIcon, EnvelopeIcon,
  Cog6ToothIcon, MagnifyingGlassIcon, HeartIcon
} from '@heroicons/react/24/outline';

// React Icons - Multiple verified packs
import {
  FaVideo, FaUsers, FaGraduationCap, FaCalendarAlt, FaPhoneAlt,
  FaComments, FaStar, FaTrophy, FaRocket, FaMagic,
  FaHome, FaEnvelope, FaCog, FaSearch, FaHeart
} from 'react-icons/fa';

import {
  IoVideocam, IoPeople, IoSchool, IoCalendar, IoCall,
  IoChatbubbles, IoStar, IoTrophy, IoRocket, IoSparkles,
  IoHome, IoMail, IoSettings, IoSearch, IoHeart
} from 'react-icons/io5';

import {
  BiVideo, BiGroup, BiBookOpen, BiCalendar, BiPhone,
  BiMessageRounded, BiStar, BiTrophy, BiRocket, BiSun,
  BiHome, BiEnvelope, BiCog, BiSearch, BiHeart
} from 'react-icons/bi';

import {
  HiOutlineVideoCamera, HiOutlineUserGroup, HiOutlineAcademicCap,
  HiOutlineCalendar, HiOutlinePhone, HiOutlineChatBubbleLeftRight,
  HiOutlineStar, HiOutlineTrophy, HiOutlineRocketLaunch, HiOutlineSparkles,
  HiOutlineHome, HiOutlineEnvelope, HiOutlineCog6Tooth, HiOutlineMagnifyingGlass, HiOutlineHeart
} from 'react-icons/hi2';

import {
  TbVideo, TbUsers, TbSchool, TbCalendar, TbPhone,
  TbMessage, TbStar, TbTrophy, TbRocket, TbSparkles,
  TbHome, TbMail, TbSettings, TbSearch, TbHeart
} from 'react-icons/tb';

import {
  PiVideo, PiUsers, PiGraduationCap, PiCalendar, PiPhone,
  PiChatCircle, PiStar, PiTrophy, PiRocket, PiSparkle,
  PiHouse, PiEnvelope, PiGear, PiMagnifyingGlass, PiHeart
} from 'react-icons/pi';

import {
  RiVideoLine, RiTeamLine, RiGraduationCapLine, RiCalendarLine, RiPhoneLine,
  RiChat1Line, RiStarLine, RiTrophyLine, RiRocketLine, RiSparklingLine,
  RiHome4Line, RiMailLine, RiSettings3Line, RiSearchLine, RiHeartLine
} from 'react-icons/ri';

export default function IconTestPage() {
  const [selectedPack, setSelectedPack] = useState<string | null>(null);

  const iconPacks = [
    {
      name: "Lucide Icons",
      description: "Beautiful & consistent open-source icons. Modern, clean, and well-designed. 1000+ icons.",
      npm: "lucide-react",
      icons: [Video, Users, GraduationCap, Calendar, PhoneCall, MessageCircle, Star, Trophy, Rocket, Sparkles, Home, Mail, Settings, Search, Heart],
      colors: ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"],
      website: "https://lucide.dev"
    },
    {
      name: "Heroicons",
      description: "Beautiful hand-crafted SVG icons by the makers of Tailwind CSS. Outline & solid styles.",
      npm: "@heroicons/react",
      icons: [VideoCameraIcon, UserGroupIcon, AcademicCapIcon, CalendarIcon, PhoneIcon, ChatBubbleLeftRightIcon, StarIcon, TrophyIcon, RocketLaunchIcon, SparklesIcon, HomeIcon, EnvelopeIcon, Cog6ToothIcon, MagnifyingGlassIcon, HeartIcon],
      colors: ["#3b82f6", "#ec4899", "#f59e0b", "#10b981", "#8b5cf6"],
      website: "https://heroicons.com"
    },
    {
      name: "Font Awesome",
      description: "The iconic SVG, font, and CSS toolkit. 7000+ icons. Industry standard.",
      npm: "react-icons/fa",
      icons: [FaVideo, FaUsers, FaGraduationCap, FaCalendarAlt, FaPhoneAlt, FaComments, FaStar, FaTrophy, FaRocket, FaMagic, FaHome, FaEnvelope, FaCog, FaSearch, FaHeart],
      colors: ["#339af0", "#f06595", "#fcc419", "#51cf66", "#845ef7"],
      website: "https://fontawesome.com"
    },
    {
      name: "Ionicons",
      description: "Premium icons for Ionic Framework. Clean and modern. Great for mobile UIs.",
      npm: "react-icons/io5",
      icons: [IoVideocam, IoPeople, IoSchool, IoCalendar, IoCall, IoChatbubbles, IoStar, IoTrophy, IoRocket, IoSparkles, IoHome, IoMail, IoSettings, IoSearch, IoHeart],
      colors: ["#3880ff", "#eb445a", "#ffc409", "#2dd36f", "#5260ff"],
      website: "https://ionic.io/ionicons"
    },
    {
      name: "BoxIcons",
      description: "Simple vector icons carefully crafted for designers & developers. Regular & solid.",
      npm: "react-icons/bi",
      icons: [BiVideo, BiGroup, BiBookOpen, BiCalendar, BiPhone, BiMessageRounded, BiStar, BiTrophy, BiRocket, BiSun, BiHome, BiEnvelope, BiCog, BiSearch, BiHeart],
      colors: ["#0ea5e9", "#f43f5e", "#f59e0b", "#22c55e", "#a855f7"],
      website: "https://boxicons.com"
    },
    {
      name: "Heroicons v2 (Outline)",
      description: "Updated Heroicons with more icons and improved styles. Outline variant.",
      npm: "react-icons/hi2",
      icons: [HiOutlineVideoCamera, HiOutlineUserGroup, HiOutlineAcademicCap, HiOutlineCalendar, HiOutlinePhone, HiOutlineChatBubbleLeftRight, HiOutlineStar, HiOutlineTrophy, HiOutlineRocketLaunch, HiOutlineSparkles, HiOutlineHome, HiOutlineEnvelope, HiOutlineCog6Tooth, HiOutlineMagnifyingGlass, HiOutlineHeart],
      colors: ["#3b82f6", "#ec4899", "#f59e0b", "#10b981", "#8b5cf6"],
      website: "https://heroicons.com"
    },
    {
      name: "Tabler Icons",
      description: "Over 4500+ MIT licensed SVG icons. Highly customizable stroke width.",
      npm: "react-icons/tb",
      icons: [TbVideo, TbUsers, TbSchool, TbCalendar, TbPhone, TbMessage, TbStar, TbTrophy, TbRocket, TbSparkles, TbHome, TbMail, TbSettings, TbSearch, TbHeart],
      colors: ["#0ea5e9", "#f43f5e", "#f59e0b", "#22c55e", "#a855f7"],
      website: "https://tabler-icons.io"
    },
    {
      name: "Phosphor Icons",
      description: "Flexible icon family with 6 weights. Regular, thin, light, bold, fill, duotone.",
      npm: "react-icons/pi",
      icons: [PiVideo, PiUsers, PiGraduationCap, PiCalendar, PiPhone, PiChatCircle, PiStar, PiTrophy, PiRocket, PiSparkle, PiHouse, PiEnvelope, PiGear, PiMagnifyingGlass, PiHeart],
      colors: ["#3b82f6", "#ec4899", "#eab308", "#10b981", "#8b5cf6"],
      website: "https://phosphoricons.com"
    },
    {
      name: "Remix Icons",
      description: "Neutral-style system symbols. 2700+ icons. Line and fill variants.",
      npm: "react-icons/ri",
      icons: [RiVideoLine, RiTeamLine, RiGraduationCapLine, RiCalendarLine, RiPhoneLine, RiChat1Line, RiStarLine, RiTrophyLine, RiRocketLine, RiSparklingLine, RiHome4Line, RiMailLine, RiSettings3Line, RiSearchLine, RiHeartLine],
      colors: ["#2563eb", "#db2777", "#d97706", "#059669", "#7c3aed"],
      website: "https://remixicon.com"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Icon Pack Showcase
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-3xl mx-auto">
            {iconPacks.length} modern, colorful icon packs with real icons rendered from actual libraries
            <br />
            <span className="text-sm">Click any pack to see details & installation instructions</span>
          </p>
        </div>

        {/* Grid of Icon Packs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {iconPacks.map((pack) => (
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

              {/* Actual Icon Grid with Colors */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                {pack.icons.slice(0, 15).map((IconComponent, idx) => {
                  const color = pack.colors[idx % pack.colors.length];
                  return (
                    <div
                      key={idx}
                      className="aspect-square rounded-lg p-2 flex items-center justify-center transition-all hover:scale-110"
                      style={{
                        backgroundColor: `${color}15`,
                        border: `1px solid ${color}40`
                      }}
                    >
                      <IconComponent
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        style={{ color }}
                      />
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
                  Website
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
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-slate-400 mb-2">Installation:</div>
                      <code className="block text-xs bg-black/30 p-3 rounded-lg text-green-400 border border-white/10 font-mono">
                        npm install {pack.npm}
                      </code>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-400 mb-2">Usage Example:</div>
                      <code className="block text-xs bg-black/30 p-3 rounded-lg text-blue-400 border border-white/10 font-mono overflow-x-auto">
                        {pack.npm.includes('react-icons')
                          ? `import { IconName } from '${pack.npm}';`
                          : `import { IconName } from '${pack.npm}';`
                        }
                      </code>
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
            <Star className="w-6 h-6 text-yellow-400" />
            Top Recommendations
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                Most Colorful & Modern:
              </div>
              <ul className="space-y-1 text-slate-300">
                <li className="flex items-center gap-2">
                  <PiStar className="w-4 h-4 text-blue-400" />
                  <strong className="text-blue-400">Phosphor Icons</strong> - 6 weights, super versatile
                </li>
                <li className="flex items-center gap-2">
                  <TbStar className="w-4 h-4 text-purple-400" />
                  <strong className="text-purple-400">Tabler Icons</strong> - 4500+ icons, huge variety
                </li>
                <li className="flex items-center gap-2">
                  <RiStarLine className="w-4 h-4 text-pink-400" />
                  <strong className="text-pink-400">Remix Icons</strong> - Trendy outline styles
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="font-semibold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                Best for Team Calls/Courses:
              </div>
              <ul className="space-y-1 text-slate-300">
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-green-400" />
                  <strong className="text-green-400">Lucide</strong> - Clean, consistent, popular
                </li>
                <li className="flex items-center gap-2">
                  <StarIcon className="w-4 h-4 text-yellow-400" />
                  <strong className="text-yellow-400">Heroicons</strong> - Tailwind team quality
                </li>
                <li className="flex items-center gap-2">
                  <FaStar className="w-4 h-4 text-red-400" />
                  <strong className="text-red-400">Font Awesome</strong> - Industry standard
                </li>
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
