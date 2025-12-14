'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { H1, H2, CTAButton, GenericCard, FAQ } from '@saa/shared/components/saa';

// User type from stored session
interface UserData {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: 'admin' | 'user';
  profilePictureUrl: string | null;
}

// Section types
type SectionId = 'dashboard' | 'start-here' | 'calls' | 'templates' | 'courses' | 'production' | 'revshare' | 'exp-links' | 'new-agents';

interface NavItem {
  id: SectionId;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '⬡' },
  { id: 'start-here', label: 'Start Here', icon: '◈' },
  { id: 'calls', label: 'Team Calls', icon: '◉' },
  { id: 'templates', label: 'Templates', icon: '◫' },
  { id: 'courses', label: 'Elite Courses', icon: '◬' },
  { id: 'production', label: 'Production', icon: '◭' },
  { id: 'revshare', label: 'RevShare', icon: '◮' },
  { id: 'exp-links', label: 'eXp Links', icon: '◯' },
  { id: 'new-agents', label: 'New Agents', icon: '◠' },
];

// Dashboard quick access cards
const dashboardCards = [
  { id: 'start-here' as SectionId, title: 'Start Here', description: 'New to the team? Start here', icon: '🚀' },
  { id: 'calls' as SectionId, title: 'Team Calls & More', description: 'Live and recorded team calls', icon: '📹' },
  { id: 'templates' as SectionId, title: 'Exclusive Templates', description: 'Marketing templates and more', icon: '📢' },
  { id: 'courses' as SectionId, title: 'Elite Courses', description: 'Social Agent Academy, Flipping Houses, etc.', icon: '🎓' },
  { id: 'production' as SectionId, title: 'Quickstart Production', description: 'Landing Pages and Email Drips', icon: '👥' },
  { id: 'revshare' as SectionId, title: 'Quickstart RevShare', description: 'Grow your downline, no experience needed', icon: '💰' },
  { id: 'exp-links' as SectionId, title: 'eXp Links & Questions', description: 'Have an eXp question? Start here', icon: '🔗' },
  { id: 'new-agents' as SectionId, title: 'New Agents', description: 'Information tailored for you', icon: '🏃' },
];

