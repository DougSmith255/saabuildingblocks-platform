'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { H1, H2, CTAButton, GenericCard, FAQ, Icon3D } from '@saa/shared/components/saa';
import { Modal } from '@saa/shared/components/saa/interactive/Modal';
import { Rocket, Video, Megaphone, GraduationCap, Users, DollarSign, Link2, PersonStanding, LayoutGrid, FileUser, Menu, Home, LifeBuoy, Headphones, MessageCircleQuestion, Building2, Wrench, User, LogOut, BarChart3, UserCircle, LinkIcon, Download } from 'lucide-react';
import glassStyles from '@/components/shared/GlassShimmer.module.css';
import { preloadAppData } from '@/components/pwa/PreloadService';
import { ChromePicker, ColorResult } from 'react-color';

// Shake animation styles + mobile tap highlight fix
const shakeKeyframes = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-3px); }
  40% { transform: translateX(3px); }
  60% { transform: translateX(-2px); }
  80% { transform: translateX(2px); }
}

/* Disable tap highlight on ALL elements in agent portal to prevent grey flash on touch/drag */
.agent-portal-root,
.agent-portal-root *,
#main-content,
#main-content *,
.section-content,
.section-content * {
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  tap-highlight-color: transparent !important;
}

/* Prevent header container from darkening on touch */
.header-bg-container, .header-bg-container * {
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
}

/* Ensure all clickable/interactive elements have no highlight */
.agent-portal-root button,
.agent-portal-root a,
.agent-portal-root [role="button"],
.agent-portal-root input,
.agent-portal-root textarea,
.agent-portal-root select,
.agent-portal-root div[onclick],
.agent-portal-root iframe {
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
}

/* Mobile bottom nav - ensure no tap highlight anywhere */
.mobile-bottom-nav,
.mobile-bottom-nav *,
.mobile-bottom-nav button {
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
}

/* Bottom nav sliding indicator animation */
@keyframes nav-indicator-slide {
  0% { transform: scaleX(0.8); opacity: 0.5; }
  100% { transform: scaleX(1); opacity: 1; }
}

.nav-indicator-active {
  animation: nav-indicator-slide 0.2s ease-out forwards;
}

/* Bento card hover lift effect */
@keyframes card-hover-glow {
  0% { box-shadow: 0 0 0 rgba(255, 215, 0, 0); }
  100% { box-shadow: 0 8px 32px rgba(255, 215, 0, 0.15); }
}