export default function AgentPortal() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<SectionId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit profile form state
  const [editFormData, setEditFormData] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [editFormError, setEditFormError] = useState('');
  const [editFormSuccess, setEditFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('agent_portal_user');
    if (!storedUser) {
      router.push('/agent-portal/login');
      return;
    }
    try {
      setUser(JSON.parse(storedUser));
    } catch (e) {
      router.push('/agent-portal/login');
      return;
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('agent_portal_user');
    localStorage.removeItem('agent_portal_token');
    router.push('/agent-portal/login');
  };

  const handleOpenEditProfile = () => {
    setEditFormData({
      username: user?.username || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setEditFormError('');
    setEditFormSuccess('');
    setShowEditProfile(true);
  };

  const handleCloseEditProfile = () => {
    setShowEditProfile(false);
    setEditFormError('');
    setEditFormSuccess('');
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleEditProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditFormError('');
    setEditFormSuccess('');

    // Validate password fields if changing password
    if (editFormData.newPassword || editFormData.confirmPassword) {
      if (!editFormData.currentPassword) {
        setEditFormError('Current password is required to change password');
        return;
      }
      if (editFormData.newPassword !== editFormData.confirmPassword) {
        setEditFormError('New passwords do not match');
        return;
      }
      if (editFormData.newPassword.length < 8) {
        setEditFormError('New password must be at least 8 characters');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('agent_portal_token');
      const updates: any = {};

      if (editFormData.username !== user?.username) {
        updates.username = editFormData.username;
      }

      if (editFormData.newPassword) {
        updates.currentPassword = editFormData.currentPassword;
        updates.newPassword = editFormData.newPassword;
      }

      if (Object.keys(updates).length === 0) {
        setEditFormSuccess('No changes to save');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch('https://saabuildingblocks.com/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user?.id,
          ...updates,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update local user data
        if (updates.username) {
          const updatedUser = { ...user!, username: updates.username };
          setUser(updatedUser);
          localStorage.setItem('agent_portal_user', JSON.stringify(updatedUser));
        }
        setEditFormSuccess('Profile updated successfully!');
        setEditFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      } else {
        setEditFormError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Edit profile error:', err);
      setEditFormError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.id);

      const token = localStorage.getItem('agent_portal_token');
      const response = await fetch('https://saabuildingblocks.com/api/users/profile-picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const updatedUser = { ...user, profilePictureUrl: data.url };
        setUser(updatedUser);
        localStorage.setItem('agent_portal_user', JSON.stringify(updatedUser));
      } else {
        alert('Failed to upload profile picture. Please try again.');
      }
    } catch (err) {
      console.error('Profile picture upload error:', err);
      alert('Failed to upload profile picture. Please try again.');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#ffd700]/30 border-t-[#ffd700] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#ffd700]/60">Loading portal...</p>
        </div>
      </main>
    );
  }

  // This shouldn't happen but handle edge case
  if (!user) {
    return null;
  }

  return (
    <main id="main-content" className="min-h-screen">
      {/* Fixed Header Bar - Matches main site header style */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div
          style={{
            background: 'rgba(20, 20, 20, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '0 0 20px 20px',
            borderBottom: '2px solid rgba(60, 60, 60, 0.8)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div className="flex items-center justify-between px-4 sm:px-8" style={{ height: '85px' }}>
            {/* Logo - Same as main site */}
            <Link
              href="/"
              aria-label="Smart Agent Alliance Home"
              className="hover:scale-110 transition-transform duration-300"
              style={{ width: '126px', height: '45px' }}
            >
              <svg width="126px" height="45px" viewBox="0 0 201.96256 75.736626" version="1.1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <defs>
                  <linearGradient id="portalLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#fff3b0', stopOpacity: 1}} />
                    <stop offset="40%" style={{stopColor: '#ffd700', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#e6ac00', stopOpacity: 1}} />
                  </linearGradient>
                </defs>
                <g transform="translate(-5.5133704,-105.97189)">
                  <path fill="url(#portalLogoGradient)" d="M 21.472273,180.56058 C 11.316147,178.12213 1.9355119,166.45773 6.8673475,154.38101 c 0.2284985,-0.55952 1.4152886,-0.30887 8.5218335,-0.25364 6.089186,0.0474 11.528887,-0.54887 11.563021,0.35268 0.12172,3.21493 1.548705,4.66069 2.560443,5.07358 1.092535,0.44586 18.027365,0.14064 18.956531,-0.51505 2.086142,-1.47214 2.326164,-6.74 -0.732868,-6.70809 -1.893125,0.0197 -16.677992,0.18141 -18.724365,-0.11743 -4.043916,-0.59058 -5.591737,-1.59981 -9.49172,-4.13883 -8.077325,-5.25858 -10.5671578,-12.68416 -8.96983,-21.28238 0,0 6.234294,-0.12184 10.651176,-0.37024 4.312501,-0.24253 8.14686,-0.34782 8.671149,0.65635 1.028138,1.96921 2.764824,2.67171 3.10468,3.73011 0.296847,0.92448 1.558671,0.84083 5.661272,0.85056 4.303079,0.01 9.549862,0.24636 14.627167,0.65835 6.271917,0.50893 12.606804,1.04447 18.1587,14.09205 1.256383,2.95263 -0.05146,7.82433 2.707298,0.89052 0.906748,-2.27902 1.363355,-2.02044 15.012644,-2.13873 7.507113,-0.065 13.649301,-0.23577 13.649301,-0.37936 0,-0.1436 -0.28095,-0.89482 -0.62433,-1.66938 -0.34338,-0.77455 -1.02601,-2.31327 -1.51695,-3.41938 -0.49094,-1.10612 -2.062126,-4.92722 -3.491523,-8.49135 -1.429397,-3.56413 -2.857843,-7.08356 -3.174329,-7.82097 -0.316495,-0.7374 -1.226445,-2.94962 -2.022113,-4.91605 -0.795667,-1.96641 -4.043105,-11.29798 -3.693629,-11.88325 0.458064,-0.76712 -0.18677,-0.40385 12.337194,-0.40385 9.84423,0 9.65274,0.24739 9.65274,0.24739 1.2078,1.06083 2.78957,6.78964 3.34621,8.01751 0.55721,1.22913 1.27686,2.83788 1.59864,3.57529 0.60465,1.38564 1.79312,3.9863 4.28898,9.38518 0.79543,1.72061 2.34948,5.13949 3.45345,7.59751 2.67446,5.95472 3.04484,6.75259 5.91254,12.73702 2.46283,5.1395 2.46283,5.1395 3.20091,3.24636 2.23698,-5.73776 1.98186,-5.7611 4.28454,-5.95219 1.54958,-0.1286 24.51316,0.54777 24.82611,0.0215 0,0 -3.59658,-6.2074 -5.83995,-10.49576 -8.26158,-15.79266 -13.92752,-27.26401 -13.81355,-28.2205 0.0424,-0.35537 5.59171,-0.19826 13.73661,-0.17244 11.92585,0.0378 11.19138,0.12582 11.45775,0.44068 0.7756,0.9168 5.56816,10.25269 6.3956,11.61578 0.82745,1.36309 2.32581,3.98669 3.32968,5.83019 1.00389,1.84351 2.17996,3.95518 2.61353,4.69258 0.43356,0.7374 1.35628,2.34629 2.0505,3.5753 0.6942,1.22901 3.48408,6.15623 6.19971,10.94936 2.71564,4.79315 6.57201,11.63091 8.5697,15.19503 1.99772,3.56414 3.98079,6.98302 4.40686,7.59753 1.75557,2.53202 7.19727,12.85738 7.19727,13.65646 0,1.35047 -1.83096,1.53856 -14.97656,1.53856 -15.12194,0 -11.00005,0.41867 -13.10487,-0.35263 -2.71179,-0.99372 -7.4667,-12.35312 -8.24465,-13.49738 -0.5144,-0.75665 -20.11115,-0.50211 -20.85813,0.10747 -0.30114,0.24573 -4.74222,12.87268 -5.21806,13.18149 -0.51253,0.33263 1.56565,0.31373 -13.12083,0.46948 -14.37638,0.15246 -12.92516,-0.20864 -13.7378,-0.46876 -1.39249,-0.44578 -3.05836,-6.3221 -3.28223,-6.8137 -0.2239,-0.4916 -1.69614,-6.08358 -2.6942,-7.30424 -0.46821,-0.57263 -22.000524,-0.10018 -22.427167,0.30027 -0.495999,0.46555 -2.403531,4.97746 -3.536292,7.45088 -3.647579,7.96455 -0.798091,6.48322 -14.189162,6.21687 -7.764148,-0.15444 -10.944164,0.0682 -12.663388,-0.49314 -2.370345,-0.7739 -1.493164,-2.84033 -1.713395,-2.39718 -2.970363,5.97706 -32.338174,3.84174 -36.236923,2.90565 z m 12.24087,-53.49377 c -0.644922,-0.55276 -1.868417,-1.61286 -2.718877,-2.35578 C 28.5887,122.6096 17.54033,106.32825 20.700077,106.24689 c 18.520277,-0.47684 31.530155,-0.22018 43.622587,-0.0695 12.878883,18.49983 14.110357,21.6067 12.221476,21.31699 -20.587891,-5.5e-4 -41.658407,0.57749 -42.830997,-0.42752 z" />
                </g>
              </svg>
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#e5e4dd] hover:text-[#ff4444] hover:bg-[#ff4444]/10 border border-transparent hover:border-[#ff4444]/30 transition-all"
            >
              <span>Logout</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section
        className="relative px-4 sm:px-8 md:px-12 pt-32 pb-12 flex items-center justify-center"
      >
        <div className="max-w-[2500px] mx-auto w-full text-center">
          <H1>AGENT PORTAL</H1>
        </div>

        {/* Decorative grid lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,215,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,215,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </section>

      {/* Main Dashboard Layout */}
      <div className="max-w-[2500px] mx-auto px-4 sm:px-8 md:px-12 pb-20">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-3 rounded-lg border border-[#ffd700]/30 bg-black/30 backdrop-blur-sm text-body mb-4"
          >
            <span className="text-[#ffd700]">☰</span>
            <span>Menu</span>
          </button>

          {/* Sidebar Navigation */}
          <aside
            className={`
              ${sidebarOpen ? 'block' : 'hidden'} lg:block
              w-full lg:w-64 flex-shrink-0
            `}
          >
            <div className="sticky top-24 space-y-4">
              {/* User Profile Section */}
              <div className="rounded-xl p-4 bg-black/30 backdrop-blur-sm border border-[#ffd700]/15">
                {/* Hidden file input for profile picture upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />

                {/* Profile Picture */}
                <div className="flex flex-col items-center mb-4">
                  <button
                    onClick={handleProfilePictureClick}
                    className="relative group w-20 h-20 rounded-full overflow-hidden border-2 border-[#ffd700]/30 hover:border-[#ffd700] transition-colors mb-3"
                    title="Click to change profile picture"
                  >
                    {user.profilePictureUrl ? (
                      <img
                        src={user.profilePictureUrl}
                        alt={user.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#ffd700]/10 flex items-center justify-center">
                        <span className="text-3xl text-[#ffd700]">
                          {user.firstName?.charAt(0) || user.email?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </button>

                  {/* User Name */}
                  <h3 className="text-[#ffd700] font-semibold text-center">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-[#e5e4dd]/60 text-sm">{user.email}</p>

                  {/* Edit Profile Button */}
                  <button
                    onClick={handleOpenEditProfile}
                    className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-[#e5e4dd]/80 hover:text-[#ffd700] bg-white/5 hover:bg-[#ffd700]/10 border border-white/10 hover:border-[#ffd700]/30 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="rounded-xl p-4 space-y-2 bg-black/30 backdrop-blur-sm border border-[#ffd700]/15">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300
                    ${activeSection === item.id
                      ? 'bg-[#ffd700]/10 text-[#ffd700] border border-[#ffd700]/30'
                      : 'text-body hover:text-[#e5e4dd] hover:bg-white/5 border border-transparent'
                    }
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Dashboard View */}
            {activeSection === 'dashboard' && (
              <DashboardView onNavigate={setActiveSection} />
            )}

            {/* Start Here */}
            {activeSection === 'start-here' && <StartHereSection />}

            {/* Team Calls */}
            {activeSection === 'calls' && <TeamCallsSection />}

            {/* Templates */}
            {activeSection === 'templates' && <TemplatesSection />}

            {/* Elite Courses */}
            {activeSection === 'courses' && <CoursesSection />}

            {/* Production */}
            {activeSection === 'production' && <ProductionSection />}

            {/* RevShare */}
            {activeSection === 'revshare' && <RevShareSection />}

            {/* eXp Links */}
            {activeSection === 'exp-links' && <ExpLinksSection />}

            {/* New Agents */}
            {activeSection === 'new-agents' && <NewAgentsSection />}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={handleCloseEditProfile}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal */}
          <div
            className="relative w-full max-w-md bg-[#1a1a1a] rounded-2xl border border-[#ffd700]/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold text-[#ffd700]">Edit Profile</h2>
              <button
                onClick={handleCloseEditProfile}
                className="p-2 rounded-lg text-[#e5e4dd]/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEditProfileSubmit} className="p-6 space-y-5">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center mb-6">
                <button
                  type="button"
                  onClick={handleProfilePictureClick}
                  className="relative group w-24 h-24 rounded-full overflow-hidden border-2 border-[#ffd700]/30 hover:border-[#ffd700] transition-colors"
                >
                  {user.profilePictureUrl ? (
                    <img
                      src={user.profilePictureUrl}
                      alt={user.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#ffd700]/10 flex items-center justify-center">
                      <span className="text-4xl text-[#ffd700]">
                        {user.firstName?.charAt(0) || user.email?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </button>
                <p className="mt-2 text-sm text-[#e5e4dd]/60">Click to change photo</p>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-[#e5e4dd]/80 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={editFormData.username}
                  onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] focus:border-[#ffd700]/50 focus:outline-none focus:ring-1 focus:ring-[#ffd700]/30 transition-colors"
                  placeholder="Username"
                />
              </div>

              {/* Password Change Section */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-sm font-medium text-[#e5e4dd]/80 mb-4">Change Password (optional)</p>

                {/* Current Password */}
                <div className="mb-4">
                  <label className="block text-sm text-[#e5e4dd]/60 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={editFormData.currentPassword}
                    onChange={(e) => setEditFormData({ ...editFormData, currentPassword: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] focus:border-[#ffd700]/50 focus:outline-none focus:ring-1 focus:ring-[#ffd700]/30 transition-colors"
                    placeholder="Enter current password"
                  />
                </div>

                {/* New Password */}
                <div className="mb-4">
                  <label className="block text-sm text-[#e5e4dd]/60 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={editFormData.newPassword}
                    onChange={(e) => setEditFormData({ ...editFormData, newPassword: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] focus:border-[#ffd700]/50 focus:outline-none focus:ring-1 focus:ring-[#ffd700]/30 transition-colors"
                    placeholder="Enter new password"
                  />
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm text-[#e5e4dd]/60 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={editFormData.confirmPassword}
                    onChange={(e) => setEditFormData({ ...editFormData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] focus:border-[#ffd700]/50 focus:outline-none focus:ring-1 focus:ring-[#ffd700]/30 transition-colors"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              {/* Error/Success Messages */}
              {editFormError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {editFormError}
                </div>
              )}
              {editFormSuccess && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
                  {editFormSuccess}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseEditProfile}
                  className="flex-1 px-4 py-3 rounded-lg text-[#e5e4dd]/80 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-lg text-black font-semibold bg-[#ffd700] hover:bg-[#ffe55c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

// ============================================================================
// Dashboard View - Quick Access Cards
// ============================================================================
function DashboardView({ onNavigate }: { onNavigate: (id: SectionId) => void }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {dashboardCards.map((card) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.id)}
            className="text-left group"
          >
            <GenericCard className="h-full" hover padding="md">
              <div className="space-y-3">
                <span className="text-4xl">{card.icon}</span>
                <h3 className="text-h5 group-hover:text-[#ffd700] transition-colors">
                  {card.title}
                </h3>
                <p className="text-caption">
                  {card.description}
                </p>
              </div>
            </GenericCard>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Start Here Section
// ============================================================================
function StartHereSection() {
  const faqItems = [
    {
      question: '1. How to Use Our Tools',
      answer: `SAA assets are fully customizable to speed up your workflow. You'll mostly see Karrie Hill's actual assets, which you can customize to make it your own in Canva.

If you haven't yet decided how you want to brand yourself, it's a good idea to do that before you begin customizing SAA assets. Navigate to the Social Agent Academy Pro and review personal branding.

We continually add new assets and improve what's already available. If you have questions, concerns, or ideas for assets you'd like to see, please contact us.`
    },
    {
      question: '2. Where to Get Your Questions Answered',
      answer: `It's normal to have lots of questions when you're new to eXp. There's a lot to learn but you don't need to learn it all today!

As questions come to your mind, here's your path for who to ask first:

1. eXp World Welcome – Hit "Chat", then click on the little robot icon at the bottom and ask your question
2. eXp World – If it's a question about production, go to Your State Broker's room
3. eXp World – If it's not a question about production, go to Expert Care
4. Your SAA sponsor
5. Your next closest Upline sponsor`
    },
    {
      question: '3. Commonly Needed Resources & Tools',
      answer: `eXp provides more than one way to get to the SAME tools, so try not to feel overwhelmed. Access everything eXp United States through us.exprealty.com.

Key tools to familiarize yourself with:
• Comparative Market Analysis (CMA) – Use RPR (free with NAR membership)
• eXp World – For onboarding problems, state broker questions, tech support
• BoldTrail (kvCore) – Website and CRM management
• Skyslope – Electronic document signing and deal management
• Workplace – Referral groups and eXp communication
• eXp Agent Healthcare – Health insurance options
• Regus Office Centers – When you need office space
• eXp Exclusives – Search for off-market properties via Zenlist`
    },
    {
      question: '4. Task Management with Asana',
      answer: `If you don't already use the free platform Asana for day-to-day task management, we highly recommend it. It helps you stay organized and on top of your daily tasks and long-term goals.`
    },
    {
      question: '5. Lead with Value',
      answer: `Here's the number 1 tip from successful agents: Give to get. Plan to provide upfront value to people. They will appreciate your efforts and remember you when it comes time to buy or sell.

Simply offering an MLS automatic search isn't enough these days. Instead, focus on delivering unique value that only realtors can easily access:

• Newsletter Sign Up – Create interesting market reports with charts and statistics
• Instant Home Valuation Sign Up – Make it easy for people to get a home valuation
• Coming Soon Homes Sign Up – Share "Coming Soon" status homes before they hit the market`
    }
  ];

  return (
    <SectionWrapper title="Start Here">
      <FAQ items={faqItems} allowMultiple defaultOpenIndex={0} />
    </SectionWrapper>
  );
}

// ============================================================================
// Team Calls Section
// ============================================================================
function TeamCallsSection() {
  return (
    <SectionWrapper title="Team Calls & More">
      <div className="space-y-8">
        <h3 className="text-h3 text-center mb-6">Mastermind Calls</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GenericCard padding="md">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📹</span>
                <h4 className="text-h5 text-[#ffd700]">Connor Steinbrook Mastermind</h4>
              </div>
              <p className="text-body">Mindset-based discussions and teachings</p>
              <p className="text-body"><strong>Mondays</strong> at 8:00 am (PST)</p>
              <a
                href="https://zoom.us/j/4919666038?pwd=487789"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-[#ffd700]/10 border border-[#ffd700]/30 rounded-lg text-[#ffd700] hover:bg-[#ffd700]/20 transition-colors"
              >
                Join Zoom Call
              </a>
              <p className="text-caption">Password: 487789</p>
            </div>
          </GenericCard>

          <GenericCard padding="md">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📹</span>
                <h4 className="text-h5 text-[#8300E9]">Mike Sherrard Mastermind</h4>
              </div>
              <p className="text-body">Production-based discussions and teachings</p>
              <p className="text-body"><strong>Tuesdays</strong> at 2:00 pm (PST)</p>
              <a
                href="https://us02web.zoom.us/j/88399766561"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-[#8300E9]/10 border border-[#8300E9]/30 rounded-lg text-[#8300E9] hover:bg-[#8300E9]/20 transition-colors"
              >
                Join Zoom Call
              </a>
            </div>
          </GenericCard>
        </div>
      </div>
    </SectionWrapper>
  );
}

// ============================================================================
// Templates Section
// ============================================================================
function TemplatesSection() {
  return (
    <SectionWrapper title="Customizable Canva Assets">
      <div className="space-y-8">
        <GenericCard padding="lg">
          <div className="space-y-6">
            <h3 className="text-h3 text-[#ffd700]">Using SAA Canva Templates</h3>
            <p className="text-body">Use your eXp account credentials to login to Canva</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div>
                <h4 className="text-h5 mb-4">Templates Available For:</h4>
                <ul className="space-y-2 text-body">
                  <li>• Frames</li>
                  <li>• Buyer / Seller Presentations</li>
                  <li>• Self Promo / Testimonials / Marketing</li>
                  <li>• New Listing / For Sale</li>
                  <li>• Just Sold / Under Contract</li>
                  <li>• Buyer/Seller Tips</li>
                  <li>• Open House</li>
                  <li>• Thinking About Selling?</li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center p-6 rounded-xl border border-[#ffd700]/20">
                  <span className="text-5xl mb-4 block">🎨</span>
                  <p className="text-body">Access templates through your eXp Canva account</p>
                </div>
              </div>
            </div>
          </div>
        </GenericCard>
      </div>
    </SectionWrapper>
  );
}

// ============================================================================
// Elite Courses Section
// ============================================================================
function CoursesSection() {
  return (
    <SectionWrapper title="Elite Courses">
      <p className="text-center text-body mb-8">Refer to Wolf Pack emails to find login details</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GenericCard padding="md" centered>
          <div className="text-center space-y-4">
            <span className="text-5xl">🐺</span>
            <h3 className="text-h5 text-[#ffd700]">Wolf Pack Skool Portal & HUB</h3>
            <p className="text-body">Access the Wolfpack HUB in courses</p>
          </div>
        </GenericCard>

        <GenericCard padding="md" centered>
          <div className="text-center space-y-4">
            <span className="text-5xl">📱</span>
            <h3 className="text-h5 text-[#ffd700]">Social Agent Academy</h3>
            <p className="text-body">Learn how to dominate online</p>
          </div>
        </GenericCard>

        <GenericCard padding="md" centered>
          <div className="text-center space-y-4">
            <span className="text-5xl">🏠</span>
            <h3 className="text-h5 text-[#ffd700]">Investor Army</h3>
            <p className="text-body">Learn to flip houses</p>
          </div>
        </GenericCard>
      </div>
    </SectionWrapper>
  );
}

// ============================================================================
// Production Section
// ============================================================================
function ProductionSection() {
  const certificationFaq = [
    {
      question: 'Get Your Certifications',
      answer: `Yes, you should get certified so that leads drop into your lap! eXp Realty is the ONLY brokerage with a full-time staff dedicated to finding opportunities for agents to get high-quality leads. Don't miss out. Get certified!

• Express Offers Certification – Get easy seller leads by advertising that you provide up to multiple cash offers.
• Making it Rain Certification – A great way to start paid advertising fast to get leads rolling in while you're doing other things.
• All other Revenos Certifications – Agents should get all certifications so you can start collecting easy, high-quality leads.`
    },
    {
      question: 'Easy eXp Referrals in Workplace',
      answer: `Leads come to you when you introduce yourself in the many referral threads in Workplace. Workplace is like Facebook for eXp agents. There's a "group" for nearly every special interest, including referral groups.

Simply join the groups for cities/metro areas to which you have a personal connection and when people are looking for an agent there, reach out. We recommend setting up daily or weekly digest emails from Workplace so you can quickly see when someone has posted in a group.`
    },
    {
      question: 'Gain 6 – 20 More Deals Per Year',
      answer: `By signing up with referral networks, you can gain buyer and seller leads in your area. These are often a 25%-35% referral fee, but that beats no deal at all!

Referral Networks to consider:
• HomeLight
• Realtor.com Connections Plus
• Agent Pronto
• OJO
• Clever
• Redfin Partner Agents
• UpNest
• Home Openly
• Sold.com`
    }
  ];

  return (
    <SectionWrapper title="Quickstart Production">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <GenericCard padding="md">
            <div className="space-y-4">
              <span className="text-4xl">🏗️</span>
              <h3 className="text-h5 text-[#ffd700]">Build Landing Pages (Bold Trail)</h3>
              <p className="text-body">How to build them</p>
            </div>
          </GenericCard>

          <GenericCard padding="md">
            <div className="space-y-4">
              <span className="text-4xl">#️⃣</span>
              <h3 className="text-h5 text-[#ffd700]">Landing Page Hashtags & Links</h3>
              <p className="text-body">Be sure to watch the how-to video first</p>
            </div>
          </GenericCard>
        </div>

        <GenericCard padding="md">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">✉️</span>
              <h3 className="text-h5 text-[#ffd700]">Email Campaigns for Lead Magnets</h3>
            </div>
            <p className="text-body">Automate your nurturing of leads</p>
          </div>
        </GenericCard>

        <FAQ items={certificationFaq} allowMultiple />
      </div>
    </SectionWrapper>
  );
}

// ============================================================================
// RevShare Section
// ============================================================================
function RevShareSection() {
  const revShareFaq = [
    {
      question: 'How RevShare Works',
      answer: `eXp Realty's revenue share program allows you to earn passive income by attracting other agents to eXp. When agents you sponsor close transactions, you earn a percentage of the company's revenue from those transactions.

This is NOT a referral fee - it's a true revenue share that continues as long as those agents remain with eXp and are producing.`
    },
    {
      question: 'Getting Started with RevShare',
      answer: `The key to building a successful revenue share organization is to focus on attracting quality agents who are committed to production.

Tips for getting started:
• Share your genuine experience with eXp
• Focus on the value proposition for the agent, not just RevShare
• Use SAA resources to help your attracted agents succeed
• Participate in team calls and trainings`
    }
  ];

  return (
    <SectionWrapper title="Quickstart RevShare">
      <div className="space-y-6">
        <GenericCard padding="lg" centered>
          <div className="text-center space-y-4 py-4">
            <span className="text-6xl">💰</span>
            <h3 className="text-h3 text-[#ffd700]">Grow Your Downline</h3>
            <p className="text-body">No experience needed</p>
            <p className="text-body">Learn how to build passive income through eXp's revenue share program</p>
          </div>
        </GenericCard>

        <FAQ items={revShareFaq} allowMultiple />
      </div>
    </SectionWrapper>
  );
}

// ============================================================================
// eXp Links Section
// ============================================================================
function ExpLinksSection() {
  return (
    <SectionWrapper title="eXp Links & Questions">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GenericCard padding="md">
            <div className="space-y-4">
              <h3 className="text-h5 text-[#ffd700]">For Production Questions:</h3>
              <p className="text-body">Go to eXp World and visit your State Broker's room</p>
              <a
                href="https://exp.world/welcome"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-[#ffd700]/10 border border-[#ffd700]/30 rounded-lg text-[#ffd700] hover:bg-[#ffd700]/20 transition-colors"
              >
                Go to eXp World
              </a>
            </div>
          </GenericCard>

          <GenericCard padding="md">
            <div className="space-y-4">
              <h3 className="text-h5 text-[#ffd700]">For Other Questions:</h3>
              <p className="text-body">Visit Expert Care in eXp World</p>
              <a
                href="https://exp.world/expertcare"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-[#ffd700]/10 border border-[#ffd700]/30 rounded-lg text-[#ffd700] hover:bg-[#ffd700]/20 transition-colors"
              >
                Go to Expert Care
              </a>
            </div>
          </GenericCard>
        </div>

        <GenericCard padding="md">
          <div className="space-y-4">
            <h3 className="text-h5 text-[#ffd700]">Still can't find the answer?</h3>
            <p className="text-body">Contact us directly:</p>
            <div className="flex flex-wrap gap-4">
              <a
                href="mailto:doug@smartagentalliance.com"
                className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[#e5e4dd] hover:bg-white/10 transition-colors"
              >
                doug@smartagentalliance.com
              </a>
              <a
                href="mailto:karrie@smartagentalliance.com"
                className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[#e5e4dd] hover:bg-white/10 transition-colors"
              >
                karrie@smartagentalliance.com
              </a>
            </div>
          </div>
        </GenericCard>

        <div>
          <h3 className="text-h5 mb-4">Quick Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'eXp Realty US', url: 'https://us.exprealty.com/' },
              { label: 'BoldTrail (kvCore)', url: 'https://app.boldtrail.com/' },
              { label: 'Skyslope', url: 'https://app.skyslope.com/LoginIntegrated.aspx' },
              { label: 'Workplace', url: 'https://exprealty.workplace.com/' },
              { label: 'RPR (CMA)', url: 'https://auth.narrpr.com/' },
              { label: 'eXp Agent Healthcare', url: 'https://solutions.exprealty.com/professional-solutions/clearwater-benefits/' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-[#e5e4dd] hover:bg-[#ffd700]/10 hover:border-[#ffd700]/30 hover:text-[#ffd700] transition-all"
              >
                {link.label} →
              </a>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

// ============================================================================
// New Agents Section
// ============================================================================
function NewAgentsSection() {
  return (
    <SectionWrapper title="New Agents">
      <div className="space-y-6">
        <GenericCard padding="lg">
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-6xl mb-4 block">🎯</span>
              <h3 className="text-h3 text-[#ffd700]">Welcome to Smart Agent Alliance!</h3>
              <p className="text-body mt-2">Information tailored specifically for new agents</p>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h4 className="text-h5 mb-4">Your First Steps:</h4>
              <ol className="space-y-3 text-body">
                <li className="flex gap-3">
                  <span className="text-[#ffd700] font-bold">1.</span>
                  <span>Complete the "Start Here" section to understand how to use SAA tools</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#ffd700] font-bold">2.</span>
                  <span>Join the weekly Mastermind calls for training and community</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#ffd700] font-bold">3.</span>
                  <span>Get your certifications to start receiving leads</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#ffd700] font-bold">4.</span>
                  <span>Explore the Canva templates to build your marketing materials</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#ffd700] font-bold">5.</span>
                  <span>Connect with your sponsor and the SAA community</span>
                </li>
              </ol>
            </div>
          </div>
        </GenericCard>

        <div className="text-center">
          <p className="text-body mb-4">Questions? Reach out to your sponsor or contact us:</p>
          <a
            href="mailto:doug@smartagentalliance.com"
            className="inline-block px-6 py-3 bg-[#ffd700]/10 border border-[#ffd700]/30 rounded-lg text-[#ffd700] hover:bg-[#ffd700]/20 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </SectionWrapper>
  );
}

// ============================================================================
// Section Wrapper Component
// ============================================================================
function SectionWrapper({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-6 sm:p-8 bg-black/30 backdrop-blur-sm border border-[#ffd700]/10">
      <H2 className="mb-8">{title}</H2>
      {children}
    </div>
  );
}