/* Icon bounce animation on hover */
@keyframes icon-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
`;

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
  gender?: 'male' | 'female' | null;
  isLeader?: boolean | null;
}

// Section types
type SectionId = 'dashboard' | 'market-stats' | 'calls' | 'templates' | 'courses' | 'production' | 'revshare' | 'exp-links' | 'new-agents' | 'agent-page' | 'linktree' | 'support' | 'profile';

interface NavItem {
  id: SectionId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'support', label: 'Get Support', icon: LifeBuoy },
  { id: 'linktree', label: 'Linktree', icon: LinkIcon },
  { id: 'agent-page', label: 'Agent Attraction', icon: UserCircle },
  { id: 'calls', label: 'Team Calls', icon: Video },
  { id: 'templates', label: 'Templates', icon: Megaphone },
  { id: 'courses', label: 'Elite Courses', icon: GraduationCap },
  { id: 'production', label: 'Production', icon: Users },
  { id: 'revshare', label: 'RevShare', icon: DollarSign },
  { id: 'exp-links', label: 'eXp Links', icon: Link2 },
  { id: 'new-agents', label: 'New Agents', icon: PersonStanding },
];

// Dashboard quick access cards with Lucide icons for 3D effect
// size: 'featured' = large card (spans 2 cols), 'standard' = normal card, 'compact' = smaller card
// 'hero' = extra prominent card for support
type CardSize = 'hero' | 'featured' | 'standard' | 'compact';
const dashboardCards: { id: SectionId; title: string; description: string; icon: React.ComponentType<{ className?: string }>; size: CardSize; gradient?: string; accentColor?: string; comingSoon?: boolean }[] = [
  { id: 'support', title: 'Get Support', description: 'Need help? Find the right contact', icon: LifeBuoy, size: 'hero', gradient: 'from-[#ffd700]/30 to-amber-600/15', accentColor: '#ffd700' },
  { id: 'linktree', title: 'Linktree', description: 'Your customizable link page', icon: LinkIcon, size: 'featured', gradient: 'from-emerald-500/25 to-[#00ff88]/15', accentColor: '#00ff88' },
  { id: 'agent-page', title: 'Agent Attraction', description: 'Your personal recruitment page', icon: UserCircle, size: 'featured', gradient: 'from-purple-500/25 to-violet-600/15', accentColor: '#a855f7' },
  { id: 'calls', title: 'Team Calls', description: 'Live and recorded calls', icon: Video, size: 'standard', accentColor: '#ffd700' },
  { id: 'templates', title: 'Templates', description: 'Marketing templates', icon: Megaphone, size: 'standard', accentColor: '#ffd700' },
  { id: 'courses', title: 'Elite Courses', description: 'Academy & courses', icon: GraduationCap, size: 'standard', accentColor: '#ffd700' },
  { id: 'production', title: 'Production', description: 'Landing pages & drips', icon: Users, size: 'standard', accentColor: '#ffd700' },
  { id: 'revshare', title: 'RevShare', description: 'Grow your downline', icon: DollarSign, size: 'compact', accentColor: '#ffd700' },
  { id: 'exp-links', title: 'eXp Links', description: 'Questions & resources', icon: Link2, size: 'compact', accentColor: '#ffd700' },
  { id: 'new-agents', title: 'New Agents', description: 'Info for new agents', icon: PersonStanding, size: 'compact', accentColor: '#ffd700' },
];

// Rewrite asset URLs to use CDN for edge caching
// This transforms assets.saabuildingblocks.com -> cdn.saabuildingblocks.com
function toCdnUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  return url.replace('assets.saabuildingblocks.com', 'cdn.saabuildingblocks.com');
}

// Aggressively preload profile image using link preload tag (highest priority)
function preloadProfileImage(url: string) {
  if (typeof window === 'undefined' || !url) return;

  // Check if preload link already exists
  const existingPreload = document.querySelector(`link[rel="preload"][href="${url}"]`);
  if (existingPreload) return;

  // Add preload link to head (highest browser priority)
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = url;
  link.fetchPriority = 'high';
  document.head.appendChild(link);

  // Also start Image() preload as backup
  const img = new Image();
  img.src = url;
}

// Helper to get initial user from localStorage (runs only on client)
// Also starts preloading the profile image immediately via CDN
function getInitialUser(): UserData | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('agent_portal_user');
    if (stored) {
      const user = JSON.parse(stored);
      // Rewrite URL to use CDN
      if (user.profilePictureUrl) {
        user.profilePictureUrl = toCdnUrl(user.profilePictureUrl);
        // Start preloading profile image immediately with highest priority
        preloadProfileImage(user.profilePictureUrl);
      }
      return user;
    }
  } catch {
    // Invalid JSON, clear it
    localStorage.removeItem('agent_portal_user');
  }
  return null;
}

export default function AgentPortal() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<SectionId>('dashboard');
  const [shakingItem, setShakingItem] = useState<SectionId | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Initialize user directly from localStorage to avoid flash
  const [user, setUser] = useState<UserData | null>(() => getInitialUser());
  const [isLoading, setIsLoading] = useState(() => typeof window === 'undefined');
  // Minimum loading screen display time (3.5 seconds) so users can see the beautiful loading screen
  const [minLoadTimeElapsed, setMinLoadTimeElapsed] = useState(false);
  // Fade out animation state for the loading screen veil
  const [isLoadingFadingOut, setIsLoadingFadingOut] = useState(false);
  // Show loading screen for all users (PWA and browser) to load everything upfront
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  // Detect if running as installed PWA (hide download button if true)
  const [isRunningAsPWA, setIsRunningAsPWA] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  });
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [dashboardUploadStatus, setDashboardUploadStatus] = useState<string | null>(null);
  const [dashboardUploadError, setDashboardUploadError] = useState<string | null>(null);
  const [attractionUploadStatus, setAttractionUploadStatus] = useState<string | null>(null);
  const [attractionUploadError, setAttractionUploadError] = useState<string | null>(null);
  const [isUploadingDashboardImage, setIsUploadingDashboardImage] = useState(false);
  // Preloaded agent page data - fetched during loading screen to avoid loading on tab switch
  const [preloadedAgentPageData, setPreloadedAgentPageData] = useState<any>(null);
  const [contrastLevel, setContrastLevel] = useState(130); // Default 130%
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null); // Store original for reprocessing
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Image crop/edit modal state
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [pendingImageUrl, setPendingImageUrl] = useState<string | null>(null);
  const [profileImageError, setProfileImageError] = useState(false); // Track if profile image failed to load
  const [profileImageLoading, setProfileImageLoading] = useState(false); // Images are preloaded during loading screen
  const [pendingBgRemovedUrl, setPendingBgRemovedUrl] = useState<string | null>(null);
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);
  const [bgRemovalProgress, setBgRemovalProgress] = useState(0);
  const [pendingImageDimensions, setPendingImageDimensions] = useState({ width: 0, height: 0 });
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, size: 100 }); // percentage-based
  const [previewContrastLevel, setPreviewContrastLevel] = useState(130);
  const imageEditorRef = useRef<HTMLDivElement>(null);

  // Two-step image editor state
  const [imageEditorStep, setImageEditorStep] = useState<1 | 2>(1);
  const [hasVisitedStep2, setHasVisitedStep2] = useState(false);
  const [colorContrastLevel, setColorContrastLevel] = useState(100); // Color version contrast (default 100%)
  const [bwContrastLevel, setBwContrastLevel] = useState(130); // B&W version contrast (default 130%)

  // Track which source triggered the image upload (for showing notifications in correct location)
  const [uploadSource, setUploadSource] = useState<'dashboard' | 'agent-pages' | null>(null);

  // Check if any popup is open (for header slide animation)
  const isAnyPopupOpen = showEditProfile || showImageEditor;


  // Calculate minimum crop size percentage based on 900px minimum
  const MIN_CROP_PX = 900;
  const minCropSizePercent = pendingImageDimensions.width > 0 && pendingImageDimensions.height > 0
    ? Math.ceil((MIN_CROP_PX / Math.min(pendingImageDimensions.width, pendingImageDimensions.height)) * 100)
    : 100;

  // Edit profile form state
  const [editFormData, setEditFormData] = useState({
    displayFirstName: '',
    displayLastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [editFormError, setEditFormError] = useState('');
  const [editFormSuccess, setEditFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Minimum loading screen display time (3 seconds for all users)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadTimeElapsed(true);
    }, 3000); // 3 seconds minimum for all users
    return () => clearTimeout(timer);
  }, []);

  // Preload all app data during loading screen
  useEffect(() => {
    if (showLoadingScreen) {
      preloadAppData().then((result) => {
        if (result.userData) {
          // Update user state with fresh data from API
          const freshUserData = {
            id: result.userData.id,
            email: result.userData.email,
            username: result.userData.username,
            firstName: result.userData.first_name || result.userData.firstName || '',
            lastName: result.userData.last_name || result.userData.lastName || '',
            fullName: result.userData.full_name || result.userData.fullName || '',
            role: result.userData.role,
            profilePictureUrl: toCdnUrl(result.userData.profile_picture_url || result.userData.profilePictureUrl),
            gender: result.userData.gender || 'male',
            isLeader: result.userData.is_leader || false,
          };
          setUser(freshUserData);
          // Also update localStorage
          localStorage.setItem('agent_portal_user', JSON.stringify(freshUserData));
        }
        // Store preloaded agent page data
        if (result.agentPageData) {
          setPreloadedAgentPageData(result.agentPageData);
        }
        setIsLoading(false);
      }).catch(() => {
        // Even if preload fails, we should still stop loading
        setIsLoading(false);
      });
    }
  }, []); // Only run once on mount

  // Trigger fade-out animation when loading is complete
  useEffect(() => {
    // When all loading conditions are met, start the fade-out
    if (!isLoading && user && minLoadTimeElapsed && showLoadingScreen && !isLoadingFadingOut) {
      setIsLoadingFadingOut(true);
      // After fade animation completes, hide the loading screen entirely
      const timer = setTimeout(() => {
        setShowLoadingScreen(false);
      }, 800); // Match the CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isLoading, user, minLoadTimeElapsed, showLoadingScreen, isLoadingFadingOut]);

  // Check authentication on mount - redirect if not logged in
  useEffect(() => {
    // User is already initialized from localStorage in useState
    // Just need to redirect if not found
    if (!user) {
      router.push('/agent-portal/login');
    }
  }, [user, router]);

  // Preload profile image for faster display (in case it wasn't preloaded during init)
  useEffect(() => {
    if (user?.profilePictureUrl) {
      preloadProfileImage(user.profilePictureUrl);
    }
  }, [user?.profilePictureUrl]);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isAnyPopupOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAnyPopupOpen]);

  // Inject shake animation keyframes on mount
  useEffect(() => {
    const styleId = 'portal-shake-animation';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = shakeKeyframes;
      document.head.appendChild(style);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('agent_portal_user');
    localStorage.removeItem('agent_portal_token');
    router.push('/agent-portal/login');
  };

  const handleOpenEditProfile = () => {
    setEditFormData({
      displayFirstName: user?.firstName || '',
      displayLastName: user?.lastName || '',
      email: user?.email || '',
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

    // Validate email format if changed
    const emailChanged = editFormData.email !== user?.email;
    if (emailChanged && editFormData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editFormData.email)) {
        setEditFormError('Please enter a valid email address');
        return;
      }
    }

    // Validate password fields if changing password
    if (editFormData.newPassword || editFormData.confirmPassword) {
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
      const displayNameChanged =
        editFormData.displayFirstName !== user?.firstName ||
        editFormData.displayLastName !== user?.lastName;

      if (displayNameChanged) {
        updates.firstName = editFormData.displayFirstName;
        updates.lastName = editFormData.displayLastName;
      }

      if (emailChanged && editFormData.email) {
        updates.email = editFormData.email;
      }

      if (editFormData.newPassword) {
        updates.newPassword = editFormData.newPassword;
      }

      if (Object.keys(updates).length === 0) {
        setEditFormSuccess('No changes to save');
        setIsSubmitting(false);
        // Close the modal after a brief delay
        setTimeout(() => {
          setShowEditProfile(false);
          setEditFormSuccess('');
        }, 1500);
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
        const updatedUser = { ...user! };
        if (displayNameChanged) {
          updatedUser.firstName = editFormData.displayFirstName;
          updatedUser.lastName = editFormData.displayLastName;
          updatedUser.fullName = `${editFormData.displayFirstName} ${editFormData.displayLastName}`;
        }
        if (emailChanged && editFormData.email) {
          updatedUser.email = editFormData.email;
        }
        setUser(updatedUser);
        localStorage.setItem('agent_portal_user', JSON.stringify(updatedUser));

        setEditFormSuccess('Profile updated successfully!');
        setEditFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
        // Clear success message after delay (close modal only if in modal mode)
        setTimeout(() => {
          if (showEditProfile) {
            setShowEditProfile(false);
          }
          setEditFormSuccess('');
        }, 2000);
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

  // Helper function to apply B&W + contrast filter to an image
  const applyBWContrastFilter = async (imageSource: File | Blob, contrast: number): Promise<Blob> => {
    const img = new Image();
    const imageUrl = URL.createObjectURL(imageSource);

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = imageUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      URL.revokeObjectURL(imageUrl);
      throw new Error('Could not get canvas context');
    }

    ctx.filter = `grayscale(100%) contrast(${contrast}%)`;
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(imageUrl);

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create blob'));
      }, 'image/png');
    });
  };

  // Apply color contrast filter (no grayscale, just contrast adjustment)
  const applyColorContrastFilter = async (imageSource: File | Blob, contrast: number): Promise<Blob> => {
    const img = new Image();
    const imageUrl = URL.createObjectURL(imageSource);

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = imageUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      URL.revokeObjectURL(imageUrl);
      throw new Error('Could not get canvas context');
    }

    ctx.filter = `contrast(${contrast}%)`;
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(imageUrl);

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create blob'));
      }, 'image/png');
    });
  };

  // Open image editor modal when user selects a file
  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file || !user) {
        console.log('[ImageEditor] No file selected or no user');
        return;
      }

      console.log('[ImageEditor] File selected:', file.name, file.type, file.size);

      // Validate file type
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

      if (!file.type.startsWith('image/') && !validExtensions.includes(fileExtension)) {
        setDashboardUploadError('Please select an image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setDashboardUploadError('Image must be less than 5MB');
        return;
      }

      // Validate image dimensions (minimum 900x900)
      const MIN_DIMENSION = 900;
      let imageDimensions: { width: number; height: number };

      try {
        imageDimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            console.log('[ImageEditor] Image loaded:', img.width, 'x', img.height);
            resolve({ width: img.width, height: img.height });
            URL.revokeObjectURL(img.src);
          };
          img.onerror = (err) => {
            console.error('[ImageEditor] Image load error:', err);
            reject(new Error('Failed to load image'));
            URL.revokeObjectURL(img.src);
          };
          img.src = URL.createObjectURL(file);
        });
      } catch (dimError) {
        console.error('[ImageEditor] Dimension check failed:', dimError);
        setDashboardUploadError('Failed to load image. Please try another file.');
        return;
      }

      if (imageDimensions.width < MIN_DIMENSION || imageDimensions.height < MIN_DIMENSION) {
        setDashboardUploadError(`Image must be at least ${MIN_DIMENSION}x${MIN_DIMENSION} pixels. Your image is ${imageDimensions.width}x${imageDimensions.height}.`);
        return;
      }

      // Open editor modal with the image
      console.log('[ImageEditor] Opening editor modal from dashboard');
      setUploadSource('dashboard'); // Track that this came from dashboard
      setPendingImageFile(file);
      const originalUrl = URL.createObjectURL(file);
      setPendingImageUrl(originalUrl);
      setPendingBgRemovedUrl(null); // Reset bg removed preview
      setPendingImageDimensions(imageDimensions);
      setPreviewContrastLevel(130);
      setCropArea({ x: 0, y: 0, size: 100 });
      setShowImageEditor(true);
      setDashboardUploadError(null);

      // Start background removal for preview
      setIsRemovingBackground(true);
      setBgRemovalProgress(0);
      try {
        const { removeBackground } = await import('@imgly/background-removal');
        const bgRemovedBlob = await removeBackground(file, {
          progress: (key: string, current: number, total: number) => {
            // Track progress across all phases
            const progress = total > 0 ? Math.round((current / total) * 100) : 0;
            // Update progress for any phase that reports it
            if (progress > 0) {
              setBgRemovalProgress(progress);
            }
          },
        });
        const bgRemovedUrl = URL.createObjectURL(bgRemovedBlob);
        setPendingBgRemovedUrl(bgRemovedUrl);
      } catch (bgErr) {
        console.error('[ImageEditor] Background removal failed:', bgErr);
        // Continue without bg removal preview - will still work on confirm
      } finally {
        setIsRemovingBackground(false);
      }
    } catch (error) {
      console.error('[ImageEditor] Unexpected error:', error);
      setDashboardUploadError('An unexpected error occurred. Please try again.');
    }
  };

  // Crop image using canvas
  const cropImage = async (file: File, cropX: number, cropY: number, cropSize: number): Promise<Blob> => {
    const img = new Image();
    const imageUrl = URL.createObjectURL(file);

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = imageUrl;
    });

    URL.revokeObjectURL(imageUrl);

    // Calculate crop dimensions based on percentages
    const minDim = Math.min(img.width, img.height);
    const actualSize = (cropSize / 100) * minDim;
    const actualX = (cropX / 100) * (img.width - actualSize);
    const actualY = (cropY / 100) * (img.height - actualSize);

    const canvas = document.createElement('canvas');
    canvas.width = actualSize;
    canvas.height = actualSize;
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Could not get canvas context');

    ctx.drawImage(img, actualX, actualY, actualSize, actualSize, 0, 0, actualSize, actualSize);

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create blob'));
      }, 'image/png');
    });
  };

  // Process and upload the edited image
  const handleConfirmImageEdit = async () => {
    if (!pendingImageFile || !user) return;

    // Helper to set status based on upload source
    const setStatus = (status: string | null) => {
      if (uploadSource === 'agent-pages') {
        setAttractionUploadStatus(status);
      } else {
        setDashboardUploadStatus(status);
      }
    };

    const setError = (error: string | null) => {
      if (uploadSource === 'agent-pages') {
        setAttractionUploadError(error);
      } else {
        setDashboardUploadError(error);
      }
    };

    setShowImageEditor(false);
    setIsUploadingDashboardImage(true);
    setError(null);
    setStatus(null);

    // Store original file and contrast level (use B&W contrast for the dashboard image)
    setOriginalImageFile(pendingImageFile);
    setContrastLevel(bwContrastLevel);

    try {
      const token = localStorage.getItem('agent_portal_token');

      // Step 1: Crop the image
      setStatus('Cropping image...');
      const croppedBlob = await cropImage(pendingImageFile, cropArea.x, cropArea.y, cropArea.size);

      // Step 2: Remove background
      setStatus('Removing background...');
      const { removeBackground } = await import('@imgly/background-removal');

      const bgRemovedBlob = await removeBackground(croppedBlob, {
        progress: (key: string, current: number, total: number) => {
          const percent = total > 0 ? Math.round((current / total) * 100) : 0;
          if (percent > 0) {
            setStatus(`Removing background... ${percent}%`);
          }
        },
      });

      // Step 3: Apply B&W + contrast to the cutout (using bwContrastLevel from step 2)
      setStatus('Applying B&W filter...');
      const processedBlob = await applyBWContrastFilter(bgRemovedBlob, bwContrastLevel);

      // Step 3b: Apply color contrast to the cutout (using colorContrastLevel from step 1)
      setStatus('Applying color contrast...');
      const colorProcessedBlob = await applyColorContrastFilter(bgRemovedBlob, colorContrastLevel);

      // Step 4: Upload to dashboard
      setStatus('Uploading...');
      const dashboardFormData = new FormData();
      dashboardFormData.append('file', processedBlob, 'profile.png');
      dashboardFormData.append('userId', user.id);

      const dashboardResponse = await fetch('https://saabuildingblocks.com/api/users/profile-picture', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: dashboardFormData,
      });

      if (!dashboardResponse.ok) {
        const errorData = await dashboardResponse.json();
        throw new Error(errorData.message || 'Failed to upload');
      }

      const dashboardData = await dashboardResponse.json();
      // Apply toCdnUrl to use edge-cached CDN instead of origin
      const updatedUser = { ...user, profilePictureUrl: toCdnUrl(dashboardData.url) };
      setUser(updatedUser);
      setProfileImageError(false); // Reset error state for new image
      setProfileImageLoading(true); // Reset loading state for new image
      localStorage.setItem('agent_portal_user', JSON.stringify(updatedUser));

      // Step 5: Upload same to attraction page (B&W version)
      setStatus('Syncing to attraction page...');
      const pageResponse = await fetch(`https://saabuildingblocks.com/api/agent-pages/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (pageResponse.ok) {
        const currentPageData = await pageResponse.json();
        if (currentPageData.page?.id) {
          // Upload B&W version
          const attractionFormData = new FormData();
          attractionFormData.append('file', processedBlob, 'profile.png');
          attractionFormData.append('pageId', currentPageData.page.id);

          const uploadResponse = await fetch('https://saabuildingblocks.com/api/agent-pages/upload-image', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: attractionFormData,
          });

          // Update local pageData state if we're in the attraction page section
          if (uploadResponse.ok) {
            const uploadResult = await uploadResponse.json();
            if (uploadResult.data?.url) {
              // Dispatch a custom event to update the AgentPagesSection's pageData
              window.dispatchEvent(new CustomEvent('agent-page-image-updated', {
                detail: { url: uploadResult.data.url }
              }));
            }
          }

          // Step 6: Also upload COLOR version (for Linktree color option) - with color contrast applied
          setStatus('Uploading color version...');
          const colorFormData = new FormData();
          colorFormData.append('file', colorProcessedBlob, 'profile-color.png');
          colorFormData.append('pageId', currentPageData.page.id);

          await fetch('https://saabuildingblocks.com/api/agent-pages/upload-color-image', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: colorFormData,
          });
        }
      }

      setStatus('Profile picture updated!');
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      console.error('Profile picture upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload');
      setStatus(null);
    } finally {
      setIsUploadingDashboardImage(false);
      setUploadSource(null); // Reset upload source
      // Clean up
      if (pendingImageUrl) URL.revokeObjectURL(pendingImageUrl);
      if (pendingBgRemovedUrl) URL.revokeObjectURL(pendingBgRemovedUrl);
      setPendingImageFile(null);
      setPendingImageUrl(null);
      setPendingBgRemovedUrl(null);
    }
  };

  // Cancel image edit
  const handleCancelImageEdit = () => {
    setShowImageEditor(false);
    if (pendingImageUrl) URL.revokeObjectURL(pendingImageUrl);
    if (pendingBgRemovedUrl) URL.revokeObjectURL(pendingBgRemovedUrl);
    setPendingImageFile(null);
    setPendingImageUrl(null);
    setPendingBgRemovedUrl(null);
    setIsRemovingBackground(false);
    setBgRemovalProgress(0);
    // Reset two-step state
    setImageEditorStep(1);
    setHasVisitedStep2(false);
    setColorContrastLevel(100);
    setBwContrastLevel(130);
  };

  // Re-process existing images with new contrast level
  const handleReprocessImages = async () => {
    if (!originalImageFile) {
      setDashboardUploadError('Please upload a new image first to adjust contrast. The original image is only available during the current session.');
      return;
    }

    setIsUploadingDashboardImage(true);
    setDashboardUploadError(null);
    setDashboardUploadStatus(null);

    try {
      const token = localStorage.getItem('agent_portal_token');

      // Step 1: Remove background from stored original
      setDashboardUploadStatus('Removing background...');
      const { removeBackground } = await import('@imgly/background-removal');

      const bgRemovedBlob = await removeBackground(originalImageFile, {
        progress: (key: string, current: number, total: number) => {
          const percent = total > 0 ? Math.round((current / total) * 100) : 0;
          if (percent > 0) {
            setDashboardUploadStatus(`Removing background... ${percent}%`);
          }
        },
      });

      // Step 2: Apply new B&W + contrast
      setDashboardUploadStatus('Applying new contrast level...');
      const processedBlob = await applyBWContrastFilter(bgRemovedBlob, contrastLevel);

      // Step 3: Upload to dashboard
      setDashboardUploadStatus('Updating dashboard...');
      const dashboardFormData = new FormData();
      dashboardFormData.append('file', processedBlob, 'profile.png');
      dashboardFormData.append('userId', user!.id);

      const dashboardResponse = await fetch('https://saabuildingblocks.com/api/users/profile-picture', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: dashboardFormData,
      });

      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        // Apply toCdnUrl to use edge-cached CDN instead of origin
        const updatedUser = { ...user!, profilePictureUrl: toCdnUrl(dashboardData.url) };
        setUser(updatedUser);
        setProfileImageError(false); // Reset error state for new image
        setProfileImageLoading(true); // Reset loading state for new image
        localStorage.setItem('agent_portal_user', JSON.stringify(updatedUser));
      }

      // Step 4: Upload same to attraction page
      setDashboardUploadStatus('Syncing to attraction page...');
      const pageResponse = await fetch(`https://saabuildingblocks.com/api/agent-pages/${user!.id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (pageResponse.ok) {
        const pageData = await pageResponse.json();
        if (pageData.page?.id) {
          const attractionFormData = new FormData();
          attractionFormData.append('file', processedBlob, 'profile.png');
          attractionFormData.append('pageId', pageData.page.id);

          await fetch('https://saabuildingblocks.com/api/agent-pages/upload-image', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: attractionFormData,
          });
        }
      }

      setDashboardUploadStatus('Images updated successfully!');
      setTimeout(() => setDashboardUploadStatus(null), 3000);
    } catch (err) {
      console.error('Reprocess images error:', err);
      setDashboardUploadError(err instanceof Error ? err.message : 'Failed to reprocess images');
      setDashboardUploadStatus(null);
    } finally {
      setIsUploadingDashboardImage(false);
    }
  };

  // Show simple loading if no user (will redirect to login)
  if (isLoading || !user) {
    return (
      <>
        {/* Full screen loading overlay - covers everything including header and safe areas */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100dvh',
            zIndex: 99999,
            background: 'rgb(12, 12, 12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Glass shimmer background */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            {/* Glass base with corrugated effect */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `
                  radial-gradient(ellipse at center, rgb(40, 40, 40) 0%, rgb(12, 12, 12) 100%),
                  linear-gradient(45deg, rgba(10, 10, 10, 0.73), rgba(26, 26, 26, 0.83)),
                  repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255, 215, 0, 0.03) 2px, rgba(255, 215, 0, 0.03) 4px)
                `,
                filter: 'brightness(1.1) contrast(1.1) saturate(1.2)',
              }}
            />
            {/* Scan lines */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(255, 255, 255, 0.02) 2px,
                  rgba(255, 255, 255, 0.02) 4px
                )`,
                pointerEvents: 'none',
              }}
            />
            {/* Shimmer animation */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(
                  45deg,
                  rgba(255, 255, 255, 0.08) 0%,
                  rgba(255, 255, 255, 0.20) 25%,
                  rgba(255, 255, 255, 0.35) 50%,
                  rgba(255, 255, 255, 0.18) 75%,
                  rgba(255, 255, 255, 0.08) 100%
                )`,
                backgroundSize: '400% 400%',
                opacity: 0.5,
                mixBlendMode: 'overlay',
                animation: 'shimmerSlide 6s ease-in-out infinite',
              }}
            />
          </div>

          {/* Content - centered */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2rem',
            }}
          >
            {/* SAA Logo with breathing glow */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Breathing glow - centered behind logo */}
              <div
                style={{
                  position: 'absolute',
                  width: '280px',
                  height: '120px',
                  background: 'radial-gradient(ellipse at center, rgba(255, 215, 0, 0.5) 0%, rgba(255, 215, 0, 0.2) 40%, transparent 70%)',
                  filter: 'blur(25px)',
                  animation: 'breatheGlow 3s ease-in-out infinite',
                }}
              />
              {/* Logo */}
              <img
                src="/images/saa-logo-gold.png"
                alt="SAA Logo"
                style={{
                  position: 'relative',
                  zIndex: 1,
                  width: '200px',
                  height: 'auto',
                }}
              />
            </div>

            {/* Loading bar */}
            <div style={{ width: '200px' }}>
              <div
                style={{
                  position: 'relative',
                  height: '4px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '30%',
                    borderRadius: '2px',
                    background: 'linear-gradient(90deg, transparent 0%, #ffd700 50%, transparent 100%)',
                    animation: 'loadingSlide 1.5s ease-in-out infinite',
                    boxShadow: '0 0 10px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3)',
                  }}
                />
              </div>
            </div>

            {/* Loading message */}
            <p
              style={{
                fontSize: '0.875rem',
                color: 'rgba(255, 255, 255, 0.6)',
                letterSpacing: '0.05em',
                animation: 'messageFade 2s ease-in-out infinite',
              }}
            >
              Loading Portal...
            </p>
          </div>

          {/* Keyframe animations */}
          <style>{`
            @keyframes shimmerSlide {
              0%, 100% { background-position: 0% 50%; filter: brightness(1.1); }
              50% { background-position: 100% 50%; filter: brightness(1.8); }
            }
            @keyframes breatheGlow {
              0%, 100% { opacity: 0.6; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.2); }
            }
            @keyframes loadingSlide {
              0% { left: -30%; }
              100% { left: 100%; }
            }
            @keyframes messageFade {
              0%, 100% { opacity: 0.6; }
              50% { opacity: 1; }
            }
          `}</style>
        </div>
      </>
    );
  }

  return (
    <>
    {/* Loading Screen - Must be OUTSIDE main to not inherit visibility:hidden */}
    {showLoadingScreen && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100dvh',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isLoadingFadingOut ? 0 : 1,
          transition: 'opacity 0.8s ease-out',
          pointerEvents: isLoadingFadingOut ? 'none' : 'auto',
        }}
      >
        {/* Glass shimmer background - full screen */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {/* Glass base with corrugated effect */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `
                radial-gradient(ellipse at center, rgb(40, 40, 40) 0%, rgb(12, 12, 12) 100%),
                linear-gradient(45deg, rgba(10, 10, 10, 0.73), rgba(26, 26, 26, 0.83)),
                repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255, 215, 0, 0.03) 2px, rgba(255, 215, 0, 0.03) 4px)
              `,
              filter: 'brightness(1.1) contrast(1.1) saturate(1.2)',
            }}
          />
          {/* Scan lines */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(255, 255, 255, 0.02) 2px,
                rgba(255, 255, 255, 0.02) 4px
              )`,
              pointerEvents: 'none',
            }}
          />
          {/* Shimmer animation */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(
                45deg,
                rgba(255, 255, 255, 0.08) 0%,
                rgba(255, 255, 255, 0.20) 25%,
                rgba(255, 255, 255, 0.35) 50%,
                rgba(255, 255, 255, 0.18) 75%,
                rgba(255, 255, 255, 0.08) 100%
              )`,
              backgroundSize: '400% 400%',
              opacity: 0.5,
              mixBlendMode: 'overlay',
              animation: 'loadingShimmer 6s ease-in-out infinite',
            }}
          />
        </div>

        {/* Content - centered */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
          }}
        >
          {/* Logo with breathing glow */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Breathing glow behind logo */}
            <div
              style={{
                position: 'absolute',
                width: '280px',
                height: '140px',
                background: 'radial-gradient(ellipse at center, rgba(255, 215, 0, 0.4) 0%, rgba(255, 215, 0, 0.1) 40%, transparent 70%)',
                filter: 'blur(20px)',
                animation: 'loadingBreathe 3s ease-in-out infinite',
              }}
            />
            {/* SAA Logo */}
            <img
              src="/images/saa-logo-gold.png"
              alt="SAA Logo"
              style={{
                position: 'relative',
                width: '200px',
                height: 'auto',
              }}
            />
          </div>

          {/* Loading bar */}
          <div
            style={{
              width: '200px',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '2px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '30%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, #ffd700, transparent)',
                animation: 'loadingBar 1.5s ease-in-out infinite',
              }}
            />
          </div>

          {/* Loading message */}
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '14px',
              fontWeight: 300,
              letterSpacing: '0.1em',
              animation: 'loadingMessage 2s ease-in-out infinite',
            }}
          >
            Loading Portal...
          </p>
        </div>

        <style>{`
          @keyframes loadingShimmer {
            0% { background-position: 0% 0%; }
            50% { background-position: 100% 100%; }
            100% { background-position: 0% 0%; }
          }
          @keyframes loadingBreathe {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }
          @keyframes loadingBar {
            0% { left: -30%; }
            100% { left: 100%; }
          }
          @keyframes loadingMessage {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    )}

    <main
      id="main-content"
      className="agent-portal-root min-h-screen"
      style={{
        WebkitTapHighlightColor: 'transparent',
        // Hide content while loading screen is visible (prevents flash)
        visibility: (showLoadingScreen && !isLoadingFadingOut) ? 'hidden' : 'visible',
      } as React.CSSProperties}
    >
      {/* Global hidden file input for profile picture upload - shared by desktop and mobile */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,.jpg,.jpeg,.png,.gif,.webp"
        onChange={handleProfilePictureChange}
        className="hidden"
      />

      {/* Fixed Header Bar - Uses same glass styling as main site header */}
      {/* Slides up off screen when any popup is open, slides down on entry from login */}
      <header
        className="fixed left-0 right-0 z-[10010] transition-transform duration-500 ease-out"
        style={{
          background: 'transparent',
          overflow: 'visible',
          transform: isAnyPopupOpen
            ? 'translateY(-100%)'
            : 'translateY(0)',
          top: 0,
        }}
      >
        <div
          className="header-bg-container"
          style={{
            width: '100%',
            borderRadius: '0 0 20px 20px',
            borderBottom: '2px solid rgba(60, 60, 60, 0.8)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            position: 'relative',
          }}
        >
          {/* Glass Background - 3 layers from GlassShimmer.module.css */}
          <div className={glassStyles['glassContainer']}>
            <div className={glassStyles['glassBase']} />
            <div className={glassStyles['shimmerGradient']} />
          </div>

          <div className="flex items-center justify-between px-4 sm:px-8 relative z-10 h-16 md:h-[85px]">
            {/* SAA Logo - links to dashboard */}
            <button
              onClick={() => setActiveSection('dashboard')}
              className="flex-shrink-0 cursor-pointer"
              title="Go to Dashboard"
            >
              <img
                src="/images/saa-logo-gold.png"
                alt="Smart Agent Alliance"
                style={{
                  width: 'clamp(100px, calc(80px + 3vw), 140px)',
                  height: 'auto',
                }}
              />
            </button>

            {/* Desktop: AGENT PORTAL title - centered in header, uses H1 component styling */}
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
              <H1 className="whitespace-nowrap" style={{ fontSize: 'clamp(28px, calc(20px + 1.5vw), 48px)' }}>
                AGENT PORTAL
              </H1>
            </div>

            {/* Mobile: Section Title / Desktop: Logout Button */}
            <div className="flex items-center gap-3">
              {/* Mobile: Current section title */}
              <span className="md:hidden text-[#ffd700] font-semibold text-sm">
                {activeSection === 'dashboard' && 'Home'}
                {activeSection === 'support' && 'Get Support'}
                {activeSection === 'agent-page' && 'Agent Attraction'}
                {activeSection === 'linktree' && 'Linktree'}
                {activeSection === 'calls' && 'Team Calls'}
                {activeSection === 'courses' && 'Courses'}
                {activeSection === 'templates' && 'Templates'}
                {activeSection === 'production' && 'Production'}
                {activeSection === 'revshare' && 'RevShare'}
                {activeSection === 'exp-links' && 'eXp Links'}
                {activeSection === 'new-agents' && 'New Agents'}
                {activeSection === 'profile' && 'My Profile'}
              </span>
              {/* Desktop: Logout Button - uses button text size clamp from master controller */}
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-[#e5e4dd] hover:text-[#ff4444] hover:bg-[#ff4444]/10 border border-transparent hover:border-[#ff4444]/30 transition-all uppercase font-semibold"
                style={{
                  fontFamily: 'var(--font-taskor), Taskor, system-ui, sans-serif',
                  fontSize: 'clamp(17px, calc(15.36px + 0.55vw), 32px)',
                  letterSpacing: '0.05em',
                }}
              >
                <span>Logout</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>


      {/* Mobile Bottom Navigation - 3D button styling with separators */}
      <nav
        className="mobile-bottom-nav md:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{ WebkitTapHighlightColor: 'transparent', WebkitTouchCallout: 'none' } as React.CSSProperties}
      >
        {/* Solid background - edge to edge, no rounded corners */}
        <div className="absolute inset-0 bg-[#0a0a0a] border-t border-white/[0.08]" />

        <div
          className="relative flex items-center h-16 px-1"
          style={{ WebkitTapHighlightColor: 'transparent' } as React.CSSProperties}
        >
          {[
            { id: 'dashboard' as SectionId, label: 'Home', Icon: Home },
            { id: 'support' as SectionId, label: 'Support', Icon: LifeBuoy },
            { id: 'calls' as SectionId, label: 'Calls', Icon: Video },
            { id: 'linktree' as SectionId, label: 'Linktree', Icon: LinkIcon },
            { id: 'profile' as SectionId, label: 'Profile', Icon: User },
          ].map((item, index, arr) => {
            const isActive = activeSection === item.id;
            return (
              <div key={item.id} className="flex items-center flex-1 h-full">
                <button
                  onClick={() => setActiveSection(item.id)}
                  className="relative flex flex-col items-center justify-center w-full h-[52px] mx-0.5 rounded-lg transition-all duration-200"
                  style={{
                    WebkitTapHighlightColor: 'transparent',
                    background: isActive
                      ? 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)'
                      : 'linear-gradient(180deg, #151515 0%, #0a0a0a 100%)',
                    boxShadow: isActive
                      ? 'inset 0 1px 0 rgba(255,215,0,0.2), inset 0 -1px 2px rgba(0,0,0,0.5), 0 0 12px rgba(255,215,0,0.15)'
                      : 'inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 2px rgba(0,0,0,0.3)',
                    border: isActive ? '1px solid rgba(255,215,0,0.3)' : '1px solid rgba(255,255,255,0.08)',
                  } as React.CSSProperties}
                >
                  {/* Icon with glow effect when active */}
                  <div
                    className={`transition-all duration-200 ${isActive ? 'scale-110' : 'scale-100'}`}
                    style={{
                      filter: isActive ? 'drop-shadow(0 0 6px rgba(255,215,0,0.8))' : 'none',
                      color: isActive ? '#ffd700' : 'rgba(229,228,221,0.5)',
                    }}
                  >
                    <item.Icon className="w-5 h-5" />
                  </div>

                  {/* Label with glow effect when active */}
                  <span
                    className="text-[10px] font-medium mt-1 transition-all duration-200"
                    style={{
                      color: isActive ? '#ffd700' : 'rgba(229,228,221,0.5)',
                      textShadow: isActive ? '0 0 8px rgba(255,215,0,0.6)' : 'none',
                    }}
                  >
                    {item.label}
                  </span>
                </button>

                {/* Separator line between buttons (not after last) */}
                {index < arr.length - 1 && (
                  <div className="w-[1px] h-8 bg-white/10 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Main Dashboard Layout */}
      <div className="max-w-[2500px] mx-auto px-4 sm:px-8 md:px-12 pb-20 md:pb-8 pt-20 md:pt-28">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar Navigation - Desktop only */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-4">
              {/* User Profile Section */}
              <div className="rounded-xl p-4 border border-white/[0.08]">
                {/* Profile Picture */}
                <div className="flex flex-col items-center mb-4">
                  <button
                    onClick={handleProfilePictureClick}
                    className="relative group w-[130px] h-[130px] rounded-full overflow-hidden border-2 border-[#808080]/50 hover:border-[#ffd700]/50 transition-colors mb-3"
                    title="Click to change profile picture"
                  >
                    {user.profilePictureUrl && !profileImageError ? (
                      <>
                        {/* Loading spinner - shows while image is loading */}
                        {profileImageLoading && (
                          <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center z-10">
                            <div className="w-8 h-8 border-2 border-[#ffd700]/30 border-t-[#ffd700] rounded-full animate-spin" />
                          </div>
                        )}
                        <img
                          src={user.profilePictureUrl}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="eager"
                          decoding="async"
                          fetchPriority="high"
                          onLoad={() => setProfileImageLoading(false)}
                          onError={() => {
                            setProfileImageError(true);
                            setProfileImageLoading(false);
                          }}
                        />
                      </>
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

                  {/* Dashboard Upload Status */}
                  {dashboardUploadStatus && (
                    <div className="mt-3 p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                      <span className="truncate">{dashboardUploadStatus}</span>
                    </div>
                  )}
                  {dashboardUploadError && (
                    <div className="mt-3 p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                      {dashboardUploadError}
                    </div>
                  )}

                  {/* Edit Profile Button */}
                  <button
                    onClick={handleOpenEditProfile}
                    className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-[#e5e4dd]/80 hover:text-[#ffd700] bg-white/5 hover:bg-[#ffd700]/10 border border-white/[0.08] hover:border-[#ffd700]/30 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>

              {/* Navigation Menu - 3D Button Style, no container on desktop */}
              <nav className="md:space-y-1">
              {navItems.map((item, index) => {
                const IconComponent = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <div key={item.id}>
                    <button
                      onClick={() => {
                        setActiveSection(item.id);
                        setSidebarOpen(false);
                        // Trigger shake animation
                        setShakingItem(item.id);
                        setTimeout(() => setShakingItem(null), 300);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200"
                      style={{
                        background: isActive
                          ? 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)'
                          : 'linear-gradient(180deg, #151515 0%, #0a0a0a 100%)',
                        boxShadow: isActive
                          ? 'inset 0 1px 0 rgba(255,215,0,0.2), inset 0 -1px 2px rgba(0,0,0,0.5), 0 0 12px rgba(255,215,0,0.15)'
                          : 'inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 2px rgba(0,0,0,0.3)',
                        border: isActive ? '1px solid rgba(255,215,0,0.3)' : '1px solid rgba(255,255,255,0.08)',
                        ...(shakingItem === item.id ? { animation: 'shake 0.3s ease-in-out' } : {}),
                      }}
                    >
                      {/* Icon with glow effect when active */}
                      <div
                        className={`transition-all duration-200 ${isActive ? 'scale-110' : 'scale-100'}`}
                        style={{
                          filter: isActive ? 'drop-shadow(0 0 6px rgba(255,215,0,0.8))' : 'none',
                          color: isActive ? '#ffd700' : 'rgba(229,228,221,0.6)',
                        }}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      {/* Label with glow effect when active */}
                      <span
                        className="font-medium font-taskor text-sm transition-all duration-200"
                        style={{
                          color: isActive ? '#ffd700' : 'rgba(229,228,221,0.8)',
                          textShadow: isActive ? '0 0 8px rgba(255,215,0,0.6)' : 'none',
                        }}
                      >
                        {item.label}
                      </span>
                    </button>
                  </div>
                );
              })}
              </nav>

              {/* Download App Button - Only show when not running as PWA */}
              {!isRunningAsPWA && (
                <div className="mt-4 pt-4 border-t border-white/[0.08]">
                  <a
                    href="/download"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 hover:scale-[1.02]"
                    style={{
                      background: 'linear-gradient(180deg, #1a1a0a 0%, #0d0d05 100%)',
                      boxShadow: 'inset 0 1px 0 rgba(255,215,0,0.15), inset 0 -1px 2px rgba(0,0,0,0.3), 0 0 8px rgba(255,215,0,0.1)',
                      border: '1px solid rgba(255,215,0,0.2)',
                    }}
                  >
                    <div
                      style={{
                        filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.6))',
                        color: '#ffd700',
                      }}
                    >
                      <Download className="w-5 h-5" />
                    </div>
                    <span
                      className="font-medium font-taskor text-sm"
                      style={{
                        color: '#ffd700',
                        textShadow: '0 0 6px rgba(255,215,0,0.4)',
                      }}
                    >
                      Download App
                    </span>
                  </a>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content Area */}
          <div
            className="flex-1 min-w-0"
            style={{
              WebkitTapHighlightColor: 'transparent',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
            } as React.CSSProperties}
          >
            {/* Dashboard View */}
            {activeSection === 'dashboard' && (
              <DashboardView onNavigate={setActiveSection} />
            )}

            {/* Get Support */}
            {activeSection === 'support' && <SupportSection />}

            {/* Team Calls */}
            {activeSection === 'calls' && <TeamCallsSection userGender={user?.gender} isLeader={user?.isLeader} />}

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

            {/* Profile Section (Mobile) - Inline Edit Form */}
            {activeSection === 'profile' && (
              <div className="space-y-6 px-1 sm:px-2 pb-8">
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={handleProfilePictureClick}
                    className="relative group w-32 h-32 rounded-full overflow-hidden border-2 border-[#808080]/50 hover:border-[#ffd700] transition-colors"
                  >
                    {user.profilePictureUrl && !profileImageError ? (
                      <>
                        {/* Loading spinner - shows while image is loading */}
                        {profileImageLoading && (
                          <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center z-10">
                            <div className="w-8 h-8 border-2 border-[#ffd700]/30 border-t-[#ffd700] rounded-full animate-spin" />
                          </div>
                        )}
                        <img
                          src={user.profilePictureUrl}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="eager"
                          decoding="async"
                          fetchPriority="high"
                          onLoad={() => setProfileImageLoading(false)}
                          onError={() => {
                            setProfileImageError(true);
                            setProfileImageLoading(false);
                          }}
                        />
                      </>
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
                  <p className="mt-2 text-sm text-[#e5e4dd]/60">Tap to change photo</p>

                  {/* Upload Status */}
                  {dashboardUploadStatus && (
                    <div className="mt-3 p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs flex items-center gap-2 w-full">
                      <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                      <span className="truncate">{dashboardUploadStatus}</span>
                    </div>
                  )}
                  {dashboardUploadError && (
                    <div className="mt-3 p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs w-full">
                      {dashboardUploadError}
                    </div>
                  )}
                </div>

                {/* Edit Form */}
                <form onSubmit={handleEditProfileSubmit} className="space-y-5">
                  {/* Display Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#e5e4dd]/80 mb-2">
                      Display Name
                    </label>
                    <p className="text-xs text-[#e5e4dd]/50 mb-3">This name will appear on your Agent Attraction Page</p>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={editFormData.displayFirstName}
                        onChange={(e) => setEditFormData({ ...editFormData, displayFirstName: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] focus:border-[#ffd700]/50 focus:outline-none focus:ring-1 focus:ring-[#ffd700]/30 transition-colors"
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        value={editFormData.displayLastName}
                        onChange={(e) => setEditFormData({ ...editFormData, displayLastName: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] focus:border-[#ffd700]/50 focus:outline-none focus:ring-1 focus:ring-[#ffd700]/30 transition-colors"
                        placeholder="Last Name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-[#e5e4dd]/80 mb-2">
                      Email Address
                    </label>
                    <p className="text-xs text-[#e5e4dd]/50 mb-3">Used for login and communications</p>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] focus:border-[#ffd700]/50 focus:outline-none focus:ring-1 focus:ring-[#ffd700]/30 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Password Change Section */}
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-sm font-medium text-[#e5e4dd]/80 mb-4">Change Password (optional)</p>

                    {/* New Password */}
                    <div className="mb-4">
                      <label className="block text-sm text-[#e5e4dd]/60 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={editFormData.newPassword}
                          onChange={(e) => setEditFormData({ ...editFormData, newPassword: e.target.value })}
                          autoComplete="new-password"
                          className="w-full px-4 py-3 pr-12 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] focus:border-[#ffd700]/50 focus:outline-none focus:ring-1 focus:ring-[#ffd700]/30 transition-colors"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#e5e4dd]/50 hover:text-[#ffd700] transition-colors"
                          aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                        >
                          {showNewPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {/* Password requirements - only show when user starts typing */}
                      {editFormData.newPassword && (
                        <div className="text-xs text-[#e5e4dd]/50 space-y-1 pt-2">
                          <p className={editFormData.newPassword.length >= 8 ? 'text-green-400' : ''}>
                            {editFormData.newPassword.length >= 8 ? '✓' : '○'} At least 8 characters
                          </p>
                          <p className={/[A-Z]/.test(editFormData.newPassword) ? 'text-green-400' : ''}>
                            {/[A-Z]/.test(editFormData.newPassword) ? '✓' : '○'} One uppercase letter
                          </p>
                          <p className={/[a-z]/.test(editFormData.newPassword) ? 'text-green-400' : ''}>
                            {/[a-z]/.test(editFormData.newPassword) ? '✓' : '○'} One lowercase letter
                          </p>
                          <p className={/[0-9]/.test(editFormData.newPassword) ? 'text-green-400' : ''}>
                            {/[0-9]/.test(editFormData.newPassword) ? '✓' : '○'} One number
                          </p>
                          <p className={/[^A-Za-z0-9]/.test(editFormData.newPassword) ? 'text-green-400' : ''}>
                            {/[^A-Za-z0-9]/.test(editFormData.newPassword) ? '✓' : '○'} One special character
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label className="block text-sm text-[#e5e4dd]/60 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={editFormData.confirmPassword}
                          onChange={(e) => setEditFormData({ ...editFormData, confirmPassword: e.target.value })}
                          autoComplete="new-password"
                          className="w-full px-4 py-3 pr-12 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] focus:border-[#ffd700]/50 focus:outline-none focus:ring-1 focus:ring-[#ffd700]/30 transition-colors"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#e5e4dd]/50 hover:text-[#ffd700] transition-colors"
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {/* Password match indicator */}
                      {editFormData.confirmPassword && (
                        <p className={`text-xs pt-2 ${editFormData.newPassword === editFormData.confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
                          {editFormData.newPassword === editFormData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                        </p>
                      )}
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

                  {/* Save Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-xl text-black font-semibold bg-[#ffd700] hover:bg-[#ffe55c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>

                {/* Download App Button - Mobile only, hidden when running as PWA */}
                {!isRunningAsPWA && (
                  <a
                    href="/download"
                    className="md:hidden w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[#ffd700] bg-[#ffd700]/10 hover:bg-[#ffd700]/20 border border-[#ffd700]/30 hover:border-[#ffd700]/50 transition-all"
                  >
                    <Download className="w-5 h-5" />
                    <span className="font-medium">Download App</span>
                  </a>
                )}
              </div>
            )}

            {/* Agent Page Section - kept mounted to avoid re-loading */}
            <div className={activeSection === 'agent-page' ? '' : 'hidden'}>
              <AgentPagesSection
                user={user}
                setUser={setUser}
                contrastLevel={contrastLevel}
                setContrastLevel={setContrastLevel}
                applyBWContrastFilter={applyBWContrastFilter}
                originalImageFile={originalImageFile}
                setOriginalImageFile={setOriginalImageFile}
                setPendingImageFile={setPendingImageFile}
                setPendingImageUrl={setPendingImageUrl}
                setPendingImageDimensions={setPendingImageDimensions}
                setPreviewContrastLevel={setPreviewContrastLevel}
                setCropArea={setCropArea}
                setShowImageEditor={setShowImageEditor}
                setDashboardUploadStatus={setDashboardUploadStatus}
                setPendingBgRemovedUrl={setPendingBgRemovedUrl}
                setIsRemovingBackground={setIsRemovingBackground}
                setBgRemovalProgress={setBgRemovalProgress}
                setUploadSource={setUploadSource}
                attractionUploadStatus={attractionUploadStatus}
                attractionUploadError={attractionUploadError}
                setAttractionUploadStatus={setAttractionUploadStatus}
                setAttractionUploadError={setAttractionUploadError}
                initialTab="attraction"
                mode="agent-page"
                preloadedPageData={preloadedAgentPageData}
              />
            </div>

            {/* Linktree Section - kept mounted to avoid re-loading */}
            <div className={activeSection === 'linktree' ? '' : 'hidden'}>
              <AgentPagesSection
                user={user}
                setUser={setUser}
                contrastLevel={contrastLevel}
                setContrastLevel={setContrastLevel}
                applyBWContrastFilter={applyBWContrastFilter}
                originalImageFile={originalImageFile}
                setOriginalImageFile={setOriginalImageFile}
                setPendingImageFile={setPendingImageFile}
                setPendingImageUrl={setPendingImageUrl}
                setPendingImageDimensions={setPendingImageDimensions}
                setPreviewContrastLevel={setPreviewContrastLevel}
                setCropArea={setCropArea}
                setShowImageEditor={setShowImageEditor}
                setDashboardUploadStatus={setDashboardUploadStatus}
                setPendingBgRemovedUrl={setPendingBgRemovedUrl}
                setIsRemovingBackground={setIsRemovingBackground}
                setBgRemovalProgress={setBgRemovalProgress}
                setUploadSource={setUploadSource}
                attractionUploadStatus={attractionUploadStatus}
                attractionUploadError={attractionUploadError}
                setAttractionUploadStatus={setAttractionUploadStatus}
                setAttractionUploadError={setAttractionUploadError}
                initialTab="links"
                mode="linktree"
                preloadedPageData={preloadedAgentPageData}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto overscroll-contain"
          onClick={handleCloseEditProfile}
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black md:bg-black/90 md:backdrop-blur-md" />

          {/* Modal */}
          <div
            className="relative w-full max-w-md my-auto bg-[#151517] rounded-2xl border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto overscroll-contain"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#151517] rounded-t-2xl">
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
                  className="relative group w-[196px] h-[196px] rounded-full overflow-hidden border-2 border-[#808080]/50 hover:border-[#ffd700] transition-colors"
                >
                  {user.profilePictureUrl && !profileImageError ? (
                    <>
                      {/* Loading spinner - shows while image is loading */}
                      {profileImageLoading && (
                        <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center z-10">
                          <div className="w-10 h-10 border-2 border-[#ffd700]/30 border-t-[#ffd700] rounded-full animate-spin" />
                        </div>
                      )}
                      <img
                        src={user.profilePictureUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                        onLoad={() => setProfileImageLoading(false)}
                        onError={() => {
                          setProfileImageError(true);
                          setProfileImageLoading(false);
                        }}
                      />
                    </>
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

                {/* Dashboard Upload Status in Modal */}
                {dashboardUploadStatus && (
                  <div className="mt-3 p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs flex items-center gap-2 w-full">
                    <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    <span className="truncate">{dashboardUploadStatus}</span>
                  </div>
                )}
                {dashboardUploadError && (
                  <div className="mt-3 p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs w-full">
                    {dashboardUploadError}
                  </div>
                )}
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-[#e5e4dd]/80 mb-2">
                  Display Name
                </label>
                <p className="text-xs text-[#e5e4dd]/50 mb-3">This name will appear on your Agent Attraction Page</p>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={editFormData.displayFirstName}
                    onChange={(e) => setEditFormData({ ...editFormData, displayFirstName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] focus:border-[#ffd700]/50 focus:outline-none focus:ring-1 focus:ring-[#ffd700]/30 transition-colors"
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    value={editFormData.displayLastName}
                    onChange={(e) => setEditFormData({ ...editFormData, displayLastName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] focus:border-[#ffd700]/50 focus:outline-none focus:ring-1 focus:ring-[#ffd700]/30 transition-colors"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#e5e4dd]/80 mb-2">
                  Email Address
                </label>
                <p className="text-xs text-[#e5e4dd]/50 mb-3">Used for login and communications</p>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] focus:border-[#ffd700]/50 focus:outline-none focus:ring-1 focus:ring-[#ffd700]/30 transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              {/* Password Change Section */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-sm font-medium text-[#e5e4dd]/80 mb-4">Change Password (optional)</p>

                {/* New Password */}
                <div className="mb-4">
                  <label className="block text-sm text-[#e5e4dd]/60 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={editFormData.newPassword}
                      onChange={(e) => setEditFormData({ ...editFormData, newPassword: e.target.value })}
                      autoComplete="new-password"
                      className="w-full px-4 py-3 pr-12 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] focus:border-[#ffd700]/50 focus:outline-none focus:ring-1 focus:ring-[#ffd700]/30 transition-colors"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#e5e4dd]/50 hover:text-[#ffd700] transition-colors"
                      aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                    >
                      {showNewPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {/* Password requirements - only show when user starts typing */}
                  {editFormData.newPassword && (
                    <div className="text-xs text-[#e5e4dd]/50 space-y-1 pt-2">
                      <p className={editFormData.newPassword.length >= 8 ? 'text-green-400' : ''}>
                        {editFormData.newPassword.length >= 8 ? '✓' : '○'} At least 8 characters
                      </p>
                      <p className={/[A-Z]/.test(editFormData.newPassword) ? 'text-green-400' : ''}>
                        {/[A-Z]/.test(editFormData.newPassword) ? '✓' : '○'} One uppercase letter
                      </p>
                      <p className={/[a-z]/.test(editFormData.newPassword) ? 'text-green-400' : ''}>
                        {/[a-z]/.test(editFormData.newPassword) ? '✓' : '○'} One lowercase letter
                      </p>
                      <p className={/[0-9]/.test(editFormData.newPassword) ? 'text-green-400' : ''}>
                        {/[0-9]/.test(editFormData.newPassword) ? '✓' : '○'} One number
                      </p>
                      <p className={/[^A-Za-z0-9]/.test(editFormData.newPassword) ? 'text-green-400' : ''}>
                        {/[^A-Za-z0-9]/.test(editFormData.newPassword) ? '✓' : '○'} One special character
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm text-[#e5e4dd]/60 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={editFormData.confirmPassword}
                      onChange={(e) => setEditFormData({ ...editFormData, confirmPassword: e.target.value })}
                      autoComplete="new-password"
                      className="w-full px-4 py-3 pr-12 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] focus:border-[#ffd700]/50 focus:outline-none focus:ring-1 focus:ring-[#ffd700]/30 transition-colors"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#e5e4dd]/50 hover:text-[#ffd700] transition-colors"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {/* Password match indicator */}
                  {editFormData.confirmPassword && (
                    <p className={`text-xs pt-2 ${editFormData.newPassword === editFormData.confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
                      {editFormData.newPassword === editFormData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </p>
                  )}
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

      {/* Image Editor Modal */}
      {showImageEditor && pendingImageUrl && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-y-auto overscroll-contain"
          onClick={handleCancelImageEdit}
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black md:bg-black/90 md:backdrop-blur-md" />

          {/* Modal */}
          <div
            className="relative w-full max-w-lg my-auto bg-[#151517] rounded-2xl border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto overscroll-contain"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#151517] rounded-t-2xl">
              <div>
                <h2 className="text-lg font-semibold text-[#ffd700]">
                  Step {imageEditorStep}: {imageEditorStep === 1 ? 'Color Version' : 'B&W Version'}
                </h2>
                <p className="text-xs text-[#e5e4dd]/50 mt-0.5">
                  {imageEditorStep === 1
                    ? '(Used for Linktree when Color Photo is enabled)'
                    : '(Used for Agent Page and Linktree default)'}
                </p>
              </div>
              <button
                onClick={handleCancelImageEdit}
                className="p-2 rounded-lg text-[#e5e4dd]/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Step indicators */}
            <div className="flex justify-center gap-2 pt-3 px-4">
              <div className={`w-2 h-2 rounded-full transition-colors ${imageEditorStep === 1 ? 'bg-[#ffd700]' : 'bg-white/20'}`} />
              <div className={`w-2 h-2 rounded-full transition-colors ${imageEditorStep === 2 ? 'bg-[#ffd700]' : 'bg-white/20'}`} />
            </div>

            {/* Image Preview with Crop */}
            <div className="p-4">
              {/* Background removal progress indicator */}
              {isRemovingBackground && (
                <div className="mb-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <span>Removing background...</span>
                </div>
              )}

              <div
                ref={imageEditorRef}
                className="relative mx-auto rounded-lg overflow-hidden select-none"
                style={{
                  maxWidth: '400px',
                  aspectRatio: '1',
                  // Checkerboard pattern to show transparency
                  background: pendingBgRemovedUrl
                    ? 'repeating-conic-gradient(#2a2a2a 0% 25%, #1a1a1a 0% 50%) 50% / 20px 20px'
                    : '#000',
                  touchAction: 'none', // Prevent scroll while dragging on mobile
                }}
              >
                {/* Image with filter based on step: Color (step 1) or B&W (step 2) */}
                <img
                  src={pendingBgRemovedUrl || pendingImageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  style={{
                    filter: imageEditorStep === 1
                      ? `contrast(${colorContrastLevel}%)`
                      : `grayscale(100%) contrast(${bwContrastLevel}%)`,
                  }}
                  draggable={false}
                />

                {/* Crop overlay - darkens area outside the crop */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `
                      linear-gradient(to right, rgba(0,0,0,0.7) ${cropArea.x}%, transparent ${cropArea.x}%),
                      linear-gradient(to left, rgba(0,0,0,0.7) ${100 - cropArea.x - cropArea.size}%, transparent ${100 - cropArea.x - cropArea.size}%),
                      linear-gradient(to bottom, rgba(0,0,0,0.7) ${cropArea.y}%, transparent ${cropArea.y}%),
                      linear-gradient(to top, rgba(0,0,0,0.7) ${100 - cropArea.y - cropArea.size}%, transparent ${100 - cropArea.y - cropArea.size}%)
                    `,
                  }}
                />

                {/* Draggable crop border - only interactive in Step 1 */}
                <div
                  className={`absolute border-2 ${imageEditorStep === 1 ? 'border-[#ffd700] cursor-move' : 'border-[#e5e4dd]/30 cursor-not-allowed'}`}
                  style={{
                    left: `${cropArea.x}%`,
                    top: `${cropArea.y}%`,
                    width: `${cropArea.size}%`,
                    height: `${cropArea.size}%`,
                  }}
                  onMouseDown={(e) => {
                    if (imageEditorStep !== 1) return; // Locked in step 2
                    e.preventDefault();
                    const containerRect = imageEditorRef.current?.getBoundingClientRect();
                    if (!containerRect) return;

                    const startX = e.clientX;
                    const startY = e.clientY;
                    const startCropX = cropArea.x;
                    const startCropY = cropArea.y;

                    const handleMouseMove = (moveEvent: MouseEvent) => {
                      const deltaX = ((moveEvent.clientX - startX) / containerRect.width) * 100;
                      const deltaY = ((moveEvent.clientY - startY) / containerRect.height) * 100;
                      const maxPos = 100 - cropArea.size;

                      setCropArea(prev => ({
                        ...prev,
                        x: Math.max(0, Math.min(maxPos, startCropX + deltaX)),
                        y: Math.max(0, Math.min(maxPos, startCropY + deltaY)),
                      }));
                    };

                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };

                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                  onTouchStart={(e) => {
                    if (imageEditorStep !== 1) return; // Locked in step 2
                    const touch = e.touches[0];
                    const containerRect = imageEditorRef.current?.getBoundingClientRect();
                    if (!containerRect || !touch) return;

                    const startX = touch.clientX;
                    const startY = touch.clientY;
                    const startCropX = cropArea.x;
                    const startCropY = cropArea.y;

                    const handleTouchMove = (moveEvent: TouchEvent) => {
                      const moveTouch = moveEvent.touches[0];
                      if (!moveTouch) return;

                      const deltaX = ((moveTouch.clientX - startX) / containerRect.width) * 100;
                      const deltaY = ((moveTouch.clientY - startY) / containerRect.height) * 100;
                      const maxPos = 100 - cropArea.size;

                      setCropArea(prev => ({
                        ...prev,
                        x: Math.max(0, Math.min(maxPos, startCropX + deltaX)),
                        y: Math.max(0, Math.min(maxPos, startCropY + deltaY)),
                      }));
                    };

                    const handleTouchEnd = () => {
                      document.removeEventListener('touchmove', handleTouchMove);
                      document.removeEventListener('touchend', handleTouchEnd);
                    };

                    document.addEventListener('touchmove', handleTouchMove, { passive: false });
                    document.addEventListener('touchend', handleTouchEnd);
                  }}
                >
                  {/* Drag handle indicator in center - only show in step 1 */}
                  {imageEditorStep === 1 ? (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-8 h-8 rounded-full bg-[#ffd700]/20 border border-[#ffd700]/50 flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#ffd700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#e5e4dd]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-xs text-[#e5e4dd]/50 mt-3 text-center">
                {imageEditorStep === 1
                  ? 'Drag the crop area to reposition • Background removed automatically'
                  : 'Crop position locked from Step 1 • Adjust B&W contrast below'}
              </p>

              {/* Crop Size Slider - only in Step 1 */}
              {imageEditorStep === 1 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-[#e5e4dd]/80 mb-2">
                    Zoom: {cropArea.size}%
                    {minCropSizePercent < 100 && (
                      <span className="text-xs text-[#e5e4dd]/50 ml-2">(min {minCropSizePercent}% for 900px)</span>
                    )}
                  </label>
                  <input
                    type="range"
                    min={minCropSizePercent}
                    max="100"
                    value={cropArea.size}
                    onChange={(e) => {
                      const newSize = Number(e.target.value);
                      // Adjust position to keep crop within bounds
                      const maxPos = 100 - newSize;
                      setCropArea({
                        x: Math.min(cropArea.x, maxPos),
                        y: Math.min(cropArea.y, maxPos),
                        size: newSize,
                      });
                    }}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ffd700]"
                  />
                </div>
              )}

              {/* Contrast Slider - different for each step */}
              <div className={`mt-4 ${imageEditorStep === 1 ? 'pt-4 border-t border-white/10' : ''}`}>
                <label className="block text-sm font-medium text-[#e5e4dd]/80 mb-2">
                  {imageEditorStep === 1 ? 'Color Contrast' : 'B&W Contrast'}: {imageEditorStep === 1 ? colorContrastLevel : bwContrastLevel}%
                </label>
                <input
                  type="range"
                  min="80"
                  max="200"
                  value={imageEditorStep === 1 ? colorContrastLevel : bwContrastLevel}
                  onChange={(e) => {
                    if (imageEditorStep === 1) {
                      setColorContrastLevel(Number(e.target.value));
                    } else {
                      setBwContrastLevel(Number(e.target.value));
                    }
                  }}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ffd700]"
                />
              </div>
            </div>

            {/* Actions - Three buttons: Cancel | Next/Back | Upload */}
            <div className="flex gap-3 p-4 border-t border-white/10">
              <button
                type="button"
                onClick={handleCancelImageEdit}
                className="px-4 py-3 rounded-lg text-[#e5e4dd]/80 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (imageEditorStep === 1) {
                    setImageEditorStep(2);
                    setHasVisitedStep2(true);
                  } else {
                    setImageEditorStep(1);
                  }
                }}
                className="flex-1 px-4 py-3 rounded-lg text-[#e5e4dd] bg-white/10 hover:bg-white/20 border border-white/10 transition-colors"
              >
                {imageEditorStep === 1 ? 'Next →' : '← Back'}
              </button>
              {(imageEditorStep === 2 || hasVisitedStep2) && (
                <button
                  type="button"
                  onClick={handleConfirmImageEdit}
                  className="px-6 py-3 rounded-lg text-black font-semibold bg-[#ffd700] hover:bg-[#ffe55c] transition-all animate-in fade-in duration-300"
                >
                  Upload
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </main>
    </>
  );
}

// ============================================================================
// Dashboard View - Quick Access Cards
// ============================================================================
function DashboardView({ onNavigate }: { onNavigate: (id: SectionId) => void }) {
  // Separate cards by size for bento layout
  const heroCard = dashboardCards.find(c => c.size === 'hero');
  const featuredCards = dashboardCards.filter(c => c.size === 'featured');
  const standardCards = dashboardCards.filter(c => c.size === 'standard');
  const compactCards = dashboardCards.filter(c => c.size === 'compact');

  return (
    <div className="space-y-4 px-1 sm:px-2">
      {/* Hero Card - Get Support (most prominent) */}
      {heroCard && (
        <button
          onClick={() => onNavigate(heroCard.id)}
          className="w-full text-left group relative"
          style={{ WebkitTapHighlightColor: 'transparent' } as React.CSSProperties}
        >
          <div
            className={`
              relative p-5 sm:p-6 rounded-2xl
              bg-gradient-to-br ${heroCard.gradient || 'from-[#ffd700]/20 to-amber-600/10'}
              border-2 border-[#ffd700]/40
              transition-all duration-300 ease-out
              hover:border-[#ffd700]/70 hover:shadow-xl hover:shadow-[#ffd700]/20
              hover:scale-[1.01]
              group-active:scale-[0.99]
              overflow-hidden
            `}
            style={{ backgroundColor: 'rgba(10,10,10,0.95)' }}
          >
            {/* Animated glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#ffd700]/0 via-[#ffd700]/10 to-[#ffd700]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative flex items-center gap-4 sm:gap-6">
              {/* Icon container with gold glow */}
              <div className="relative p-4 sm:p-5 rounded-xl bg-[#ffd700]/10 border border-[#ffd700]/30 group-hover:border-[#ffd700]/50 group-hover:bg-[#ffd700]/15 transition-all duration-300">
                <Icon3D color="#ffd700">
                  <heroCard.icon className="w-8 h-8 sm:w-10 sm:h-10 text-[#ffd700] group-hover:scale-110 transition-transform duration-300" />
                </Icon3D>
              </div>

              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-[#ffd700] group-hover:text-[#ffe55c] transition-colors duration-300">
                  {heroCard.title}
                </h3>
                <p className="text-sm sm:text-base text-[#e5e4dd]/70 mt-1">
                  {heroCard.description}
                </p>
              </div>

              {/* Arrow indicator */}
              <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-[#ffd700]/10 group-hover:bg-[#ffd700]/20 transition-colors duration-300">
                <svg className="w-5 h-5 text-[#ffd700] group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </button>
      )}

      {/* Featured Cards Row - Large cards with gradients and custom accent colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {featuredCards.map((card) => {
          const IconComponent = card.icon;
          const accent = card.accentColor || '#ffd700';
          const isComingSoon = card.comingSoon;
          return (
            <button
              key={card.id}
              onClick={() => !isComingSoon && onNavigate(card.id)}
              className={`text-left group relative ${isComingSoon ? 'cursor-default' : ''}`}
              style={{ WebkitTapHighlightColor: 'transparent' } as React.CSSProperties}
              disabled={isComingSoon}
            >
              <div
                className={`
                  relative p-5 sm:p-6 rounded-2xl
                  bg-gradient-to-br ${card.gradient || 'from-white/10 to-white/5'}
                  transition-all duration-300 ease-out
                  ${isComingSoon ? '' : 'hover:scale-[1.02] group-active:scale-[0.98]'}
                  overflow-hidden
                `}
                style={{
                  backgroundColor: 'rgba(10,10,10,0.95)',
                  border: `1px solid ${isComingSoon ? '#666' : accent}30`,
                  boxShadow: `0 0 0 1px ${isComingSoon ? '#666' : accent}10`,
                  filter: isComingSoon ? 'grayscale(100%)' : 'none',
                  opacity: isComingSoon ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isComingSoon) {
                    e.currentTarget.style.border = `1px solid ${accent}60`;
                    e.currentTarget.style.boxShadow = `0 8px 32px ${accent}20`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isComingSoon) {
                    e.currentTarget.style.border = `1px solid ${accent}30`;
                    e.currentTarget.style.boxShadow = `0 0 0 1px ${accent}10`;
                  }
                }}
              >
                {/* Subtle shine effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />

                <div className="relative flex flex-col items-center text-center space-y-3">
                  {/* Icon container with accent color glow */}
                  <div
                    className="relative p-4 rounded-xl transition-all duration-300"
                    style={{
                      backgroundColor: `${isComingSoon ? '#666' : accent}15`,
                      border: `1px solid ${isComingSoon ? '#666' : accent}30`,
                    }}
                  >
                    <Icon3D color={isComingSoon ? '#666' : accent}>
                      <IconComponent className={`w-8 h-8 sm:w-10 sm:h-10 ${isComingSoon ? '' : 'group-hover:scale-110'} transition-transform duration-300`} />
                    </Icon3D>
                  </div>

                  <div className="space-y-1">
                    <h3
                      className="text-base sm:text-lg font-semibold transition-colors duration-300"
                      style={{ color: isComingSoon ? '#888' : accent }}
                    >
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#e5e4dd]/60 leading-snug">
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Coming Soon Overlay */}
                {isComingSoon && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40">
                    <span className="px-4 py-2 bg-black/70 rounded-full text-sm font-semibold text-white/90 border border-white/20">
                      Coming Soon
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Standard Cards Grid - 2x2 on mobile, 4 cols on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {standardCards.map((card) => {
          const IconComponent = card.icon;
          const accent = card.accentColor || '#ffd700';
          return (
            <button
              key={card.id}
              onClick={() => onNavigate(card.id)}
              className="text-left group"
              style={{ WebkitTapHighlightColor: 'transparent' } as React.CSSProperties}
            >
              <div
                className="
                  relative p-4 rounded-xl border border-white/10
                  transition-all duration-300 ease-out
                  hover:border-[#ffd700]/30 hover:shadow-md hover:shadow-[#ffd700]/5
                  hover:scale-[1.02]
                  group-active:scale-[0.98]
                  h-full
                "
                style={{ backgroundColor: 'rgba(20,20,20,0.95)' }}
              >
                <div className="flex flex-col items-center text-center space-y-2.5">
                  {/* Centered icon with subtle background */}
                  <div className="p-2.5 rounded-lg bg-[#ffd700]/5 group-hover:bg-[#ffd700]/10 transition-colors duration-300">
                    <Icon3D color={accent}>
                      <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform duration-300" />
                    </Icon3D>
                  </div>

                  <div className="space-y-0.5">
                    <h3 className="text-sm font-semibold text-[#e5e4dd] group-hover:text-[#ffd700] transition-colors duration-300 leading-tight">
                      {card.title}
                    </h3>
                    <p className="text-[11px] text-[#e5e4dd]/50 leading-tight hidden sm:block">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Compact Cards Row - 3 columns horizontal strip with equal heights */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {compactCards.map((card) => {
          const IconComponent = card.icon;
          const accent = card.accentColor || '#ffd700';
          return (
            <button
              key={card.id}
              onClick={() => onNavigate(card.id)}
              className="text-left group h-full"
              style={{ WebkitTapHighlightColor: 'transparent' } as React.CSSProperties}
            >
              <div
                className="
                  relative p-3 sm:p-4 rounded-lg border border-white/10
                  transition-all duration-300 ease-out
                  hover:border-[#ffd700]/30
                  hover:scale-[1.02]
                  group-active:scale-[0.98]
                  h-full flex flex-col justify-center
                "
                style={{ backgroundColor: 'rgba(15,15,15,0.95)' }}
              >
                <div className="flex flex-col items-center text-center space-y-1.5">
                  <Icon3D color={accent}>
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-300" />
                  </Icon3D>
                  <h3 className="text-xs sm:text-sm font-medium text-[#e5e4dd] group-hover:text-[#ffd700] transition-colors duration-300 leading-tight">
                    {card.title}
                  </h3>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// Support Section - Contact categories for different types of help
// ============================================================================
function SupportSection() {
  const supportCategories = [
    {
      id: 'saa-tech',
      title: 'SAA Tech Support',
      description: 'Issues with your SAA pages, portal, or tools',
      icon: Wrench,
      color: '#ffd700',
      contacts: [
        { type: 'Email', value: 'tech@smartagentalliance.com', href: 'mailto:tech@smartagentalliance.com' },
      ],
    },
    {
      id: 'saa-questions',
      title: 'SAA General Questions',
      description: 'Questions about Smart Agent Alliance, team resources, or training',
      icon: MessageCircleQuestion,
      color: '#00ff88',
      contacts: [
        { type: 'Email', value: 'support@smartagentalliance.com', href: 'mailto:support@smartagentalliance.com' },
      ],
    },
    {
      id: 'exp-tech',
      title: 'eXp Tech Support',
      description: 'Issues with eXp World, BoldTrail, Skyslope, or other eXp tools',
      icon: Headphones,
      color: '#3b82f6',
      contacts: [
        { type: 'eXp World', value: 'Visit Tech Support Room', href: null },
        { type: 'Email', value: 'techsupport@exprealty.com', href: 'mailto:techsupport@exprealty.com' },
      ],
    },
    {
      id: 'exp-general',
      title: 'eXp General Support',
      description: 'General questions about eXp policies, commissions, or benefits',
      icon: Building2,
      color: '#8b5cf6',
      contacts: [
        { type: 'eXp World', value: 'Visit Expert Care Room', href: null },
        { type: 'Email', value: 'agentsupport@exprealty.com', href: 'mailto:agentsupport@exprealty.com' },
      ],
    },
    {
      id: 'exp-broker',
      title: 'State Broker Questions',
      description: 'Production questions, transaction issues, or compliance matters',
      icon: Users,
      color: '#f59e0b',
      contacts: [
        { type: 'eXp World', value: "Visit Your State Broker's Room", href: null },
      ],
    },
  ];

  return (
    <div className="space-y-6 px-2 sm:px-4">
      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-sm sm:text-base text-[#e5e4dd]/70 max-w-2xl mx-auto">
          Find the right contact for your question. Click on a category below to see contact options.
        </p>
      </div>

      {/* Support Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {supportCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <div
              key={category.id}
              className="rounded-xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-white/20"
              style={{ backgroundColor: 'rgba(15,15,15,0.95)' }}
            >
              {/* Category Header */}
              <div
                className="p-4 flex items-center gap-3"
                style={{ borderBottom: `1px solid ${category.color}30` }}
              >
                <div
                  className="p-2.5 rounded-lg"
                  style={{ backgroundColor: `${category.color}15` }}
                >
                  <IconComponent
                    className="w-6 h-6"
                    style={{ color: category.color }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-semibold text-base"
                    style={{ color: category.color }}
                  >
                    {category.title}
                  </h3>
                  <p className="text-xs text-[#e5e4dd]/50 line-clamp-1">
                    {category.description}
                  </p>
                </div>
              </div>

              {/* Contact Options */}
              <div className="p-4 space-y-2">
                {category.contacts.map((contact, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2">
                    <span className="text-xs text-[#e5e4dd]/50">{contact.type}:</span>
                    {contact.href ? (
                      <a
                        href={contact.href}
                        className="text-sm text-[#e5e4dd] hover:text-[#ffd700] transition-colors truncate"
                      >
                        {contact.value}
                      </a>
                    ) : (
                      <span className="text-sm text-[#e5e4dd]/80 truncate">
                        {contact.value}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Tips */}
      <div className="mt-8 p-4 rounded-xl bg-[#ffd700]/5 border border-[#ffd700]/20">
        <h4 className="text-[#ffd700] font-semibold mb-3 flex items-center gap-2">
          <LifeBuoy className="w-5 h-5" />
          Quick Tips
        </h4>
        <ul className="space-y-2 text-sm text-[#e5e4dd]/70">
          <li className="flex items-start gap-2">
            <span className="text-[#ffd700]">•</span>
            <span>For eXp World issues, access eXp World and visit the appropriate support room</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#ffd700]">•</span>
            <span>Production questions should go to your State Broker first</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#ffd700]">•</span>
            <span>For SAA-specific tools and pages, contact SAA Tech Support</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// Team Calls Section
// ============================================================================
// Helper to convert PST time to user's local timezone
function formatTimeInLocalTimezone(hour: number, minute: number, dayOfWeek: string): string {
  // Convert a time in America/Los_Angeles (PST/PDT) to user's local timezone
  // This properly handles daylight saving time automatically

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const targetDayIndex = days.findIndex(d => d.toLowerCase().startsWith(dayOfWeek.toLowerCase().slice(0, 3)));

  // Find the next occurrence of this day
  const now = new Date();
  const currentDay = now.getDay();
  const daysUntilTarget = (targetDayIndex - currentDay + 7) % 7 || 7;

  // Create a date for the target day
  const targetDate = new Date(now);
  targetDate.setDate(targetDate.getDate() + daysUntilTarget);

  // Format date parts
  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');
  const hourStr = String(hour).padStart(2, '0');
  const minuteStr = String(minute).padStart(2, '0');

  // Use a trick: create an Intl formatter for LA timezone to find the UTC offset
  // Then we can create the correct UTC time
  const testDate = new Date(`${year}-${month}-${day}T12:00:00Z`);

  // Get LA timezone offset by comparing formatted times
  const laFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false
  });
  const utcFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'UTC',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false
  });

  const laStr = laFormatter.format(testDate);
  const utcStr = utcFormatter.format(testDate);

  // Parse hours from both
  const laHour = parseInt(laStr.split(', ')[1]?.split(':')[0] || '0');
  const utcHour = parseInt(utcStr.split(', ')[1]?.split(':')[0] || '0');

  // LA offset from UTC (negative means behind UTC)
  let offsetHours = laHour - utcHour;
  if (offsetHours > 12) offsetHours -= 24;
  if (offsetHours < -12) offsetHours += 24;

  // Create UTC time from LA time
  // If LA is at -8 (PST) or -7 (PDT), we add that many hours to get UTC
  const utcHourForCall = hour - offsetHours;
  const callTimeUTC = new Date(Date.UTC(year, targetDate.getMonth(), parseInt(day), utcHourForCall, minute, 0));

  // Format in user's local timezone
  return callTimeUTC.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short'
  });
}

function TeamCallsSection({ userGender, isLeader }: { userGender?: 'male' | 'female' | null; isLeader?: boolean | null }) {
  // Get times in user's local timezone
  const [localTimes, setLocalTimes] = useState<Record<string, string>>({});

  useEffect(() => {
    // Calculate local times on client side
    setLocalTimes({
      connor: formatTimeInLocalTimezone(8, 0, 'Monday'),
      mike: formatTimeInLocalTimezone(11, 0, 'Tuesday'),
      women: formatTimeInLocalTimezone(11, 0, 'Wednesday'),
      leaders: formatTimeInLocalTimezone(10, 0, 'Thursday'),
    });
  }, []);

  const showWomensCall = userGender === 'female';
  const showLeadersCall = isLeader === true;

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-4">
      <h3 className="text-lg sm:text-xl lg:text-h3 text-center font-semibold">Mastermind Calls</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        <GenericCard padding="sm">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl">📹</span>
              <h4 className="text-sm sm:text-base lg:text-h5 font-semibold text-[#ffd700] leading-tight">Connor Steinbrook Mastermind</h4>
            </div>
            <p className="text-xs sm:text-sm text-[#e5e4dd]/80">Mindset-based discussions and teachings</p>
            <p className="text-xs sm:text-sm text-[#e5e4dd]"><strong>Mondays</strong> at {localTimes.connor || '8:00 AM PST'}</p>
            <a
              href="https://zoom.us/j/4919666038?pwd=487789"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-[#ffd700]/10 border border-[#ffd700]/30 rounded-lg text-[#ffd700] text-xs sm:text-sm hover:bg-[#ffd700]/20 transition-colors"
              style={{ WebkitTapHighlightColor: 'transparent' } as React.CSSProperties}
            >
              Join Zoom Call
            </a>
            <p className="text-xs sm:text-sm text-[#e5e4dd]/70">Password: <span className="font-mono">487789</span></p>
          </div>
        </GenericCard>

        <GenericCard padding="sm">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl">📹</span>
              <h4 className="text-sm sm:text-base lg:text-h5 font-semibold text-[#00ff88] leading-tight">Mike Sherrard Mastermind</h4>
            </div>
            <p className="text-xs sm:text-sm text-[#e5e4dd]/80">Production-based discussions and teachings</p>
            <p className="text-xs sm:text-sm text-[#e5e4dd]"><strong>Tuesdays</strong> at {localTimes.mike || '11:00 AM PST'}</p>
            <a
              href="https://us02web.zoom.us/j/83687612648"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-lg text-[#00ff88] text-xs sm:text-sm hover:bg-[#00ff88]/20 transition-colors"
              style={{ WebkitTapHighlightColor: 'transparent' } as React.CSSProperties}
            >
              Join Zoom Call
            </a>
          </div>
        </GenericCard>

        {showWomensCall && (
          <GenericCard padding="sm">
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-2xl sm:text-3xl">👩</span>
                <h4 className="text-sm sm:text-base lg:text-h5 font-semibold text-[#ec4899] leading-tight">Women's Mastermind</h4>
              </div>
              <p className="text-xs sm:text-sm text-[#e5e4dd]/80">Exclusive call for women in the alliance</p>
              <p className="text-xs sm:text-sm text-[#e5e4dd]"><strong>Wednesdays</strong> at {localTimes.women || '11:00 AM PST'}</p>
              <a
                href="https://us06web.zoom.us/j/86896266944"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-[#ec4899]/10 border border-[#ec4899]/30 rounded-lg text-[#ec4899] text-xs sm:text-sm hover:bg-[#ec4899]/20 transition-colors"
                style={{ WebkitTapHighlightColor: 'transparent' } as React.CSSProperties}
              >
                Join Zoom Call
              </a>
            </div>
          </GenericCard>
        )}

        {showLeadersCall && (
          <GenericCard padding="sm">
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-2xl sm:text-3xl">👑</span>
                <h4 className="text-sm sm:text-base lg:text-h5 font-semibold text-[#ffd700] leading-tight">Leaders Mastermind</h4>
              </div>
              <p className="text-xs sm:text-sm text-[#e5e4dd]/80">Exclusive call for alliance leaders</p>
              <p className="text-xs sm:text-sm text-[#e5e4dd]"><strong>Thursdays</strong> at {localTimes.leaders || '10:00 AM PST'}</p>
              <a
                href="https://zoom.us/j/4919666038"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-[#ffd700]/10 border border-[#ffd700]/30 rounded-lg text-[#ffd700] text-xs sm:text-sm hover:bg-[#ffd700]/20 transition-colors"
                style={{ WebkitTapHighlightColor: 'transparent' } as React.CSSProperties}
              >
                Join Zoom Call
              </a>
              <p className="text-xs sm:text-sm text-[#e5e4dd]/70">Password: <span className="font-mono">487789</span></p>
            </div>
          </GenericCard>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Templates Section
// ============================================================================

// Helper: Extract Canva design ID and generate thumbnail URL
// Format icons for template cards (Canva thumbnail API no longer works - blocked by Cloudflare)
const FORMAT_ICONS: Record<string, string> = {
  Story: '📱',
  Square: '◻️',
  Wide: '🖼️',
  Carousel: '🎠',
  Flyer: '📄',
  Print: '🖨️',
  Brochure: '📖',
  Interactive: '🎯',
  Ad: '📣',
  Guide: '📚',
  Slides: '📊',
};

function getFormatIcon(format: string): string {
  return FORMAT_ICONS[format] || '🎨';
}

// Template data structure
interface Template {
  name: string;
  format: string;
  variant?: 'W' | 'B'; // White or Black theme
  url: string;
  preview?: string; // Preview image filename
}

// Combined template that groups W and B variants together
interface CombinedTemplate {
  name: string;
  format: string;
  // White variant
  urlW?: string;
  previewW?: string;
  // Black variant
  urlB?: string;
  previewB?: string;
  // For templates without variants
  url?: string;
  preview?: string;
}

interface TemplateCategory {
  id: string;
  label: string;
  icon: string;
  description: string;
  templates: Template[];
}

// Helper function to combine W/B variants into single entries
function combineTemplateVariants(templates: Template[]): CombinedTemplate[] {
  const combined: Map<string, CombinedTemplate> = new Map();

  for (const template of templates) {
    // Create a unique key based on name + format (but not variant)
    const key = `${template.name}-${template.format}`;

    if (!combined.has(key)) {
      combined.set(key, {
        name: template.name,
        format: template.format,
      });
    }

    const entry = combined.get(key)!;

    if (template.variant === 'W') {
      entry.urlW = template.url;
      entry.previewW = template.preview;
    } else if (template.variant === 'B') {
      entry.urlB = template.url;
      entry.previewB = template.preview;
    } else {
      // No variant - single template
      entry.url = template.url;
      entry.preview = template.preview;
    }
  }

  return Array.from(combined.values());
}

const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    id: 'new-listing',
    label: 'New Listing',
    icon: '🏠',
    description: 'Announce your new listings',
    templates: [
      { name: 'Story', format: 'Story', variant: 'W', preview: 'new-listing-story-w', url: 'https://www.canva.com/design/DAGY8fRazVA/AqNxJq9sXpqwXAPH4y8tXg/view?utm_content=DAGY8fRazVA&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Story', format: 'Story', variant: 'B', preview: 'new-listing-story-b', url: 'https://www.canva.com/design/DAGY8V-Dwu0/wtm_KEk7uaXJqHDp5APRjQ/view?utm_content=DAGY8V-Dwu0&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Square', format: 'Square', variant: 'W', preview: 'new-listing-square-w', url: 'https://www.canva.com/design/DAGYkkt2O44/aA7NyhWsP5QQdCetJSMUSQ/view?utm_content=DAGYkkt2O44&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Square', format: 'Square', variant: 'B', preview: 'new-listing-square-b', url: 'https://www.canva.com/design/DAGYiauChPM/ee1KE3N2m9DMnZEHOBiCqg/view?utm_content=DAGYiauChPM&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Wide', format: 'Wide', variant: 'W', preview: 'new-listing-wide-w', url: 'https://www.canva.com/design/DAGY8Lm44Zo/7HPZgn51JPWlv70ErP1AeA/view?utm_content=DAGY8Lm44Zo&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Wide', format: 'Wide', variant: 'B', preview: 'new-listing-wide-b', url: 'https://www.canva.com/design/DAGY8Cvopes/FcRy6gCzBi48cKr7uttcAA/view?utm_content=DAGY8Cvopes&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Carousel', format: 'Carousel', variant: 'W', preview: 'new-listing-carousel-w', url: 'https://www.canva.com/design/DAGY8FXv0WQ/CyljT4QVZ09jiwvCDEM8ww/view?utm_content=DAGY8FXv0WQ&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Carousel', format: 'Carousel', variant: 'B', preview: 'new-listing-carousel-b', url: 'https://www.canva.com/design/DAGY8ff2B3M/KzUnGG1CNE-nDaMJ9m_mVg/view?utm_content=DAGY8ff2B3M&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Flyer 1-Sided Cobranded', format: 'Flyer', variant: 'W', preview: 'new-listing-flyer-1sided-cobranded-w', url: 'https://www.canva.com/design/DAGZA8rgwfI/tAisgHFDbFetE6hU3OO_rg/view?utm_content=DAGZA8rgwfI&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Flyer 1-Sided Cobranded', format: 'Flyer', variant: 'B', preview: 'new-listing-flyer-1sided-cobranded-b', url: 'https://www.canva.com/design/DAGZBK2K2po/-0sn_Y5lE8xTYQhlPaGf1w/view?utm_content=DAGZBK2K2po&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Flyer 1-Sided', format: 'Flyer', variant: 'W', preview: 'new-listing-flyer-1sided-w', url: 'https://www.canva.com/design/DAGZA9fkjEM/QvrrgrVg3vVONx4RoCjLJw/view?utm_content=DAGZA9fkjEM&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Flyer 1-Sided', format: 'Flyer', variant: 'B', preview: 'new-listing-flyer-1sided-b', url: 'https://www.canva.com/design/DAGZA3l9wP0/KMx8ymAKhvRMPk6tm4ohMA/view?utm_content=DAGZA3l9wP0&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Flyer 2-Sided Cobranded', format: 'Flyer', variant: 'W', preview: 'new-listing-flyer-2sided-cobranded-w', url: 'https://www.canva.com/design/DAGZAzs5sl0/tiaFa_5UCtWWroEHkptJtw/view?utm_content=DAGZAzs5sl0&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Flyer 2-Sided Cobranded', format: 'Flyer', variant: 'B', preview: 'new-listing-flyer-2sided-cobranded-b', url: 'https://www.canva.com/design/DAGZA7FJICQ/ZZWd-8ITcHodf9VW9JyIJQ/view?utm_content=DAGZA7FJICQ&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Flyer 2-Sided', format: 'Flyer', variant: 'W', preview: 'new-listing-flyer-2sided-w', url: 'https://www.canva.com/design/DAGZA2WPeEU/-RBF7w4twEMwGjj5L6LaKw/view?utm_content=DAGZA2WPeEU&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Flyer 2-Sided', format: 'Flyer', variant: 'B', preview: 'new-listing-flyer-2sided-b', url: 'https://www.canva.com/design/DAGZA9JYnho/RFriMXQH_vhzFkxoMDgmLA/view?utm_content=DAGZA9JYnho&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Postcard', format: 'Print', variant: 'W', preview: 'new-listing-postcard-w', url: 'https://www.canva.com/design/DAGZBGjA9lU/-pR_-c2L-hLLSbaZBHa_9Q/view?utm_content=DAGZBGjA9lU&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Postcard Alt', format: 'Print', variant: 'W', preview: 'new-listing-postcard-alt-w', url: 'https://www.canva.com/design/DAGZBMs2k2c/aOQXCl38olqUQvywfd4l2Q/view?utm_content=DAGZBMs2k2c&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Brochure Option 1', format: 'Brochure', variant: 'W', preview: 'new-listing-brochure-1-w', url: 'https://www.canva.com/design/DAGZGgX4ewU/tKNO6nN5guJObfCLoq-nsw/view?utm_content=DAGZGgX4ewU&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Brochure Option 1', format: 'Brochure', variant: 'B', preview: 'new-listing-brochure-1-b', url: 'https://www.canva.com/design/DAGZG7Fhvas/HN3R6U5Hdf5PPaKiSP0yQg/view?utm_content=DAGZG7Fhvas&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Brochure Option 2', format: 'Brochure', variant: 'W', preview: 'new-listing-brochure-2-w', url: 'https://www.canva.com/design/DAGZGnDTnhU/y2JoxXYW5xB6T-43UwFzqw/view?utm_content=DAGZGnDTnhU&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Brochure Option 2', format: 'Brochure', variant: 'B', preview: 'new-listing-brochure-2-b', url: 'https://www.canva.com/design/DAGZGmjKdI0/K6ggDNNDKrIcxS9DVe2bGw/view?utm_content=DAGZGmjKdI0&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Brochure Option 3', format: 'Brochure', variant: 'W', preview: 'new-listing-brochure-3-w', url: 'https://www.canva.com/design/DAGZGqLoN2o/5GemAJm5AAwHcXva18V8pQ/view?utm_content=DAGZGqLoN2o&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Brochure Option 3', format: 'Brochure', variant: 'B', preview: 'new-listing-brochure-3-b', url: 'https://www.canva.com/design/DAGZGqpn97w/_f3dA6LCwWShuGHPrIzuZg/view?utm_content=DAGZGqpn97w&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Brochure Option 4', format: 'Brochure', variant: 'W', preview: 'new-listing-brochure-4-w', url: 'https://www.canva.com/design/DAGZGVcMwm0/0rLRvzFxlWJ-LWrgjg4L2A/view?utm_content=DAGZGVcMwm0&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Brochure Option 4', format: 'Brochure', variant: 'B', preview: 'new-listing-brochure-4-b', url: 'https://www.canva.com/design/DAGZGSYpnfw/MeFVMGCXVZ-Ok4dWYicwJA/view?utm_content=DAGZGSYpnfw&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
    ]
  },
  {
    id: 'open-house',
    label: 'Open House',
    icon: '🚪',
    description: 'Everything for your open house',
    templates: [
      { name: 'Sign-In Sheets', format: 'Print', preview: 'open-house-sign-in-sheets', url: 'https://www.canva.com/design/DAGiYencGxg/SL6_rJR3hFb9t7G477qPxg/view?utm_content=DAGiYencGxg&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
    ]
  },
  {
    id: 'just-sold',
    label: 'Just Sold',
    icon: '🎉',
    description: 'Celebrate your wins',
    templates: [
      { name: 'Under Contract Story', format: 'Story', variant: 'W', preview: 'just-sold-under-contract-story-w', url: 'https://www.canva.com/design/DAGYorjDUr8/mtimDGnh35hHUwdQcVhWdQ/view?utm_content=DAGYorjDUr8&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Under Contract Story', format: 'Story', variant: 'B', preview: 'just-sold-under-contract-story-b', url: 'https://www.canva.com/design/DAGYoFxPhd8/HVlnNq4N5g_SUL2pxOqU5w/view?utm_content=DAGYoFxPhd8&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Under Contract Wide', format: 'Wide', variant: 'W', preview: 'just-sold-under-contract-wide-w', url: 'https://www.canva.com/design/DAGYwquWFs4/82w_ihajb9JnqJjEEYfNCA/view?utm_content=DAGYwquWFs4&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Under Contract Wide', format: 'Wide', variant: 'B', preview: 'just-sold-under-contract-wide-b', url: 'https://www.canva.com/design/DAGYwvD7aZg/v0aj0ULJ-Fix-V_roBdMVA/view?utm_content=DAGYwvD7aZg&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Under Contract Square', format: 'Square', variant: 'W', preview: 'just-sold-under-contract-square-w', url: 'https://www.canva.com/design/DAGYw5elAAM/0_Xw4lMe5vps9HmTlcq-WQ/view?utm_content=DAGYw5elAAM&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Under Contract Square', format: 'Square', variant: 'B', preview: 'just-sold-under-contract-square-b', url: 'https://www.canva.com/design/DAGYxHgOLG4/kLxsbK5oGtbIxkftjZMSRg/view?utm_content=DAGYxHgOLG4&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Just Sold Testimonial Story', format: 'Story', variant: 'W', preview: 'just-sold-testimonial-story-w', url: 'https://www.canva.com/design/DAGY8gn68Oc/F_jb_NK8J_xc2qOgZcQMkQ/view?utm_content=DAGY8gn68Oc&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Just Sold Testimonial Story', format: 'Story', variant: 'B', preview: 'just-sold-testimonial-story-b', url: 'https://www.canva.com/design/DAGY8jLY3Cg/RBzPM7moaW4CrrOcuJ3t-A/view?utm_content=DAGY8jLY3Cg&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Just Sold Testimonial Square', format: 'Square', variant: 'W', preview: 'just-sold-testimonial-square-w', url: 'https://www.canva.com/design/DAGY8nIZPu8/P3dL_cJGYeLtqmVPIFXQ4Q/view?utm_content=DAGY8nIZPu8&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Just Sold Testimonial Square', format: 'Square', variant: 'B', preview: 'just-sold-testimonial-square-b', url: 'https://www.canva.com/design/DAGY8tpb8hY/xuAbY3mUiDscEurwennY4g/view?utm_content=DAGY8tpb8hY&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Just Sold Listing Story', format: 'Story', variant: 'W', preview: 'just-sold-listing-story-w', url: 'https://www.canva.com/design/DAGY8uxzoTU/wQvjlRDObiLKSiygqjgYww/view?utm_content=DAGY8uxzoTU&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Just Sold Listing Story', format: 'Story', variant: 'B', preview: 'just-sold-listing-story-b', url: 'https://www.canva.com/design/DAGY8ohevZw/csDzAeKkFKExdKXpnMK_Bw/view?utm_content=DAGY8ohevZw&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Just Sold Listing Square', format: 'Square', variant: 'W', preview: 'just-sold-listing-square-w', url: 'https://www.canva.com/design/DAGY8p2KTek/cFmUqTVdDH-3cFFEZ4C-SQ/view?utm_content=DAGY8p2KTek&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Just Sold Listing Square', format: 'Square', variant: 'B', preview: 'just-sold-listing-square-b', url: 'https://www.canva.com/design/DAGY8iAL5cI/wiOEaNAdLbW0Qj153zbdow/view?utm_content=DAGY8iAL5cI&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
    ]
  },
  {
    id: 'self-promo',
    label: 'Self Promo',
    icon: '⭐',
    description: 'Personal branding & testimonials',
    templates: [
      { name: 'Testimonial Wide', format: 'Wide', variant: 'W', preview: 'self-promo-testimonial-wide-w', url: 'https://www.canva.com/design/DAGZG9ZNSv8/kjABmfnlmjGElz2SdjTvHw/view?utm_content=DAGZG9ZNSv8&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Testimonial Wide', format: 'Wide', variant: 'B', preview: 'self-promo-testimonial-wide-b', url: 'https://www.canva.com/design/DAGZGyMhLl8/BCcUbjWFxa2UCXGOVyj0Gg/view?utm_content=DAGZGyMhLl8&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Testimonial Square', format: 'Square', variant: 'W', preview: 'self-promo-testimonial-square-w', url: 'https://www.canva.com/design/DAGZHEoBIJ4/W73p-1HUDIi1OD7gp9qKgQ/view?utm_content=DAGZHEoBIJ4&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Testimonial Square', format: 'Square', variant: 'B', preview: 'self-promo-testimonial-square-b', url: 'https://www.canva.com/design/DAGZGwnS6tM/qT1R6bp4dUO-pqLGnBlfFw/view?utm_content=DAGZGwnS6tM&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Testimonial Story', format: 'Story', variant: 'W', preview: 'self-promo-testimonial-story-w', url: 'https://www.canva.com/design/DAGZHFAya08/1QoTPITh_jFK7ZlNVY34pQ/view?utm_content=DAGZHFAya08&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Testimonial Story', format: 'Story', variant: 'B', preview: 'self-promo-testimonial-story-b', url: 'https://www.canva.com/design/DAGZHO8pnvc/6oPWhD1XnsFC_AvJySgzvA/view?utm_content=DAGZHO8pnvc&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Self Promo Square', format: 'Square', variant: 'W', preview: 'self-promo-square-w', url: 'https://www.canva.com/design/DAGY6jVW0ek/KCgA0kf1DT4umDho4fapwg/view?utm_content=DAGY6jVW0ek&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Self Promo Square', format: 'Square', variant: 'B', preview: 'self-promo-square-b', url: 'https://www.canva.com/design/DAGY6t2wkVE/JLZRGtoFU2U8s4Id7QrOmQ/view?utm_content=DAGY6t2wkVE&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Self Promo Wide', format: 'Wide', variant: 'W', preview: 'self-promo-wide-w', url: 'https://www.canva.com/design/DAGY6bONDl0/ibhKhqXZPkrPRIqYfBxfMA/view?utm_content=DAGY6bONDl0&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Self Promo Wide', format: 'Wide', variant: 'B', preview: 'self-promo-wide-b', url: 'https://www.canva.com/design/DAGY6iPwh0Y/o9zrMdUEnCywOqUVEIfPUA/view?utm_content=DAGY6iPwh0Y&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Self Promo Story', format: 'Story', variant: 'W', preview: 'self-promo-story-w', url: 'https://www.canva.com/design/DAGY6p0HboU/r8sNnAtwbK7TgIuddpZHAg/view?utm_content=DAGY6p0HboU&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Self Promo Story', format: 'Story', variant: 'B', preview: 'self-promo-story-b', url: 'https://www.canva.com/design/DAGY6sLEmFo/3E-w3zl8QEE4-tWMeSarFQ/view?utm_content=DAGY6sLEmFo&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Postcard 8.5x5.5', format: 'Print', variant: 'W', preview: 'self-promo-postcard-8.5x5.5-w', url: 'https://www.canva.com/design/DAGZBB_24UE/hNKTgs49R28NOrR-De0_FA/view?utm_content=DAGZBB_24UE&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Postcard 8.5x5.5', format: 'Print', variant: 'B', preview: 'self-promo-postcard-8.5x5.5-b', url: 'https://www.canva.com/design/DAGZBEECdck/8voOAU3gkZbiQRK04ROrpg/view?utm_content=DAGZBEECdck&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Postcard 5.5x4.25', format: 'Print', variant: 'W', preview: 'self-promo-postcard-5.5x4.25-w', url: 'https://www.canva.com/design/DAGZBP6xAME/R4ehD5amL3eIlsx5ydwfuQ/view?utm_content=DAGZBP6xAME&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Postcard 5.5x4.25', format: 'Print', variant: 'B', preview: 'self-promo-postcard-5.5x4.25-b', url: 'https://www.canva.com/design/DAGZBHmtit0/FPzHu12G8oZCDisQDRazrA/view?utm_content=DAGZBHmtit0&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
    ]
  },
  {
    id: 'engagement',
    label: 'Engagement',
    icon: '💬',
    description: 'Boost audience interaction',
    templates: [
      { name: 'This or That', format: 'Interactive', preview: 'engagement-this-or-that', url: 'https://www.canva.com/design/DAG9-31Bilg/k1JVE9ThGFrunUkHUAkj9A/view?utm_content=DAG9-31Bilg&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Market Snapshot Square', format: 'Square', variant: 'W', preview: 'engagement-market-snapshot-square-w', url: 'https://www.canva.com/design/DAGYozvRki4/Xce7VT38hQye9pwX4-Uitw/view?utm_content=DAGYozvRki4&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Market Snapshot Square', format: 'Square', variant: 'B', preview: 'engagement-market-snapshot-square-b', url: 'https://www.canva.com/design/DAGYo6OSECQ/CMlf2kTGYtOJDOKfsbFmlw/view?utm_content=DAGYo6OSECQ&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Market Snapshot Story', format: 'Story', variant: 'W', preview: 'engagement-market-snapshot-story-w', url: 'https://www.canva.com/design/DAGYpmfx9s4/ytj108rP4HiqBjTWbKjENg/view?utm_content=DAGYpmfx9s4&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Market Snapshot Story', format: 'Story', variant: 'B', preview: 'engagement-market-snapshot-story-b', url: 'https://www.canva.com/design/DAGYpkJH4p4/7azhbvS6GOlDN2HlSbhpNw/view?utm_content=DAGYpkJH4p4&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Facebook Ad', format: 'Ad', variant: 'W', preview: 'engagement-facebook-ad-w', url: 'https://www.canva.com/design/DAGYpiwO4ug/VUcW3LCzuSOPGNjY8HFn8A/view?utm_content=DAGYpiwO4ug&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Facebook Ad', format: 'Ad', variant: 'B', preview: 'engagement-facebook-ad-b', url: 'https://www.canva.com/design/DAGYpsUaDIg/3vOOoGBFg9Ba8WWFgT739w/view?utm_content=DAGYpsUaDIg&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
    ]
  },
  {
    id: 'inspiration',
    label: 'Inspiration',
    icon: '✨',
    description: 'Motivational content',
    templates: [
      { name: 'Inspirational Square', format: 'Square', preview: 'inspiration-square', url: 'https://www.canva.com/design/DAGiYYA8jhQ/VvrdLksT3_B-lET2ognZeg/view?utm_content=DAGiYYA8jhQ&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Inspirational Story', format: 'Story', preview: 'inspiration-story', url: 'https://www.canva.com/design/DAGiYesF_xY/dGErivOFGWrjBqmjkIRRbA/view?utm_content=DAGiYesF_xY&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
    ]
  },
  {
    id: 'buyer-seller',
    label: 'Buyer/Seller',
    icon: '📋',
    description: 'Presentations, guides & tips',
    templates: [
      { name: 'Seller Guide 8.5x11', format: 'Guide', preview: 'buyer-seller-guide-8.5x11', url: 'https://www.canva.com/design/DAGdm8zi7B4/NBRJkZgcGMteta3PePu4WQ/view?utm_content=DAGdm8zi7B4&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Seller Guide 11x8.5', format: 'Guide', preview: 'buyer-seller-guide-11x8.5', url: 'https://www.canva.com/design/DAGdnEdYt5k/ukBWlpNsBrA0D4aOmkgl_Q/view?utm_content=DAGdnEdYt5k&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Buyer Presentation 8.5x11', format: 'Slides', preview: 'buyer-seller-presentation-8.5x11', url: 'https://www.canva.com/design/DAGdoVQqZHs/jWnIzjcSSuyzJMIuvx5bVg/view?utm_content=DAGdoVQqZHs&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Buyer Presentation 11x8.5', format: 'Slides', preview: 'buyer-seller-presentation-11x8.5', url: 'https://www.canva.com/design/DAGdoyTS-0k/bQ1NK0QCqXfcp56p49HFGQ/view?utm_content=DAGdoyTS-0k&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Buyer Tips Story', format: 'Story', variant: 'W', preview: 'buyer-seller-tips-story-w', url: 'https://www.canva.com/design/DAGZfL9yo3M/0xjUydOG-bOETpQETonTNA/view?utm_content=DAGZfL9yo3M&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Buyer Tips Story', format: 'Story', variant: 'B', preview: 'buyer-seller-tips-story-b', url: 'https://www.canva.com/design/DAGZZbkeqEE/PY7o9jyruluaImo7sHouFg/view?utm_content=DAGZZbkeqEE&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Buyer Tips Square', format: 'Square', variant: 'W', preview: 'buyer-seller-tips-square-w', url: 'https://www.canva.com/design/DAGYpGJRHsk/i86ZBGgejRFw-fbwSVgnmw/view?utm_content=DAGYpGJRHsk&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Buyer Tips Square', format: 'Square', variant: 'B', preview: 'buyer-seller-tips-square-b', url: 'https://www.canva.com/design/DAGYpGcZuvc/lTWYCFjUFPRQ9FseVVSFyA/view?utm_content=DAGYpGcZuvc&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Buyer Tips Wide', format: 'Wide', variant: 'W', preview: 'buyer-seller-tips-wide-w', url: 'https://www.canva.com/design/DAGYqwYPV-k/XdDzXcgRvFC1PZmOY2KfRg/view?utm_content=DAGYqwYPV-k&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
      { name: 'Buyer Tips Wide', format: 'Wide', variant: 'B', preview: 'buyer-seller-tips-wide-b', url: 'https://www.canva.com/design/DAGYq_tzO3I/r8WAKRkVw013t_lNm1_fOg/view?utm_content=DAGYq_tzO3I&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
    ]
  },
  {
    id: 'newsletters',
    label: 'Newsletters',
    icon: '📰',
    description: 'Keep your sphere informed',
    templates: [
      { name: 'Monthly Statistics', format: 'Newsletter', preview: 'newsletter-monthly-statistics', url: 'https://www.canva.com/design/DAGiYW1qs5w/5JEnfUAxiYepG89s8PF-4A/view?utm_content=DAGiYW1qs5w&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
    ]
  },
  {
    id: 'branding',
    label: 'Branding',
    icon: '🎨',
    description: 'Custom frames & branding',
    templates: [
      { name: 'Custom Realtor Frames', format: 'Frame', preview: 'branding-custom-realtor-frames', url: 'https://www.canva.com/design/DAGdsVLZkWY/QCwmhNVeEp9wf_8lle2A_w/view?utm_content=DAGdsVLZkWY&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview' },
    ]
  },
];

// Template Card component with W/B toggle for combined variants
function TemplateCard({ template }: { template: CombinedTemplate }) {
  const hasVariants = !!(template.urlW && template.urlB);
  const [selectedVariant, setSelectedVariant] = useState<'W' | 'B'>('W');
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get current preview and URL based on selection
  const getCurrentPreview = () => {
    if (hasVariants) {
      return selectedVariant === 'W' ? template.previewW : template.previewB;
    }
    // Single variant or no variant - check what's available
    return template.previewW || template.previewB || template.preview;
  };

  const getCurrentUrl = () => {
    if (hasVariants) {
      return selectedVariant === 'W' ? template.urlW : template.urlB;
    }
    return template.urlW || template.urlB || template.url;
  };

  const currentPreview = getCurrentPreview();
  const currentUrl = getCurrentUrl();

  // Reset loaded state when variant changes
  useEffect(() => {
    setImageLoaded(false);
  }, [selectedVariant]);

  return (
    <div
      className="group rounded-xl overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-[#151515] border border-white/10 hover:border-[#ffd700]/40 transition-all hover:shadow-[0_0_20px_rgba(255,215,0,0.15)]"
      style={{ WebkitTapHighlightColor: 'transparent' } as React.CSSProperties}
    >
      {/* Template Preview Image */}
      <a
        href={currentUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative aspect-[7/6] bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] overflow-hidden"
        style={{ WebkitTapHighlightColor: 'transparent' } as React.CSSProperties}
      >
        {currentPreview ? (
          <img
            src={`https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/template-${currentPreview}/mobile`}
            srcSet={`
              https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/template-${currentPreview}/mobile 400w,
              https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/template-${currentPreview}/tablet 800w
            `}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            alt={template.name}
            className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
              {getFormatIcon(template.format)}
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#ffd700]/0 group-hover:bg-[#ffd700]/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="px-3 py-1.5 rounded-full bg-[#ffd700] text-black text-xs font-semibold flex items-center gap-1.5">
            Open in Canva
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </span>
        </div>
      </a>

      {/* Template Name and W/B Toggle */}
      <div className="px-3 py-2.5 flex items-center justify-between gap-2">
        <p className="text-[#e5e4dd]/80 truncate group-hover:text-[#ffd700] transition-colors flex-1" style={{ fontSize: '16px' }}>
          {template.name}
        </p>
        {/* W/B Toggle - only show if template has both variants */}
        {hasVariants && (
          <div
            className="flex gap-0.5 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVariant('W')}
              style={{ WebkitTapHighlightColor: 'transparent' } as React.CSSProperties}
              className={`w-5 h-5 rounded text-[10px] font-bold transition-all ${
                selectedVariant === 'W'
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white/50 hover:bg-white/20'
              }`}
            >
              W
            </button>
            <button
              onClick={() => setSelectedVariant('B')}
              style={{ WebkitTapHighlightColor: 'transparent' } as React.CSSProperties}
              className={`w-5 h-5 rounded text-[10px] font-bold transition-all ${
                selectedVariant === 'B'
                  ? 'bg-black text-white border border-white/30'
                  : 'bg-white/10 text-white/50 hover:bg-white/20'
              }`}
            >
              B
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function TemplatesSection() {
  const [activeCategory, setActiveCategory] = useState(TEMPLATE_CATEGORIES[0].id);

  const currentCategory = TEMPLATE_CATEGORIES.find(c => c.id === activeCategory) || TEMPLATE_CATEGORIES[0];

  // Combine W/B variants into single entries
  const combinedTemplates = useMemo(
    () => combineTemplateVariants(currentCategory.templates),
    [currentCategory.templates]
  );

  // No SectionWrapper - render directly to avoid container causing tap highlight issues
  return (
    <div className="space-y-6 px-2 sm:px-4">
      {/* Header */}
      <div className="text-center pb-2">
        <p className="text-sm text-[#e5e4dd]/60">
          Use your eXp credentials to access Canva templates
        </p>
      </div>

      {/* Category Buttons - Horizontal scroll on mobile, wrap on larger screens */}
      <div className="flex flex-wrap gap-2 justify-center">
        {TEMPLATE_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            style={{ WebkitTapHighlightColor: 'transparent' } as React.CSSProperties}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeCategory === category.id
                ? 'bg-[#ffd700] text-black shadow-lg shadow-[#ffd700]/20'
                : 'bg-black/40 border border-white/10 text-[#e5e4dd]/80 hover:border-[#ffd700]/30 hover:text-[#ffd700]'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Category Description */}
      <div className="text-center">
        <p className="text-sm text-[#e5e4dd]/50">{currentCategory.description}</p>
      </div>

      {/* Templates Grid - Now with combined cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {combinedTemplates.map((template, index) => (
          <TemplateCard key={`${template.name}-${template.format}-${index}`} template={template} />
        ))}
      </div>

      {/* Canva Login Reminder */}
      <div className="mt-6 p-4 rounded-xl bg-[#00c4cc]/10 border border-[#00c4cc]/20 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#00c4cc]/20 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-[#00c4cc]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#00c4cc]">Canva Access</p>
          <p className="text-xs text-[#e5e4dd]/60">Login with your eXp email to access and customize these templates</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Elite Courses Section
// ============================================================================
function CoursesSection() {
  return (
    <div className="space-y-4 sm:space-y-6 px-1 sm:px-2">
      <p className="text-center text-sm sm:text-base text-[#e5e4dd]/80 mb-4 sm:mb-8">Refer to Wolf Pack emails to find login details</p>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <GenericCard padding="sm" centered>
          <div className="text-center space-y-2 sm:space-y-4">
            <span className="text-3xl sm:text-4xl lg:text-5xl">🐺</span>
            <h3 className="text-sm sm:text-base lg:text-h5 font-semibold text-[#ffd700] leading-tight">Wolf Pack Skool Portal & HUB</h3>
            <p className="text-xs sm:text-sm text-[#e5e4dd]/70 hidden sm:block">Access the Wolfpack HUB in courses</p>
          </div>
        </GenericCard>

        <GenericCard padding="sm" centered>
          <div className="text-center space-y-2 sm:space-y-4">
            <span className="text-3xl sm:text-4xl lg:text-5xl">📱</span>
            <h3 className="text-sm sm:text-base lg:text-h5 font-semibold text-[#ffd700] leading-tight">Social Agent Academy</h3>
            <p className="text-xs sm:text-sm text-[#e5e4dd]/70 hidden sm:block">Learn how to dominate online</p>
          </div>
        </GenericCard>

        <GenericCard padding="sm" centered>
          <div className="text-center space-y-2 sm:space-y-4">
            <span className="text-3xl sm:text-4xl lg:text-5xl">🏠</span>
            <h3 className="text-sm sm:text-base lg:text-h5 font-semibold text-[#ffd700] leading-tight">Investor Army</h3>
            <p className="text-xs sm:text-sm text-[#e5e4dd]/70 hidden sm:block">Learn to flip houses</p>
          </div>
        </GenericCard>
      </div>
    </div>
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
    <div className="space-y-8 px-2 sm:px-4">
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
    <div className="space-y-6 px-2 sm:px-4">
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
  );
}

// ============================================================================
// eXp Links Section
// ============================================================================
function ExpLinksSection() {
  return (
    <div className="space-y-8 px-2 sm:px-4">
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
  );
}

// ============================================================================
// New Agents Section
// ============================================================================
function NewAgentsSection() {
  return (
    <div className="space-y-6 px-2 sm:px-4">
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
  );
}

// ============================================================================
// My Agent Pages Section
// ============================================================================

// Curated icon set for link buttons (Lucide icon names)
const LINK_ICONS = [
  { name: 'Home', label: 'Home', path: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10' },
  { name: 'Building', label: 'Building', path: 'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2 M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2 M10 6h4 M10 10h4 M10 14h4 M10 18h4' },
  { name: 'MapPin', label: 'Location', path: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' },
  { name: 'Phone', label: 'Phone', path: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' },
  { name: 'Mail', label: 'Email', path: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6' },
  { name: 'Calendar', label: 'Calendar', path: 'M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M16 2v4 M8 2v4 M3 10h18' },
  { name: 'Clock', label: 'Clock', path: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2' },
  { name: 'Video', label: 'Video', path: 'M23 7l-7 5 7 5V7z M14 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z' },
  { name: 'Camera', label: 'Camera', path: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
  { name: 'FileText', label: 'Document', path: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8' },
  { name: 'Download', label: 'Download', path: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3' },
  { name: 'ExternalLink', label: 'External Link', path: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6 M15 3h6v6 M10 14L21 3' },
  { name: 'Globe', label: 'Website', path: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' },
  { name: 'User', label: 'User', path: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
  { name: 'Users', label: 'Team', path: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75' },
  { name: 'Heart', label: 'Favorites', path: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' },
  { name: 'Star', label: 'Star', path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  { name: 'Award', label: 'Award', path: 'M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M8.21 13.89L7 23l5-3 5 3-1.21-9.12' },
  { name: 'TrendingUp', label: 'Growth', path: 'M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6' },
  { name: 'DollarSign', label: 'Dollar', path: 'M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
  { name: 'Key', label: 'Key', path: 'M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4' },
  { name: 'Search', label: 'Search', path: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35' },
  { name: 'MessageCircle', label: 'Message', path: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z' },
  { name: 'Send', label: 'Send', path: 'M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z' },
  { name: 'Bookmark', label: 'Bookmark', path: 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z' },
];

interface LinksSettings {
  accentColor: string;
  iconStyle: 'light' | 'dark';
  font: 'synonym' | 'taskor';
  bio: string;
  showColorPhoto: boolean; // false = B&W (default), true = full color on Linktree
  linkOrder: string[]; // Order of all links including default buttons (join-team, learn-about) and custom link IDs
}

const DEFAULT_LINKS_SETTINGS: LinksSettings = {
  accentColor: '#ffd700',
  iconStyle: 'light',
  font: 'synonym',
  bio: '',
  showColorPhoto: false, // B&W by default
  linkOrder: ['join-team', 'learn-about'], // Default order: default buttons first
};

// Default button definitions
const DEFAULT_BUTTONS = [
  { id: 'join-team', label: 'Join my Team', type: 'default' as const },
  { id: 'learn-about', label: 'Learn About my Team', type: 'default' as const },
];

interface CustomLink {
  id: string;
  label: string;
  url: string;
  icon?: string;
  order: number;
}

interface AgentPageData {
  id: string;
  slug: string;
  display_first_name: string;
  display_last_name: string;
  email: string;
  phone: string | null;
  show_call_button: boolean;
  show_text_button: boolean;
  profile_image_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
  linkedin_url: string | null;
  custom_links: CustomLink[];
  links_settings: LinksSettings;
  activated: boolean;
  activated_at: string | null;
}

// Tab types for agent pages section
type AgentPagesTabId = 'profile' | 'connect' | 'links' | 'attraction';

// Mode determines which UI to show - agent-page is info/preview focused, linktree is customization focused
type AgentPagesSectionMode = 'agent-page' | 'linktree';

interface AgentPagesSectionProps {
  user: UserData;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  contrastLevel: number;
  setContrastLevel: React.Dispatch<React.SetStateAction<number>>;
  applyBWContrastFilter: (imageSource: File | Blob, contrast: number) => Promise<Blob>;
  originalImageFile: File | null;
  setOriginalImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  // Image editor modal props
  setPendingImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  setPendingImageUrl: React.Dispatch<React.SetStateAction<string | null>>;
  setPendingImageDimensions: React.Dispatch<React.SetStateAction<{ width: number; height: number }>>;
  setPreviewContrastLevel: React.Dispatch<React.SetStateAction<number>>;
  setCropArea: React.Dispatch<React.SetStateAction<{ x: number; y: number; size: number }>>;
  setShowImageEditor: React.Dispatch<React.SetStateAction<boolean>>;
  setDashboardUploadStatus: React.Dispatch<React.SetStateAction<string | null>>;
  setPendingBgRemovedUrl: React.Dispatch<React.SetStateAction<string | null>>;
  setIsRemovingBackground: React.Dispatch<React.SetStateAction<boolean>>;
  setBgRemovalProgress: React.Dispatch<React.SetStateAction<number>>;
  setUploadSource: React.Dispatch<React.SetStateAction<'dashboard' | 'agent-pages' | null>>;
  attractionUploadStatus: string | null;
  attractionUploadError: string | null;
  setAttractionUploadStatus: React.Dispatch<React.SetStateAction<string | null>>;
  setAttractionUploadError: React.Dispatch<React.SetStateAction<string | null>>;
  initialTab?: AgentPagesTabId;
  mode?: AgentPagesSectionMode;
  preloadedPageData?: any; // Preloaded agent page data from loading screen
}

function AgentPagesSection({
  user,
  setUser,
  contrastLevel,
  setContrastLevel,
  applyBWContrastFilter,
  originalImageFile,
  setOriginalImageFile,
  setPendingImageFile,
  setPendingImageUrl,
  setPendingImageDimensions,
  setPreviewContrastLevel,
  setCropArea,
  setShowImageEditor,
  setDashboardUploadStatus,
  setPendingBgRemovedUrl,
  setIsRemovingBackground,
  setBgRemovalProgress,
  setUploadSource,
  attractionUploadStatus,
  attractionUploadError,
  setAttractionUploadStatus,
  setAttractionUploadError,
  initialTab = 'profile',
  mode = 'linktree',
  preloadedPageData,
}: AgentPagesSectionProps) {
  const [pageData, setPageData] = useState<AgentPageData | null>(preloadedPageData?.page || null);
  const [isLoading, setIsLoading] = useState(!preloadedPageData);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const attractionFileInputRef = useRef<HTMLInputElement>(null);

  // Form state - initialize from preloaded data if available
  const [formData, setFormData] = useState(() => {
    const page = preloadedPageData?.page;
    return {
      display_first_name: page?.display_first_name || '',
      display_last_name: page?.display_last_name || '',
      email: page?.email || '',
      phone: page?.phone || '',
      show_call_button: page?.show_call_button ?? true,
      show_text_button: page?.show_text_button ?? true,
      facebook_url: page?.facebook_url || '',
      instagram_url: page?.instagram_url || '',
      twitter_url: page?.twitter_url || '',
      youtube_url: page?.youtube_url || '',
      tiktok_url: page?.tiktok_url || '',
      linkedin_url: page?.linkedin_url || '',
    };
  });

  // Custom links state - initialize from preloaded data if available
  const [customLinks, setCustomLinks] = useState<CustomLink[]>(preloadedPageData?.page?.custom_links || []);
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkIcon, setNewLinkIcon] = useState<string | null>(null);
  const [showIconPicker, setShowIconPicker] = useState(false);

  // Links page global settings state - initialize from preloaded data if available
  const [linksSettings, setLinksSettings] = useState<LinksSettings>(preloadedPageData?.page?.links_settings || DEFAULT_LINKS_SETTINGS);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showStylesModal, setShowStylesModal] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  // Tab navigation state for new UI - uses initialTab from props
  const [activeTab, setActiveTab] = useState<AgentPagesTabId>(initialTab);

  // Copy link feedback state
  const [copiedLink, setCopiedLink] = useState<'linktree' | 'attraction' | null>(null);

  // Accordion expanded state
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    socialLinks: false,
    phoneSettings: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Count filled social links
  const filledSocialLinks = [
    formData.facebook_url,
    formData.instagram_url,
    formData.twitter_url,
    formData.youtube_url,
    formData.tiktok_url,
    formData.linkedin_url,
  ].filter(Boolean).length;

  // Helper to get color version URL from B&W URL
  // B&W: .../profiles/agent-page-xxx.png -> Color: .../profiles/agent-page-xxx-color.png
  const getColorImageUrl = (bwUrl: string | null | undefined): string | null => {
    if (!bwUrl) return null;
    // Insert '-color' before the file extension
    const match = bwUrl.match(/^(.+)\.(\w+)$/);
    if (match) {
      return `${match[1]}-color.${match[2]}`;
    }
    return bwUrl;
  };

  // Get the appropriate profile image URL based on color setting
  const getProfileImageUrl = (): string | null => {
    const baseUrl = pageData?.profile_image_url || user?.profilePictureUrl || null;
    if (!baseUrl) return null;
    if (linksSettings.showColorPhoto) {
      return getColorImageUrl(baseUrl);
    }
    return baseUrl;
  };

  // Auto-generate slug from display name
  const generatedSlug = `${formData.display_first_name}-${formData.display_last_name}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');

  // Update state when preloadedPageData becomes available (e.g., after initial mount)
  useEffect(() => {
    if (preloadedPageData?.page) {
      setPageData(preloadedPageData.page);
      setFormData({
        display_first_name: preloadedPageData.page.display_first_name || '',
        display_last_name: preloadedPageData.page.display_last_name || '',
        email: preloadedPageData.page.email || '',
        phone: preloadedPageData.page.phone || '',
        show_call_button: preloadedPageData.page.show_call_button ?? true,
        show_text_button: preloadedPageData.page.show_text_button ?? true,
        facebook_url: preloadedPageData.page.facebook_url || '',
        instagram_url: preloadedPageData.page.instagram_url || '',
        twitter_url: preloadedPageData.page.twitter_url || '',
        youtube_url: preloadedPageData.page.youtube_url || '',
        tiktok_url: preloadedPageData.page.tiktok_url || '',
        linkedin_url: preloadedPageData.page.linkedin_url || '',
      });
      setCustomLinks(preloadedPageData.page.custom_links || []);
      setLinksSettings(preloadedPageData.page.links_settings || DEFAULT_LINKS_SETTINGS);
      setIsLoading(false);
    }
  }, [preloadedPageData]);

  // Fetch agent page data - skip if we have preloaded data
  useEffect(() => {
    // If we have preloaded data, don't fetch again
    if (preloadedPageData) {
      return;
    }

    const fetchPageData = async () => {
      try {
        const token = localStorage.getItem('agent_portal_token');
        const response = await fetch(`https://saabuildingblocks.com/api/agent-pages/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.page) {
            setPageData(data.page);
            setFormData({
              display_first_name: data.page.display_first_name || '',
              display_last_name: data.page.display_last_name || '',
              email: data.page.email || '',
              phone: data.page.phone || '',
              show_call_button: data.page.show_call_button ?? true,
              show_text_button: data.page.show_text_button ?? true,
              facebook_url: data.page.facebook_url || '',
              instagram_url: data.page.instagram_url || '',
              twitter_url: data.page.twitter_url || '',
              youtube_url: data.page.youtube_url || '',
              tiktok_url: data.page.tiktok_url || '',
              linkedin_url: data.page.linkedin_url || '',
            });
            setCustomLinks(data.page.custom_links || []);
            setLinksSettings(data.page.links_settings || DEFAULT_LINKS_SETTINGS);
          }
        } else if (response.status === 404) {
          // No page exists yet - that's okay, they'll need to be added via GHL webhook
          setPageData(null);
        } else {
          setError('Failed to load attraction page data');
        }
      } catch (err) {
        console.error('Error fetching page data:', err);
        setError('Failed to load attraction page data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, [user.id, preloadedPageData]);

  // Listen for image update events from the parent component
  useEffect(() => {
    const handleImageUpdate = (event: CustomEvent<{ url: string }>) => {
      if (pageData) {
        setPageData(prev => prev ? { ...prev, profile_image_url: event.detail.url } : null);
      }
    };

    window.addEventListener('agent-page-image-updated', handleImageUpdate as EventListener);
    return () => {
      window.removeEventListener('agent-page-image-updated', handleImageUpdate as EventListener);
    };
  }, [pageData]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
    setSuccessMessage(null);
  };

  const handleSave = async () => {
    if (!pageData) return;

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem('agent_portal_token');
      const response = await fetch(`https://saabuildingblocks.com/api/agent-pages/${pageData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          slug: generatedSlug, // Auto-generated from display name
          custom_links: customLinks,
          links_settings: linksSettings,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPageData(data.page);
        setHasUnsavedChanges(false);
        setSuccessMessage('Changes saved successfully!');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to save changes');
      }
    } catch (err) {
      console.error('Error saving page data:', err);
      setError('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleActivate = async () => {
    if (!pageData) return;

    // Check for profile image
    if (!pageData.profile_image_url && !user.profilePictureUrl) {
      setError('Please upload a profile image before activating your page.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('agent_portal_token');

      // If using user's profile picture, sync it to agent page first
      if (!pageData.profile_image_url && user.profilePictureUrl) {
        await fetch(`https://saabuildingblocks.com/api/agent-pages/${pageData.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            profile_image_url: user.profilePictureUrl,
          }),
        });
      }

      const response = await fetch(`https://saabuildingblocks.com/api/agent-pages/${pageData.id}/activate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPageData(data.page);
        setSuccessMessage('Your attraction page is now live!');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to activate page');
      }
    } catch (err) {
      console.error('Error activating page:', err);
      setError('Failed to activate page. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Open image editor modal when user selects a file from attraction page section
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !pageData) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setAttractionUploadError('Please upload a JPG, PNG, or WebP image');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setAttractionUploadError('Image must be less than 5MB');
      return;
    }

    // Validate image dimensions (minimum 900x900)
    const img = new Image();
    const imageUrl = URL.createObjectURL(file);

    let dimensions: { width: number; height: number };
    try {
      dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = reject;
        img.src = imageUrl;
      });
    } catch {
      setAttractionUploadError('Failed to load image. Please try another file.');
      URL.revokeObjectURL(imageUrl);
      return;
    }

    URL.revokeObjectURL(imageUrl);

    if (dimensions.width < 900 || dimensions.height < 900) {
      setAttractionUploadError(`Image must be at least 900x900 pixels. Your image is ${dimensions.width}x${dimensions.height}.`);
      if (attractionFileInputRef.current) {
        attractionFileInputRef.current.value = '';
      }
      return;
    }

    // Open the image editor modal instead of uploading directly
    console.log('[ImageEditor] Opening editor modal from attraction page section');
    setUploadSource('agent-pages'); // Track that this came from agent pages section
    setPendingImageFile(file);
    const originalUrl = URL.createObjectURL(file);
    setPendingImageUrl(originalUrl);
    setPendingBgRemovedUrl(null); // Reset bg removed preview
    setPendingImageDimensions(dimensions);
    setPreviewContrastLevel(contrastLevel || 130);
    setCropArea({ x: 0, y: 0, size: 100 });
    setShowImageEditor(true);
    setAttractionUploadError(null);

    // Start background removal for preview
    setIsRemovingBackground(true);
    setBgRemovalProgress(0);
    try {
      const { removeBackground } = await import('@imgly/background-removal');
      const bgRemovedBlob = await removeBackground(file, {
        progress: (key: string, current: number, total: number) => {
          const progress = total > 0 ? Math.round((current / total) * 100) : 0;
          if (progress > 0) {
            setBgRemovalProgress(progress);
          }
        },
      });
      const bgRemovedUrl = URL.createObjectURL(bgRemovedBlob);
      setPendingBgRemovedUrl(bgRemovedUrl);
    } catch (bgErr) {
      console.error('[ImageEditor] Background removal failed:', bgErr);
      // Continue without bg removal preview - will still work on confirm
    } finally {
      setIsRemovingBackground(false);
    }
  };

  // Re-process existing images with new contrast level (from attraction page)
  const handleAttractionReprocessImages = async () => {
    if (!originalImageFile) {
      setAttractionUploadError('Please upload a new image first to adjust contrast. The original image is only available during the current session.');
      return;
    }

    setIsUploadingImage(true);
    setAttractionUploadError(null);
    setAttractionUploadStatus(null);

    try {
      const token = localStorage.getItem('agent_portal_token');

      // Step 1: Remove background from stored original
      setAttractionUploadStatus('Removing background...');
      const { removeBackground } = await import('@imgly/background-removal');

      const bgRemovedBlob = await removeBackground(originalImageFile, {
        progress: (key: string, current: number, total: number) => {
          const percent = total > 0 ? Math.round((current / total) * 100) : 0;
          if (percent > 0) {
            setAttractionUploadStatus(`Removing background... ${percent}%`);
          }
        },
      });

      // Step 2: Apply new B&W + contrast
      setAttractionUploadStatus('Applying new contrast level...');
      const processedBlob = await applyBWContrastFilter(bgRemovedBlob, contrastLevel);

      // Step 3: Upload to dashboard
      setAttractionUploadStatus('Updating dashboard...');
      const dashboardFormData = new FormData();
      dashboardFormData.append('file', processedBlob, 'profile.png');
      dashboardFormData.append('userId', user.id);

      const dashboardResponse = await fetch('https://saabuildingblocks.com/api/users/profile-picture', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: dashboardFormData,
      });

      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        // Apply toCdnUrl to use edge-cached CDN instead of origin
        const updatedUser = { ...user, profilePictureUrl: toCdnUrl(dashboardData.url) };
        setUser(updatedUser);
        localStorage.setItem('agent_portal_user', JSON.stringify(updatedUser));
      }

      // Step 4: Upload same to attraction page
      setAttractionUploadStatus('Updating attraction page...');
      if (pageData) {
        const attractionFormData = new FormData();
        attractionFormData.append('file', processedBlob, 'profile.png');
        attractionFormData.append('pageId', pageData.id);

        const response = await fetch('https://saabuildingblocks.com/api/agent-pages/upload-image', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: attractionFormData,
        });

        if (response.ok) {
          const data = await response.json();
          setPageData(data.data.page);
        }
      }

      setAttractionUploadStatus('Images updated successfully!');
      setTimeout(() => setAttractionUploadStatus(null), 3000);
    } catch (err) {
      console.error('Reprocess images error:', err);
      setAttractionUploadError(err instanceof Error ? err.message : 'Failed to reprocess images');
      setAttractionUploadStatus(null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  if (isLoading) {
    return (
      <div className="px-2 sm:px-4">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-[#ffd700]/30 border-t-[#ffd700] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Create page handler
  const handleCreatePage = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('agent_portal_token');
      const response = await fetch('https://saabuildingblocks.com/api/agent-pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.page) {
        setPageData(data.page);
        // Update form data with new page values
        setFormData({
          display_first_name: data.page.display_first_name || '',
          display_last_name: data.page.display_last_name || '',
          email: data.page.email || '',
          phone: data.page.phone || '',
          show_call_button: data.page.show_call_button ?? true,
          show_text_button: data.page.show_text_button ?? true,
          facebook_url: data.page.facebook_url || '',
          instagram_url: data.page.instagram_url || '',
          twitter_url: data.page.twitter_url || '',
          youtube_url: data.page.youtube_url || '',
          tiktok_url: data.page.tiktok_url || '',
          linkedin_url: data.page.linkedin_url || '',
        });
        setCustomLinks(data.page.custom_links || []);
        setLinksSettings(data.page.links_settings || {
          accentColor: '#ffd700',
          iconStyle: 'light',
          font: 'synonym',
          bio: '',
          showColorPhoto: false,
        });
        setSuccessMessage('Your page has been created! Start customizing it below.');
      } else if (response.status === 409) {
        // Page already exists - refresh to get it
        window.location.reload();
      } else {
        setError(data.error || 'Failed to create page');
      }
    } catch (err) {
      console.error('Error creating page:', err);
      setError('Failed to create page. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!pageData) {
    return (
      <div className="px-2 sm:px-4">
        <GenericCard padding="lg" centered>
          <div className="text-center space-y-4 py-8">
            <span className="text-6xl">🚀</span>
            <h3 className="text-h3 text-[#ffd700]">Create Your Pages</h3>
            <p className="text-body max-w-md mx-auto">
              Get started with your personalized Agent Attraction Page and Links page.
              Click below to create your pages and start customizing!
            </p>
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
            <button
              onClick={handleCreatePage}
              disabled={isSaving}
              className="px-6 py-3 rounded-lg font-semibold bg-[#ffd700] text-black hover:bg-[#ffe55c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Creating...' : 'Create My Pages'}
            </button>
          </div>
        </GenericCard>
      </div>
    );
  }

  // TODO: Change to smartagentalliance.com when domain migration is complete
  const pageUrl = `https://saabuildingblocks.pages.dev/${generatedSlug || pageData.slug}`;
  const linktreeUrl = `https://saabuildingblocks.pages.dev/${generatedSlug || pageData.slug}-links`;

  // ========================================================================
  // AGENT PAGE MODE - Simplified view for Agent Attraction Page
  // ========================================================================
  if (mode === 'agent-page') {
    return (
      <div className="space-y-6 px-2 sm:px-4">
        {/* Error/Success Messages */}
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
            {successMessage}
          </div>
        )}

        {/* Mobile-First Layout */}
        <div className="space-y-6">
          {/* Status Banner */}
          {pageData.activated ? (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-green-400 font-medium">Your Agent Attraction Page is live!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="text-sm text-yellow-400 font-medium">Complete your profile to activate</span>
            </div>
          )}

          {/* Copy Link Buttons - Mobile First */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(pageUrl);
                setCopiedLink('attraction');
                setTimeout(() => setCopiedLink(null), 2000);
              }}
              disabled={!pageData.activated}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] hover:bg-[#ffd700]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {copiedLink === 'attraction' ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy Attraction Page Link
                </>
              )}
            </button>
            {pageData.activated && (
              <a
                href={pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#ffd700]/5 border border-[#ffd700]/20 text-[#ffd700]/80 hover:bg-[#ffd700]/10 transition-colors text-sm font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Open Page
              </a>
            )}
          </div>

          {/* Preview Section */}
          <div className="rounded-xl bg-gradient-to-b from-[#0a0a0a] to-[#151515] border border-[#ffd700]/20 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 bg-black/30">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#ffd700]">Page Preview</span>
                <span className="text-xs text-[#e5e4dd]/50">Agent Attraction Page</span>
              </div>
            </div>
            <div className="relative w-full overflow-hidden" style={{ height: '500px' }}>
              {pageData.activated && (generatedSlug || pageData.slug) ? (
                <div className="flex justify-center pt-2 pb-4">
                  <div className="relative overflow-hidden rounded-lg" style={{ width: '100%', maxWidth: '280px', height: '480px' }}>
                    <iframe
                      src={pageUrl}
                      className="border-0 absolute top-0 left-0"
                      style={{
                        width: '390px',
                        height: '680px',
                        transform: 'scale(0.71)',
                        transformOrigin: 'top left',
                        pointerEvents: 'none',
                      }}
                      title="Attraction Page Preview"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <div className="w-16 h-16 rounded-full bg-[#ffd700]/10 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-[#ffd700]/60" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                  </div>
                  <p className="text-[#e5e4dd]/60 text-sm mb-2">Preview not available</p>
                  <p className="text-[#e5e4dd]/40 text-xs">Upload a profile image and activate your page to see the preview</p>
                </div>
              )}
            </div>
          </div>

          {/* How It Works Section */}
          <div className="p-5 rounded-xl bg-black/20 border border-[#ffd700]/10">
            <h3 className="text-lg font-medium text-[#ffd700] mb-4">How Your Pages Work Together</h3>
            <div className="space-y-4 text-sm text-[#e5e4dd]/80">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#22c55e]/20 border border-[#22c55e]/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#22c55e] font-bold text-xs">1</span>
                </div>
                <div>
                  <p className="font-medium text-[#e5e4dd] mb-1">Share Your Linktree Everywhere</p>
                  <p className="text-[#e5e4dd]/60 text-xs">Your Linktree is your <strong className="text-[#22c55e]">one link for everything</strong> - social media bios, email signatures, business cards.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#ffd700]/20 border border-[#ffd700]/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#ffd700] font-bold text-xs">2</span>
                </div>
                <div>
                  <p className="font-medium text-[#e5e4dd] mb-1">Built-In Agent Attraction</p>
                  <p className="text-[#e5e4dd]/60 text-xs">Your Attraction Page is linked from your Linktree. Competitors get curious and land on your recruitment funnel.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-[#e5e4dd] mb-1">Passive Agent Funnel</p>
                  <p className="text-[#e5e4dd]/60 text-xs">The funnel works in the background - no extra effort from you. Just share your Linktree and let it do both jobs.</p>
                </div>
              </div>
            </div>
          </div>

          {/* What Happens Section */}
          <div className="p-5 rounded-xl bg-black/20 border border-[#ffd700]/10">
            <h3 className="text-lg font-medium text-[#ffd700] mb-4">What Happens When Prospects Act</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-lg bg-[#ffd700]/5 border border-[#ffd700]/20">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#ffd700] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-medium text-[#e5e4dd] mb-1">When someone books a call</p>
                    <p className="text-[#e5e4dd]/60 text-xs"><strong className="text-[#ffd700]">SAA handles the closing</strong>. Joining is optional.</p>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <div>
                    <p className="font-medium text-[#e5e4dd] mb-1">When someone clicks Join</p>
                    <p className="text-[#e5e4dd]/60 text-xs">They enter <strong className="text-green-400">your name</strong> as sponsor. You get credit.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Where to Share */}
          <div className="p-5 rounded-xl bg-black/20 border border-[#ffd700]/10">
            <h3 className="text-lg font-medium text-[#ffd700] mb-3">Where to Share</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { icon: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z', label: 'Email signature' },
                { icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z', label: 'Social media bio' },
                { icon: 'M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z', label: 'Facebook groups' },
                { icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z', label: 'Business cards' },
                { icon: 'M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z', label: 'Direct messages' },
                { icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z', label: 'Presentations' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-[#e5e4dd]/70 p-2 rounded-lg bg-black/20">
                  <svg className="w-4 h-4 text-[#22c55e] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d={item.icon} />
                  </svg>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activate Button (if not activated) */}
          {!pageData.activated && (
            <button
              onClick={handleActivate}
              disabled={isSaving || hasUnsavedChanges || (!pageData.profile_image_url && !user.profilePictureUrl)}
              className="w-full px-5 py-3 rounded-xl font-medium bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title={
                hasUnsavedChanges
                  ? 'Save changes first'
                  : (!pageData.profile_image_url && !user.profilePictureUrl)
                    ? 'Upload a profile image first'
                    : 'Activate your page'
              }
            >
              Activate Your Pages
            </button>
          )}
        </div>
      </div>
    );
  }

  // ========================================================================
  // LINKTREE MODE - Full customization interface
  // ========================================================================
  return (
    <div className="space-y-6 px-2 sm:px-4">
      {/* Error/Success Messages */}
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
            {successMessage}
          </div>
        )}

        {/* Desktop: 2-column layout with sticky preview. Mobile: settings only + floating preview button */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] xl:grid-cols-[1fr_260px] gap-6">

          {/* PREVIEW COLUMN - Desktop only, sticky on right */}
          <div className="hidden lg:block lg:col-start-2 lg:row-start-1 lg:row-span-4">
            <div className="sticky top-4">
            <div className="rounded-xl bg-gradient-to-b from-[#0a0a0a] to-[#151515] border border-white/10 overflow-hidden">
              {/* Preview Header */}
              <div className="px-4 py-3 border-b border-white/10 bg-black/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#e5e4dd]/50 uppercase tracking-wider">Live Preview</span>
                  <span className="text-xs text-[#22c55e]">Linktree</span>
                </div>
              </div>

              {/* Preview Content - Linktree preview with star background */}
              <div className="p-3 pb-4 relative overflow-hidden">
                  {/* Static star dots for preview */}
                  <div className="absolute inset-0 pointer-events-none" style={{
                    background: `
                      radial-gradient(1px 1px at 20px 30px, white, transparent),
                      radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.8), transparent),
                      radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.6), transparent),
                      radial-gradient(1px 1px at 130px 80px, white, transparent),
                      radial-gradient(1px 1px at 160px 30px, rgba(255,255,255,0.7), transparent),
                      radial-gradient(0.5px 0.5px at 70px 100px, rgba(255,255,255,0.5), transparent),
                      radial-gradient(0.5px 0.5px at 100px 150px, rgba(255,255,255,0.4), transparent),
                      radial-gradient(1px 1px at 50px 200px, rgba(255,255,255,0.6), transparent),
                      radial-gradient(0.5px 0.5px at 180px 120px, rgba(255,255,255,0.5), transparent),
                      radial-gradient(1px 1px at 25px 280px, rgba(255,255,255,0.7), transparent),
                      radial-gradient(0.5px 0.5px at 140px 250px, rgba(255,255,255,0.4), transparent),
                      radial-gradient(1px 1px at 80px 320px, rgba(255,255,255,0.6), transparent)
                    `,
                    opacity: 0.6
                  }} />
                  {/* Linktree Preview */}
                  <div className="flex flex-col items-center gap-3 max-w-[180px] mx-auto relative z-10">
                    {/* Profile Photo */}
                    <div
                      className="w-16 h-16 rounded-full border-2 flex items-center justify-center overflow-hidden"
                      style={{ borderColor: linksSettings.accentColor, backgroundColor: 'rgba(0,0,0,0.5)' }}
                    >
                      {getProfileImageUrl() ? (
                        <img
                          src={getProfileImageUrl() || ''}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">👤</span>
                      )}
                    </div>

                    {/* Name with Neon Effect - matches H1 glow framework from master controller */}
                    <span
                      className="font-bold text-sm text-center"
                      style={{
                        color: linksSettings.accentColor,
                        fontFamily: 'var(--font-taskor, sans-serif)',
                        fontFeatureSettings: '"ss01" 1',
                        transform: 'perspective(800px) rotateX(12deg)',
                        textShadow: `
                          /* WHITE CORE */
                          0 0 0.01em #fff,
                          0 0 0.02em #fff,
                          0 0 0.03em rgba(255,255,255,0.8),
                          /* COLOR GLOW */
                          0 0 0.05em ${linksSettings.accentColor},
                          0 0 0.09em ${linksSettings.accentColor}cc,
                          0 0 0.13em ${linksSettings.accentColor}8c,
                          0 0 0.18em ${linksSettings.accentColor}59,
                          /* METAL BACKING */
                          0.03em 0.03em 0 #2a2a2a,
                          0.045em 0.045em 0 #1a1a1a,
                          0.06em 0.06em 0 #0f0f0f,
                          0.075em 0.075em 0 #080808
                        `,
                        filter: `drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em ${linksSettings.accentColor}40)`,
                      }}
                    >
                      {formData.display_first_name || 'Your'} {formData.display_last_name || 'Name'}
                    </span>

                    {/* Bio */}
                    {linksSettings.bio && (
                      <p className="text-xs text-center text-[#e5e4dd]/70" style={{ fontFamily: 'var(--font-synonym, sans-serif)' }}>
                        {linksSettings.bio.slice(0, 80)}{linksSettings.bio.length > 80 ? '...' : ''}
                      </p>
                    )}

                    {/* Social Icons - Compact */}
                    {filledSocialLinks > 0 && (
                      <div className="flex gap-1.5 flex-wrap justify-center">
                        {formData.facebook_url && (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${linksSettings.accentColor}20`, border: `1px solid ${linksSettings.accentColor}40` }}>
                            <svg className="w-2.5 h-2.5" fill={linksSettings.accentColor} viewBox="0 0 24 24"><path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z"/></svg>
                          </div>
                        )}
                        {formData.instagram_url && (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${linksSettings.accentColor}20`, border: `1px solid ${linksSettings.accentColor}40` }}>
                            <svg className="w-2.5 h-2.5" fill={linksSettings.accentColor} viewBox="0 0 24 24"><path d="M12,2.16c3.2,0,3.58.01,4.85.07,3.25.15,4.77,1.69,4.92,4.92.06,1.27.07,1.65.07,4.85s-.01,3.58-.07,4.85c-.15,3.23-1.66,4.77-4.92,4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.38,3.92,3.9,2.38,7.15,2.23,8.42,2.18,8.8,2.16,12,2.16ZM12,0C8.74,0,8.33.01,7.05.07,2.7.27.27,2.7.07,7.05.01,8.33,0,8.74,0,12s.01,3.67.07,4.95c.2,4.36,2.62,6.78,6.98,6.98,1.28.06,1.69.07,4.95.07s3.67-.01,4.95-.07c4.35-.2,6.78-2.62,6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.63-6.78-6.98-6.98C15.67.01,15.26,0,12,0Zm0,5.84A6.16,6.16,0,1,0,18.16,12,6.16,6.16,0,0,0,12,5.84ZM12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16ZM18.41,4.15a1.44,1.44,0,1,0,1.44,1.44A1.44,1.44,0,0,0,18.41,4.15Z"/></svg>
                          </div>
                        )}
                        {formData.twitter_url && (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${linksSettings.accentColor}20`, border: `1px solid ${linksSettings.accentColor}40` }}>
                            <svg className="w-2.5 h-2.5" fill={linksSettings.accentColor} viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                          </div>
                        )}
                        {formData.youtube_url && (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${linksSettings.accentColor}20`, border: `1px solid ${linksSettings.accentColor}40` }}>
                            <svg className="w-2.5 h-2.5" fill={linksSettings.accentColor} viewBox="0 0 24 24"><path d="M23.5,6.19a3.02,3.02,0,0,0-2.12-2.14C19.53,3.5,12,3.5,12,3.5s-7.53,0-9.38.55A3.02,3.02,0,0,0,.5,6.19,31.62,31.62,0,0,0,0,12a31.62,31.62,0,0,0,.5,5.81,3.02,3.02,0,0,0,2.12,2.14c1.85.55,9.38.55,9.38.55s7.53,0,9.38-.55a3.02,3.02,0,0,0,2.12-2.14A31.62,31.62,0,0,0,24,12,31.62,31.62,0,0,0,23.5,6.19ZM9.55,15.5V8.5L15.82,12Z"/></svg>
                          </div>
                        )}
                        {formData.tiktok_url && (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${linksSettings.accentColor}20`, border: `1px solid ${linksSettings.accentColor}40` }}>
                            <svg className="w-2.5 h-2.5" fill={linksSettings.accentColor} viewBox="0 0 24 24"><path d="M19.59,6.69a4.83,4.83,0,0,1-3.77-4.25V2h-3.45V15.94a2.91,2.91,0,0,1-2.91,2.91,2.87,2.87,0,0,1-1.49-.42,2.91,2.91,0,0,1,1.49-5.4,2.81,2.81,0,0,1,.89.14V9.66a6.27,6.27,0,0,0-.89-.07A6.36,6.36,0,0,0,3.09,16a6.36,6.36,0,0,0,10.91,4.44V13.47a8.16,8.16,0,0,0,4.77,1.53h.82V11.55a4.83,4.83,0,0,1-4-4.86Z"/></svg>
                          </div>
                        )}
                        {formData.linkedin_url && (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${linksSettings.accentColor}20`, border: `1px solid ${linksSettings.accentColor}40` }}>
                            <svg className="w-2.5 h-2.5" fill={linksSettings.accentColor} viewBox="0 0 24 24"><path d="M20.45,20.45H16.89V14.88c0-1.33,0-3.04-1.85-3.04s-2.14,1.45-2.14,2.94v5.66H9.34V9h3.41v1.56h.05a3.74,3.74,0,0,1,3.37-1.85c3.6,0,4.27,2.37,4.27,5.46v6.28ZM5.34,7.43A2.07,2.07,0,1,1,7.41,5.36,2.07,2.07,0,0,1,5.34,7.43Zm1.78,13H3.56V9H7.12ZM22.22,0H1.77A1.75,1.75,0,0,0,0,1.73V22.27A1.75,1.75,0,0,0,1.77,24H22.22A1.76,1.76,0,0,0,24,22.27V1.73A1.76,1.76,0,0,0,22.22,0Z"/></svg>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Contact Icon Buttons Row - Email, Call, Text */}
                    {(formData.email || (formData.phone && (formData.show_call_button || formData.show_text_button))) && (
                      <div className="flex gap-2 justify-center">
                        {/* Email Button */}
                        {formData.email && (
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                            style={{ backgroundColor: linksSettings.accentColor }}
                            title="Email"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke={linksSettings.iconStyle === 'light' ? '#ffffff' : '#1a1a1a'} strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        {/* Call Button */}
                        {formData.phone && formData.show_call_button && (
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                            style={{ backgroundColor: linksSettings.accentColor }}
                            title="Call"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke={linksSettings.iconStyle === 'light' ? '#ffffff' : '#1a1a1a'} strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                        )}
                        {/* Text Button */}
                        {formData.phone && formData.show_text_button && (
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                            style={{ backgroundColor: linksSettings.accentColor }}
                            title="Text"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke={linksSettings.iconStyle === 'light' ? '#ffffff' : '#1a1a1a'} strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Sample Buttons */}
                    <div className="w-full space-y-1.5">
                      {/* Render buttons in linkOrder */}
                      {(() => {
                        const linkOrder = linksSettings.linkOrder || ['join-team', 'learn-about'];
                        const customLinkMap = new Map(customLinks.map(l => [l.id, l]));

                        // Build ordered array with all links
                        const allLinkIds = [...linkOrder];
                        customLinks.forEach(link => {
                          if (!allLinkIds.includes(link.id)) allLinkIds.push(link.id);
                        });
                        if (!allLinkIds.includes('join-team')) allLinkIds.unshift('join-team');
                        if (!allLinkIds.includes('learn-about')) {
                          const joinIndex = allLinkIds.indexOf('join-team');
                          allLinkIds.splice(joinIndex + 1, 0, 'learn-about');
                        }

                        return allLinkIds.map(linkId => {
                          const isDefault = linkId === 'join-team' || linkId === 'learn-about';
                          const customLink = customLinkMap.get(linkId);

                          if (!isDefault && !customLink) return null;

                          if (linkId === 'join-team') {
                            return (
                              <div
                                key="join-team"
                                className="w-full py-1.5 px-3 rounded text-[10px] font-medium relative"
                                style={{
                                  backgroundColor: linksSettings.accentColor,
                                  color: linksSettings.iconStyle === 'light' ? '#ffffff' : '#1a1a1a',
                                  fontFamily: linksSettings.font === 'taskor' ? 'var(--font-taskor, sans-serif)' : 'var(--font-synonym, sans-serif)'
                                }}
                              >
                                <svg className="w-2.5 h-2.5 absolute left-2 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                  <circle cx="9" cy="7" r="4" />
                                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                                <span className="block text-center">Join my Team</span>
                              </div>
                            );
                          }

                          if (linkId === 'learn-about') {
                            return (
                              <div
                                key="learn-about"
                                className="w-full py-1.5 px-3 rounded text-[10px] font-medium relative"
                                style={{
                                  backgroundColor: linksSettings.accentColor,
                                  color: linksSettings.iconStyle === 'light' ? '#ffffff' : '#1a1a1a',
                                  fontFamily: linksSettings.font === 'taskor' ? 'var(--font-taskor, sans-serif)' : 'var(--font-synonym, sans-serif)'
                                }}
                              >
                                <svg className="w-2.5 h-2.5 absolute left-2 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="10" />
                                  <path d="M12 16v-4" />
                                  <path d="M12 8h.01" />
                                </svg>
                                <span className="block text-center">Learn About Team</span>
                              </div>
                            );
                          }

                          // Custom link
                          const iconPath = LINK_ICONS.find(i => i.name === customLink?.icon)?.path;
                          return (
                            <div
                              key={linkId}
                              className="w-full py-1.5 px-3 rounded text-[10px] font-medium relative"
                              style={{
                                backgroundColor: linksSettings.accentColor,
                                color: linksSettings.iconStyle === 'light' ? '#ffffff' : '#1a1a1a',
                                fontFamily: linksSettings.font === 'taskor' ? 'var(--font-taskor, sans-serif)' : 'var(--font-synonym, sans-serif)'
                              }}
                            >
                              {iconPath && (
                                <svg className="w-2.5 h-2.5 absolute left-2 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path d={iconPath} />
                                </svg>
                              )}
                              <span className="block text-center">{customLink?.label}</span>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </div>
            </div>
            </div> {/* End sticky wrapper */}
          </div>

          {/* SETTINGS COLUMN - All settings here, single column on mobile */}
          <div className="lg:col-start-1 lg:row-start-1">
            {/* Page Status & Link */}
            {pageData.activated && (
              <div className="mb-4 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-medium text-green-400">Linktree Live</span>
                </div>
                <a
                  href={linktreeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 w-full px-3 py-1.5 rounded bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-all text-xs font-medium"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  View Page
                </a>
              </div>
            )}

            {/* Tab Navigation - Mobile only, sticky at top */}
            <div className="sticky top-0 z-20 bg-[#191919]/95 backdrop-blur-sm border-b border-white/10 mb-4 lg:hidden -mx-2 sm:-mx-4 px-2 sm:px-4">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-colors relative ${
                    activeTab === 'profile'
                      ? 'text-[#22c55e]'
                      : 'text-[#e5e4dd]/60 hover:text-[#e5e4dd]'
                  }`}
                >
                  Profile
                  {activeTab === 'profile' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#22c55e]" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('connect')}
                  className={`flex-1 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-colors relative ${
                    activeTab === 'connect'
                      ? 'text-[#22c55e]'
                      : 'text-[#e5e4dd]/60 hover:text-[#e5e4dd]'
                  }`}
                >
                  Connect
                  {activeTab === 'connect' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#22c55e]" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('links')}
                  className={`flex-1 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-colors relative ${
                    activeTab === 'links'
                      ? 'text-[#22c55e]'
                      : 'text-[#e5e4dd]/60 hover:text-[#e5e4dd]'
                  }`}
                >
                  Links
                  {customLinks.length > 0 && (
                    <span className="ml-1 px-1 py-0.5 text-[10px] sm:text-xs rounded-full bg-[#22c55e]/20 text-[#22c55e]">
                      {customLinks.length}
                    </span>
                  )}
                  {activeTab === 'links' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#22c55e]" />
                  )}
                </button>
              </div>
            </div>

            {/* PROFILE SECTION - Photo, Name, Bio */}
            <div className={`space-y-3 ${activeTab === 'profile' ? '' : 'hidden lg:block'}`}>
              {/* Section Header */}
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <svg className="w-4 h-4 text-[#22c55e]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3 className="text-xs font-semibold text-[#22c55e] uppercase tracking-wide">Profile</h3>
              </div>
                  {/* Profile Image - Compact */}
                  <div className="p-4 rounded-lg bg-black/20 border border-white/10">
                    <div className="flex items-start gap-4">
                      <label
                        htmlFor="attraction-profile-image-upload"
                        className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#ffd700] bg-black/30 flex-shrink-0 cursor-pointer group"
                      >
                        {(pageData.profile_image_url || user.profilePictureUrl) ? (
                          <img
                            src={pageData.profile_image_url || user.profilePictureUrl || ''}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            style={{ filter: `contrast(${contrastLevel / 130})` }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#ffd700]/40">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                          </div>
                        )}
                        {isUploadingImage && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-[#ffd700] border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" className="text-white">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                        </div>
                      </label>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-[#ffd700] mb-1">Profile Image <span className="text-red-400">*</span></h4>
                        <p className="text-xs text-[#e5e4dd]/50 mb-2">Background removed, B&W applied</p>
                        <input
                          ref={attractionFileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleImageUpload}
                          onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
                          className="hidden"
                          id="attraction-profile-image-upload"
                        />
                        <label
                          htmlFor="attraction-profile-image-upload"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] hover:bg-[#ffd700]/20 transition-colors cursor-pointer"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                          {pageData.profile_image_url ? 'Change' : 'Upload'}
                        </label>
                        {attractionUploadStatus && (
                          <div className="mt-2 text-xs text-blue-400 flex items-center gap-1.5">
                            <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                            {attractionUploadStatus}
                          </div>
                        )}
                        {attractionUploadError && (
                          <div className="mt-2 text-xs text-red-400">{attractionUploadError}</div>
                        )}
                        {/* Photo Style Toggle - B&W or Color */}
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#e5e4dd]/60">Style:</span>
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() => { setLinksSettings(prev => ({ ...prev, showColorPhoto: false })); setHasUnsavedChanges(true); }}
                                className={`px-3 py-1 rounded text-xs border transition-colors ${
                                  !linksSettings.showColorPhoto
                                    ? 'bg-[#ffd700]/20 border-[#ffd700] text-[#ffd700]'
                                    : 'bg-black/20 border-white/10 text-[#e5e4dd]/70 hover:border-white/20'
                                }`}
                              >
                                B&W
                              </button>
                              <button
                                type="button"
                                onClick={() => { setLinksSettings(prev => ({ ...prev, showColorPhoto: true })); setHasUnsavedChanges(true); }}
                                className={`px-3 py-1 rounded text-xs border transition-colors ${
                                  linksSettings.showColorPhoto
                                    ? 'bg-[#ffd700]/20 border-[#ffd700] text-[#ffd700]'
                                    : 'bg-black/20 border-white/10 text-[#e5e4dd]/70 hover:border-white/20'
                                }`}
                              >
                                Color
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Display Name - Compact */}
                  <div className="p-4 rounded-lg bg-black/20 border border-white/10">
                    <h4 className="text-sm font-medium text-[#ffd700] mb-3">Display Name</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-[#e5e4dd]/60 mb-1">First Name</label>
                        <input
                          type="text"
                          value={formData.display_first_name}
                          onChange={(e) => handleInputChange('display_first_name', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] text-sm focus:border-[#ffd700]/50 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#e5e4dd]/60 mb-1">Last Name</label>
                        <input
                          type="text"
                          value={formData.display_last_name}
                          onChange={(e) => handleInputChange('display_last_name', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] text-sm focus:border-[#ffd700]/50 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="p-4 rounded-lg bg-black/20 border border-white/10">
                    <h4 className="text-sm font-medium text-[#ffd700] mb-2">Bio</h4>
                    <div className="relative">
                      <textarea
                        value={linksSettings.bio}
                        onChange={(e) => {
                          if (e.target.value.length <= 80) {
                            setLinksSettings(prev => ({ ...prev, bio: e.target.value }));
                            setHasUnsavedChanges(true);
                          }
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] text-sm focus:border-[#ffd700]/50 focus:outline-none transition-colors resize-none"
                        rows={3}
                        placeholder="Short description about yourself..."
                      />
                      <span className={`absolute bottom-2 right-2 text-[10px] ${
                        linksSettings.bio.length >= 80 ? 'text-red-400' :
                        linksSettings.bio.length >= 60 ? 'text-yellow-400' :
                        'text-[#e5e4dd]/30'
                      }`}>
                        {linksSettings.bio.length}/80
                      </span>
                    </div>
                  </div>
            </div> {/* End PROFILE SECTION */}

            {/* CONNECT SECTION - Social Links, Phone, Email */}
            <div className={`space-y-3 mt-6 ${activeTab === 'connect' ? '' : 'hidden lg:block'}`}>
              {/* Section Header */}
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <svg className="w-4 h-4 text-[#22c55e]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-xs font-semibold text-[#22c55e] uppercase tracking-wide">Connect</h3>
              </div>

              {/* Social Links */}
              <div className="p-4 rounded-lg bg-black/20 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-[#ffd700]">Social Links</h4>
                  <span className="text-xs text-[#e5e4dd]/40">{filledSocialLinks}/6</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="url"
                    value={formData.facebook_url}
                    onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] text-sm focus:border-[#ffd700]/50 focus:outline-none transition-colors"
                    placeholder="Facebook URL"
                  />
                  <input
                    type="url"
                    value={formData.instagram_url}
                    onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] text-sm focus:border-[#ffd700]/50 focus:outline-none transition-colors"
                    placeholder="Instagram URL"
                  />
                  <input
                    type="url"
                    value={formData.twitter_url}
                    onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] text-sm focus:border-[#ffd700]/50 focus:outline-none transition-colors"
                    placeholder="X (Twitter) URL"
                  />
                  <input
                    type="url"
                    value={formData.youtube_url}
                    onChange={(e) => handleInputChange('youtube_url', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] text-sm focus:border-[#ffd700]/50 focus:outline-none transition-colors"
                    placeholder="YouTube URL"
                  />
                  <input
                    type="url"
                    value={formData.tiktok_url}
                    onChange={(e) => handleInputChange('tiktok_url', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] text-sm focus:border-[#ffd700]/50 focus:outline-none transition-colors"
                    placeholder="TikTok URL"
                  />
                  <input
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] text-sm focus:border-[#ffd700]/50 focus:outline-none transition-colors"
                    placeholder="LinkedIn URL"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="p-4 rounded-lg bg-black/20 border border-white/10">
                <h4 className="text-sm font-medium text-[#ffd700] mb-2">Email</h4>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] text-sm focus:border-[#ffd700]/50 focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
                <p className="text-xs text-[#e5e4dd]/40 mt-1">Shows as email button on your page</p>
              </div>

              {/* Phone */}
              <div className="p-4 rounded-lg bg-black/20 border border-white/10">
                <h4 className="text-sm font-medium text-[#ffd700] mb-2">Phone</h4>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] text-sm focus:border-[#ffd700]/50 focus:outline-none transition-colors"
                  placeholder="(555) 123-4567"
                />
                {formData.phone && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-[#e5e4dd]/60">Show buttons for:</p>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.show_call_button}
                          onChange={(e) => handleInputChange('show_call_button', e.target.checked)}
                          className="w-4 h-4 rounded border-white/20 bg-black/30 accent-[#ffd700]"
                        />
                        <span className="text-xs text-[#e5e4dd]">Call</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.show_text_button}
                          onChange={(e) => handleInputChange('show_text_button', e.target.checked)}
                          className="w-4 h-4 rounded border-white/20 bg-black/30 accent-[#ffd700]"
                        />
                        <span className="text-xs text-[#e5e4dd]">Text</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div> {/* End CONNECT SECTION */}

            {/* LINKS SECTION - Accent Color, Style, Button Links */}
            <div className={`space-y-3 mt-6 ${activeTab === 'links' ? '' : 'hidden lg:block'}`}>
              {/* Section Header */}
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <svg className="w-4 h-4 text-[#22c55e]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <h3 className="text-xs font-semibold text-[#22c55e] uppercase tracking-wide">Links</h3>
              </div>

              {/* Accent Color + Style in a grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Accent Color */}
                <div className="p-4 rounded-lg bg-black/20 border border-white/10">
                  <h4 className="text-sm font-medium text-[#ffd700] mb-2">Accent Color</h4>
                  <div className="space-y-3">
                    {/* Color Preview & Hex Input */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-white/20 transition-all hover:border-white/40 hover:scale-105"
                        style={{ backgroundColor: linksSettings.accentColor }}
                        title="Open color picker"
                      />
                      <input
                        type="text"
                        value={linksSettings.accentColor}
                        onChange={(e) => {
                          const hex = e.target.value;
                          if (/^#[0-9A-Fa-f]{0,6}$/.test(hex) || hex === '') {
                            setLinksSettings(prev => ({ ...prev, accentColor: hex || '#' }));
                            setHasUnsavedChanges(true);
                          }
                        }}
                        className="flex-1 px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] text-sm font-mono focus:border-[#ffd700]/50 focus:outline-none transition-colors"
                        placeholder="#ffd700"
                      />
                    </div>

                    {/* Full Color Picker */}
                    {showColorPicker && (
                      <div className="relative">
                        <div className="fixed inset-0 z-40" onClick={() => setShowColorPicker(false)} />
                        <div className="relative z-50 rounded overflow-hidden shadow-xl border border-white/20">
                          <ChromePicker
                            color={linksSettings.accentColor}
                            onChange={(color: ColorResult) => {
                              setLinksSettings(prev => ({ ...prev, accentColor: color.hex }));
                              setHasUnsavedChanges(true);
                            }}
                            disableAlpha={true}
                            styles={{
                              default: {
                                picker: { background: '#1a1a1a', boxShadow: 'none', width: '100%' },
                                body: { padding: '8px' },
                              },
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Quick Presets */}
                    <div className="flex flex-wrap gap-1.5">
                      {['#ffd700', '#ff6b6b', '#22c55e', '#45b7d1', '#96ceb4', '#ff9f43', '#a55eea', '#26de81', '#f472b6', '#38bdf8', '#fb923c', '#4ade80'].map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => {
                            setLinksSettings(prev => ({ ...prev, accentColor: color }));
                            setHasUnsavedChanges(true);
                          }}
                          className={`w-6 h-6 rounded transition-all ${
                            linksSettings.accentColor === color ? 'ring-2 ring-white scale-110' : 'hover:scale-110'
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>

                    {/* Button Sample Preview */}
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-[10px] text-[#e5e4dd]/40 mb-2">Button Preview</p>
                      <div className="flex flex-col gap-2">
                        <div
                          className="w-full py-2 px-3 rounded-lg text-center text-sm font-medium transition-all"
                          style={{ backgroundColor: linksSettings.accentColor, color: linksSettings.iconStyle === 'light' ? '#fff' : '#000' }}
                        >
                          Sample Link Button
                        </div>
                        <div className="flex gap-2 justify-center">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: linksSettings.accentColor }}>
                            <svg className="w-5 h-5" fill={linksSettings.iconStyle === 'light' ? '#fff' : '#000'} viewBox="0 0 24 24">
                              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                            </svg>
                          </div>
                          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: linksSettings.accentColor }}>
                            <svg className="w-5 h-5" fill={linksSettings.iconStyle === 'light' ? '#fff' : '#000'} viewBox="0 0 24 24">
                              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                            </svg>
                          </div>
                          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: linksSettings.accentColor }}>
                            <svg className="w-5 h-5" fill={linksSettings.iconStyle === 'light' ? '#fff' : '#000'} viewBox="0 0 24 24">
                              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Style Options */}
                <div className="p-4 rounded-lg bg-black/20 border border-white/10">
                  <h4 className="text-sm font-medium text-[#ffd700] mb-3">Style Options</h4>
                  <div className="space-y-3">
                    {/* Button Text */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#e5e4dd]/60 w-16">Text</span>
                      <div className="flex gap-1 flex-1">
                        <button
                          type="button"
                          onClick={() => { setLinksSettings(prev => ({ ...prev, iconStyle: 'light' })); setHasUnsavedChanges(true); }}
                          className={`flex-1 px-3 py-1.5 rounded text-xs border transition-colors ${
                            linksSettings.iconStyle === 'light'
                              ? 'bg-[#ffd700]/20 border-[#ffd700] text-[#ffd700]'
                              : 'bg-black/20 border-white/10 text-[#e5e4dd]/70'
                          }`}
                        >
                          Light
                        </button>
                        <button
                          type="button"
                          onClick={() => { setLinksSettings(prev => ({ ...prev, iconStyle: 'dark' })); setHasUnsavedChanges(true); }}
                          className={`flex-1 px-3 py-1.5 rounded text-xs border transition-colors ${
                            linksSettings.iconStyle === 'dark'
                              ? 'bg-[#ffd700]/20 border-[#ffd700] text-[#ffd700]'
                              : 'bg-black/20 border-white/10 text-[#e5e4dd]/70'
                          }`}
                        >
                          Dark
                        </button>
                      </div>
                    </div>
                    {/* Font */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#e5e4dd]/60 w-16">Font</span>
                      <div className="flex gap-1 flex-1">
                        <button
                          type="button"
                          onClick={() => { setLinksSettings(prev => ({ ...prev, font: 'synonym' })); setHasUnsavedChanges(true); }}
                          className={`flex-1 px-3 py-1.5 rounded text-xs border transition-colors ${
                            linksSettings.font === 'synonym'
                              ? 'bg-[#ffd700]/20 border-[#ffd700] text-[#ffd700]'
                              : 'bg-black/20 border-white/10 text-[#e5e4dd]/70'
                          }`}
                        >
                          Synonym
                        </button>
                        <button
                          type="button"
                          onClick={() => { setLinksSettings(prev => ({ ...prev, font: 'taskor' })); setHasUnsavedChanges(true); }}
                          className={`flex-1 px-3 py-1.5 rounded text-xs border transition-colors ${
                            linksSettings.font === 'taskor'
                              ? 'bg-[#ffd700]/20 border-[#ffd700] text-[#ffd700]'
                              : 'bg-black/20 border-white/10 text-[#e5e4dd]/70'
                          }`}
                        >
                          Taskor
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Button Links Header */}
              <div className="flex items-center gap-2 pt-2">
                <h4 className="text-sm font-medium text-[#ffd700]">Button Links</h4>
              </div>
              {/* Unified Links List - 2-column grid on larger screens */}
              {(() => {
                // Build ordered list of all links
                const linkOrder = linksSettings.linkOrder || ['join-team', 'learn-about'];

                // Create lookup for custom links
                const customLinkMap = new Map(customLinks.map(l => [l.id, l]));

                // Build ordered array with all links
                const allLinkIds = [...linkOrder];
                // Add any custom links not in linkOrder
                customLinks.forEach(link => {
                  if (!allLinkIds.includes(link.id)) {
                    allLinkIds.push(link.id);
                  }
                });
                // Ensure default buttons are included
                if (!allLinkIds.includes('join-team')) allLinkIds.unshift('join-team');
                if (!allLinkIds.includes('learn-about')) {
                  const joinIndex = allLinkIds.indexOf('join-team');
                  allLinkIds.splice(joinIndex + 1, 0, 'learn-about');
                }

                return (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                    {allLinkIds.map((linkId, index) => {
                      const isDefault = linkId === 'join-team' || linkId === 'learn-about';
                      const defaultButton = DEFAULT_BUTTONS.find(b => b.id === linkId);
                      const customLink = customLinkMap.get(linkId);

                      if (!isDefault && !customLink) return null;

                      const label = isDefault ? defaultButton?.label : customLink?.label;
                      const url = isDefault ? (linkId === 'join-team' ? 'Join form' : 'Your page') : customLink?.url;

                      return (
                        <div
                          key={linkId}
                          className={`flex items-center gap-1.5 p-2 rounded group ${
                            isDefault
                              ? 'bg-[#22c55e]/10 border border-[#22c55e]/30'
                              : 'bg-black/20 border border-white/10'
                          }`}
                        >
                          {/* Reorder buttons */}
                          <div className="flex flex-col">
                            <button
                              type="button"
                              onClick={() => {
                                if (index > 0) {
                                  const newOrder = [...allLinkIds];
                                  [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
                                  setLinksSettings(prev => ({ ...prev, linkOrder: newOrder }));
                                  setHasUnsavedChanges(true);
                                }
                              }}
                              disabled={index === 0}
                              className="p-0.5 hover:bg-white/10 disabled:opacity-20"
                            >
                              <svg className="w-2.5 h-2.5 text-[#e5e4dd]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (index < allLinkIds.length - 1) {
                                  const newOrder = [...allLinkIds];
                                  [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
                                  setLinksSettings(prev => ({ ...prev, linkOrder: newOrder }));
                                  setHasUnsavedChanges(true);
                                }
                              }}
                              disabled={index === allLinkIds.length - 1}
                              className="p-0.5 hover:bg-white/10 disabled:opacity-20"
                            >
                              <svg className="w-2.5 h-2.5 text-[#e5e4dd]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>

                          {/* Icon */}
                          {isDefault ? (
                            <div className="w-5 h-5 rounded bg-[#22c55e]/20 flex items-center justify-center flex-shrink-0">
                              <svg className="w-2.5 h-2.5 text-[#22c55e]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d={linkId === 'join-team' ? 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' : 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'} />
                              </svg>
                            </div>
                          ) : customLink?.icon && (
                            <div className="w-5 h-5 rounded bg-[#22c55e]/10 flex items-center justify-center flex-shrink-0">
                              <svg className="w-2.5 h-2.5 text-[#22c55e]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d={LINK_ICONS.find(i => i.name === customLink.icon)?.path || ''} />
                              </svg>
                            </div>
                          )}

                          {/* Label */}
                          <div className="flex-1 min-w-0">
                            <div className={`text-xs truncate ${isDefault ? 'text-[#22c55e]' : 'text-[#e5e4dd]'}`}>
                              {label}
                              {isDefault && <span className="ml-1 text-[10px] text-[#22c55e]/50">(default)</span>}
                            </div>
                            <div className="text-[10px] text-[#e5e4dd]/30 truncate">{url}</div>
                          </div>

                          {/* Delete - custom links only */}
                          {!isDefault && (
                            <button
                              type="button"
                              onClick={() => {
                                setCustomLinks(prev => prev.filter(l => l.id !== linkId));
                                setLinksSettings(prev => ({
                                  ...prev,
                                  linkOrder: prev.linkOrder.filter(id => id !== linkId)
                                }));
                                setHasUnsavedChanges(true);
                              }}
                              className="p-1 rounded text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {/* Add New Link - Compact inline form */}
              <div className="p-3 rounded-lg bg-black/20 border border-white/10 mt-3">
                <div className="flex flex-wrap items-end gap-2">
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-[10px] text-[#e5e4dd]/50 mb-1">Label</label>
                    <input
                      type="text"
                      value={newLinkLabel}
                      onChange={(e) => setNewLinkLabel(e.target.value)}
                      className="w-full px-2 py-1.5 rounded bg-black/30 border border-white/10 text-[#e5e4dd] text-xs focus:border-[#22c55e]/50 focus:outline-none"
                      placeholder="Button text"
                    />
                  </div>
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-[10px] text-[#e5e4dd]/50 mb-1">URL</label>
                    <input
                      type="url"
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                      className="w-full px-2 py-1.5 rounded bg-black/30 border border-white/10 text-[#e5e4dd] text-xs focus:border-[#22c55e]/50 focus:outline-none"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowIconPicker(!showIconPicker)}
                      className="flex items-center gap-1 px-2 py-1.5 rounded bg-black/30 border border-white/10 text-xs hover:border-[#22c55e]/30"
                    >
                      {newLinkIcon ? (
                        <svg className="w-3 h-3 text-[#22c55e]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d={LINK_ICONS.find(i => i.name === newLinkIcon)?.path || ''} />
                        </svg>
                      ) : (
                        <span className="text-[#e5e4dd]/50">Icon</span>
                      )}
                    </button>
                    {showIconPicker && (
                      <div className="absolute z-10 bottom-full mb-1 left-0 w-48 max-h-32 overflow-y-auto rounded bg-[#1a1a1a] border border-white/20 shadow-xl">
                        <div className="grid grid-cols-6 gap-0.5 p-1">
                          {LINK_ICONS.map(icon => (
                            <button
                              key={icon.name}
                              type="button"
                              onClick={() => { setNewLinkIcon(icon.name); setShowIconPicker(false); }}
                              className={`p-1.5 rounded transition-colors ${
                                newLinkIcon === icon.name ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'hover:bg-white/10 text-[#e5e4dd]/70'
                              }`}
                              title={icon.label}
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d={icon.path} />
                              </svg>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (newLinkLabel.trim() && newLinkUrl.trim()) {
                        const newLinkId = `link-${Date.now()}`;
                        const newLink: CustomLink = {
                          id: newLinkId,
                          label: newLinkLabel.trim(),
                          url: newLinkUrl.trim(),
                          icon: newLinkIcon || undefined,
                          order: customLinks.length,
                        };
                        setCustomLinks(prev => [...prev, newLink]);
                        setLinksSettings(prev => ({
                          ...prev,
                          linkOrder: [...(prev.linkOrder || ['join-team', 'learn-about']), newLinkId]
                        }));
                        setNewLinkLabel('');
                        setNewLinkUrl('');
                        setNewLinkIcon(null);
                        setHasUnsavedChanges(true);
                      }
                    }}
                    disabled={!newLinkLabel.trim() || !newLinkUrl.trim()}
                    className="px-3 py-1.5 rounded text-xs font-medium bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] hover:bg-[#22c55e]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div> {/* End of LINKS SECTION */}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-end pt-4 mt-6 border-t border-white/10">
              {hasUnsavedChanges && (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-lg font-medium bg-[#ffd700] text-black hover:bg-[#ffe55c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              )}
              {!pageData.activated && (
                <button
                  onClick={handleActivate}
                  disabled={isSaving || hasUnsavedChanges || (!pageData.profile_image_url && !user.profilePictureUrl)}
                  className="px-5 py-2.5 rounded-lg font-medium bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title={
                    hasUnsavedChanges
                      ? 'Save changes first'
                      : (!pageData.profile_image_url && !user.profilePictureUrl)
                        ? 'Upload a profile image first'
                        : 'Activate your page'
                  }
                >
                  Activate Pages
                </button>
              )}
            </div>
          </div> {/* End of SETTINGS COLUMN */}
        </div>

        {/* MOBILE PREVIEW BUTTON - Fixed above menu bar with rounded corners and 3D effect */}
        <div className="fixed bottom-[62px] left-2 right-2 z-40 lg:hidden">
          <button
            onClick={() => setShowMobilePreview(true)}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              boxShadow: 'inset 0 1px 0 rgba(255,215,0,0.2), inset 0 -1px 2px rgba(0,0,0,0.5), 0 0 12px rgba(255,215,0,0.15)',
            }}
          >
            <svg className="w-5 h-5 text-[#ffd700]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-[#ffd700]">Preview Linktree</span>
          </button>
        </div>

        {/* MOBILE PREVIEW MODAL - Using base Modal component */}
        <Modal
          isOpen={showMobilePreview}
          onClose={() => setShowMobilePreview(false)}
          size="lg"
          showCloseButton={true}
          closeOnBackdropClick={true}
          closeOnEscape={true}
        >
          {/* Modal Header */}
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
            <span className="text-lg font-medium text-[#e5e4dd]">Live Preview</span>
            <span className="text-sm text-[#22c55e]">Linktree</span>
          </div>

          {/* Preview Content with star background */}
          <div className="flex flex-col items-center gap-4 max-w-[280px] mx-auto relative">
            {/* Static star dots for preview */}
            <div className="absolute inset-0 -inset-x-8 pointer-events-none" style={{
              background: `
                radial-gradient(1.5px 1.5px at 30px 40px, white, transparent),
                radial-gradient(1px 1px at 60px 90px, rgba(255,255,255,0.8), transparent),
                radial-gradient(1.5px 1.5px at 140px 50px, rgba(255,255,255,0.6), transparent),
                radial-gradient(1px 1px at 200px 100px, white, transparent),
                radial-gradient(1px 1px at 250px 40px, rgba(255,255,255,0.7), transparent),
                radial-gradient(0.5px 0.5px at 100px 130px, rgba(255,255,255,0.5), transparent),
                radial-gradient(1px 1px at 180px 180px, rgba(255,255,255,0.4), transparent),
                radial-gradient(1.5px 1.5px at 70px 250px, rgba(255,255,255,0.6), transparent),
                radial-gradient(1px 1px at 230px 200px, rgba(255,255,255,0.5), transparent),
                radial-gradient(1px 1px at 40px 350px, rgba(255,255,255,0.7), transparent),
                radial-gradient(0.5px 0.5px at 200px 320px, rgba(255,255,255,0.4), transparent),
                radial-gradient(1.5px 1.5px at 120px 400px, rgba(255,255,255,0.6), transparent),
                radial-gradient(1px 1px at 260px 380px, rgba(255,255,255,0.5), transparent),
                radial-gradient(0.5px 0.5px at 80px 450px, rgba(255,255,255,0.4), transparent)
              `,
              opacity: 0.5
            }} />
            {/* Profile Photo */}
            <div
              className="w-24 h-24 rounded-full border-3 flex items-center justify-center overflow-hidden relative z-10"
              style={{ borderColor: linksSettings.accentColor, borderWidth: '3px', backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
              {getProfileImageUrl() ? (
                <img
                  src={getProfileImageUrl() || ''}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl">👤</span>
              )}
            </div>

            {/* Name */}
            <span
              className="font-bold text-xl text-center"
              style={{
                color: linksSettings.accentColor,
                fontFamily: 'var(--font-taskor, sans-serif)',
              }}
            >
              {formData.display_first_name || 'Your'} {formData.display_last_name || 'Name'}
            </span>

            {/* Bio */}
            {linksSettings.bio && (
              <p className="text-sm text-center text-[#e5e4dd]/70 max-w-[240px]">
                {linksSettings.bio}
              </p>
            )}

            {/* Social Icons */}
            {filledSocialLinks > 0 && (
              <div className="flex gap-2 flex-wrap justify-center">
                {formData.facebook_url && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${linksSettings.accentColor}20`, border: `1px solid ${linksSettings.accentColor}40` }}>
                    <svg className="w-4 h-4" fill={linksSettings.accentColor} viewBox="0 0 24 24"><path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z"/></svg>
                  </div>
                )}
                {formData.instagram_url && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${linksSettings.accentColor}20`, border: `1px solid ${linksSettings.accentColor}40` }}>
                    <svg className="w-4 h-4" fill={linksSettings.accentColor} viewBox="0 0 24 24"><path d="M12,2.16c3.2,0,3.58.01,4.85.07,3.25.15,4.77,1.69,4.92,4.92.06,1.27.07,1.65.07,4.85s-.01,3.58-.07,4.85c-.15,3.23-1.66,4.77-4.92,4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.38,3.92,3.9,2.38,7.15,2.23,8.42,2.18,8.8,2.16,12,2.16ZM12,0C8.74,0,8.33.01,7.05.07,2.7.27.27,2.7.07,7.05.01,8.33,0,8.74,0,12s.01,3.67.07,4.95c.2,4.36,2.62,6.78,6.98,6.98,1.28.06,1.69.07,4.95.07s3.67-.01,4.95-.07c4.35-.2,6.78-2.62,6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.63-6.78-6.98-6.98C15.67.01,15.26,0,12,0Zm0,5.84A6.16,6.16,0,1,0,18.16,12,6.16,6.16,0,0,0,12,5.84ZM12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16ZM18.41,4.15a1.44,1.44,0,1,0,1.44,1.44A1.44,1.44,0,0,0,18.41,4.15Z"/></svg>
                  </div>
                )}
                {formData.twitter_url && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${linksSettings.accentColor}20`, border: `1px solid ${linksSettings.accentColor}40` }}>
                    <svg className="w-4 h-4" fill={linksSettings.accentColor} viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </div>
                )}
                {formData.youtube_url && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${linksSettings.accentColor}20`, border: `1px solid ${linksSettings.accentColor}40` }}>
                    <svg className="w-4 h-4" fill={linksSettings.accentColor} viewBox="0 0 24 24"><path d="M23.5,6.19a3.02,3.02,0,0,0-2.12-2.14C19.53,3.5,12,3.5,12,3.5s-7.53,0-9.38.55A3.02,3.02,0,0,0,.5,6.19,31.62,31.62,0,0,0,0,12a31.62,31.62,0,0,0,.5,5.81,3.02,3.02,0,0,0,2.12,2.14c1.85.55,9.38.55,9.38.55s7.53,0,9.38-.55a3.02,3.02,0,0,0,2.12-2.14A31.62,31.62,0,0,0,24,12,31.62,31.62,0,0,0,23.5,6.19ZM9.55,15.5V8.5L15.82,12Z"/></svg>
                  </div>
                )}
                {formData.tiktok_url && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${linksSettings.accentColor}20`, border: `1px solid ${linksSettings.accentColor}40` }}>
                    <svg className="w-4 h-4" fill={linksSettings.accentColor} viewBox="0 0 24 24"><path d="M19.59,6.69a4.83,4.83,0,0,1-3.77-4.25V2h-3.45V15.94a2.91,2.91,0,0,1-2.91,2.91,2.87,2.87,0,0,1-1.49-.42,2.91,2.91,0,0,1,1.49-5.4,2.81,2.81,0,0,1,.89.14V9.66a6.27,6.27,0,0,0-.89-.07A6.36,6.36,0,0,0,3.09,16a6.36,6.36,0,0,0,10.91,4.44V13.47a8.16,8.16,0,0,0,4.77,1.53h.82V11.55a4.83,4.83,0,0,1-4-4.86Z"/></svg>
                  </div>
                )}
                {formData.linkedin_url && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${linksSettings.accentColor}20`, border: `1px solid ${linksSettings.accentColor}40` }}>
                    <svg className="w-4 h-4" fill={linksSettings.accentColor} viewBox="0 0 24 24"><path d="M20.45,20.45H16.89V14.88c0-1.33,0-3.04-1.85-3.04s-2.14,1.45-2.14,2.94v5.66H9.34V9h3.41v1.56h.05a3.74,3.74,0,0,1,3.37-1.85c3.6,0,4.27,2.37,4.27,5.46v6.28ZM5.34,7.43A2.07,2.07,0,1,1,7.41,5.36,2.07,2.07,0,0,1,5.34,7.43Zm1.78,13H3.56V9H7.12ZM22.22,0H1.77A1.75,1.75,0,0,0,0,1.73V22.27A1.75,1.75,0,0,0,1.77,24H22.22A1.76,1.76,0,0,0,24,22.27V1.73A1.76,1.76,0,0,0,22.22,0Z"/></svg>
                  </div>
                )}
              </div>
            )}

            {/* Contact Icon Buttons Row - Email, Call, Text */}
            {(formData.email || (formData.phone && (formData.show_call_button || formData.show_text_button))) && (
              <div className="flex gap-3 justify-center">
                {/* Email Button */}
                {formData.email && (
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                    style={{ backgroundColor: linksSettings.accentColor }}
                    title="Email"
                  >
                    <svg className="w-5 h-5" fill="none" stroke={linksSettings.iconStyle === 'light' ? '#ffffff' : '#1a1a1a'} strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {/* Call Button */}
                {formData.phone && formData.show_call_button && (
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                    style={{ backgroundColor: linksSettings.accentColor }}
                    title="Call"
                  >
                    <svg className="w-5 h-5" fill="none" stroke={linksSettings.iconStyle === 'light' ? '#ffffff' : '#1a1a1a'} strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                )}
                {/* Text Button */}
                {formData.phone && formData.show_text_button && (
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                    style={{ backgroundColor: linksSettings.accentColor }}
                    title="Text"
                  >
                    <svg className="w-5 h-5" fill="none" stroke={linksSettings.iconStyle === 'light' ? '#ffffff' : '#1a1a1a'} strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                )}
              </div>
            )}

            {/* Link Buttons */}
            <div className="w-full space-y-2 mt-2">
              {(() => {
                const linkOrder = linksSettings.linkOrder || ['join-team', 'learn-about'];
                const customLinkMap = new Map(customLinks.map(l => [l.id, l]));
                const allLinkIds = [...linkOrder];
                customLinks.forEach(link => {
                  if (!allLinkIds.includes(link.id)) allLinkIds.push(link.id);
                });
                if (!allLinkIds.includes('join-team')) allLinkIds.unshift('join-team');
                if (!allLinkIds.includes('learn-about')) {
                  const joinIndex = allLinkIds.indexOf('join-team');
                  allLinkIds.splice(joinIndex + 1, 0, 'learn-about');
                }

                return allLinkIds.map((linkId) => {
                  const isDefault = linkId === 'join-team' || linkId === 'learn-about';
                  const customLink = customLinkMap.get(linkId);
                  if (!isDefault && !customLink) return null;

                  return (
                    <div
                      key={linkId}
                      className="w-full py-3 px-4 rounded-lg text-sm font-medium text-center"
                      style={{
                        backgroundColor: linksSettings.accentColor,
                        color: linksSettings.iconStyle === 'light' ? '#ffffff' : '#1a1a1a',
                        fontFamily: linksSettings.font === 'taskor' ? 'var(--font-taskor, sans-serif)' : 'var(--font-synonym, sans-serif)'
                      }}
                    >
                      {isDefault ? (linkId === 'join-team' ? 'Join my Team' : 'Learn About my Team') : customLink?.label}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </Modal>

        {/* Spacer for fixed bottom button on mobile */}
        <div className="h-24 lg:hidden" />
    </div>
  );
}

// ============================================================================
// Section Wrapper Component (kept for reference but no longer used)
// ============================================================================
function SectionWrapper({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div
      className="section-content rounded-xl p-6 sm:p-8 bg-black/80 md:bg-black/30 md:backdrop-blur-sm border border-[#ffd700]/10"
      style={{
        WebkitTapHighlightColor: 'transparent',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
      } as React.CSSProperties}
    >
      {title && (
        <div className="mb-[50px]">
          <H2>{title}</H2>
        </div>
      )}
      {children}
    </div>
  );
}

// ============================================================================
// Page Badges Component - indicates which pages a setting applies to
// ============================================================================
function PageBadges({ pages }: { pages: ('agent' | 'linktree')[] }) {
  return (
    <div className="flex gap-2 mb-3">
      {pages.includes('agent') && (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#ffd700]/10 text-[#ffd700] border border-[#ffd700]/20">
          Agent Page
        </span>
      )}
      {pages.includes('linktree') && (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20">
          Linktree
        </span>
      )}
    </div>
  );
}
