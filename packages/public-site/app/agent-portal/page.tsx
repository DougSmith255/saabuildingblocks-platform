'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { H1, H2, CTAButton, GenericCard, FAQ } from '@saa/shared/components/saa';
import glassStyles from '@/components/shared/GlassShimmer.module.css';
import { SketchPicker, ColorResult } from 'react-color';

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
}

// Section types
type SectionId = 'dashboard' | 'start-here' | 'calls' | 'templates' | 'courses' | 'production' | 'revshare' | 'exp-links' | 'new-agents' | 'agent-pages';

interface NavItem {
  id: SectionId;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '⬡' },
  { id: 'start-here', label: 'Start Here', icon: '◈' },
  { id: 'agent-pages', label: 'My SAA Pages', icon: '◇' },
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

// Rewrite asset URLs to use CDN for edge caching
// This transforms assets.saabuildingblocks.com -> cdn.saabuildingblocks.com
function toCdnUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  return url.replace('assets.saabuildingblocks.com', 'cdn.saabuildingblocks.com');
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
        // Start preloading profile image immediately via CDN
        const img = new Image();
        img.src = user.profilePictureUrl;
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
  // Only show loading screen for PWA (standalone) mode, not browser
  const [showLoadingScreen, setShowLoadingScreen] = useState(() => {
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
  const [contrastLevel, setContrastLevel] = useState(130); // Default 130%
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null); // Store original for reprocessing
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Image crop/edit modal state
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [pendingImageUrl, setPendingImageUrl] = useState<string | null>(null);
  const [profileImageError, setProfileImageError] = useState(false); // Track if profile image failed to load
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

  // Minimum loading screen display time (3.5 seconds for PWA, instant for browser)
  useEffect(() => {
    // Check if running as installed PWA
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    // Only enforce minimum time for PWA mode
    if (isStandalone) {
      const timer = setTimeout(() => {
        setMinLoadTimeElapsed(true);
      }, 3500); // 3.5 seconds minimum
      return () => clearTimeout(timer);
    } else {
      // Browser mode - no minimum time
      setMinLoadTimeElapsed(true);
    }
  }, []);

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

  // Preload profile image for faster display
  useEffect(() => {
    if (user?.profilePictureUrl) {
      const img = new Image();
      img.src = user.profilePictureUrl;
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
        // Close the modal after a brief delay so user sees success message
        setTimeout(() => {
          setShowEditProfile(false);
          setEditFormSuccess('');
        }, 1500);
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
        {/* Full screen loading overlay - covers everything including header */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
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
    <main
      id="main-content"
      className="agent-portal-root min-h-screen"
      style={{ WebkitTapHighlightColor: 'transparent' } as React.CSSProperties}
    >
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
            {/* SAA Logo */}
            <a href="/" className="flex-shrink-0">
              <img
                src="/images/saa-logo-gold.png"
                alt="Smart Agent Alliance"
                style={{
                  width: 'clamp(100px, calc(80px + 3vw), 140px)',
                  height: 'auto',
                }}
              />
            </a>

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
                {activeSection === 'agent-pages' && 'My Pages'}
                {activeSection === 'calls' && 'Team Calls'}
                {activeSection === 'courses' && 'Courses'}
                {activeSection === 'start-here' && 'Start Here'}
                {activeSection === 'templates' && 'Templates'}
                {activeSection === 'production' && 'Production'}
                {activeSection === 'revshare' && 'RevShare'}
                {activeSection === 'exp-links' && 'eXp Links'}
                {activeSection === 'new-agents' && 'New Agents'}
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


      {/* Mobile Bottom Navigation - App-like experience */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-[#ffd700]/20 pb-safe">
        <div className="flex justify-around items-center h-16">
          {[
            { id: 'dashboard' as SectionId, label: 'Home', icon: '⬡' },
            { id: 'agent-pages' as SectionId, label: 'Pages', icon: '◇' },
            { id: 'calls' as SectionId, label: 'Calls', icon: '◉' },
            { id: 'courses' as SectionId, label: 'Courses', icon: '◬' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setSidebarOpen(false);
              }}
              className={`flex flex-col items-center justify-center flex-1 h-full pt-1 transition-colors ${
                activeSection === item.id
                  ? 'text-[#ffd700]'
                  : 'text-[#e5e4dd]/50'
              }`}
            >
              <span className="text-xl mb-0.5">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`flex flex-col items-center justify-center flex-1 h-full pt-1 transition-colors ${
              sidebarOpen ? 'text-[#ffd700]' : 'text-[#e5e4dd]/50'
            }`}
          >
            <span className="text-xl mb-0.5">☰</span>
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>

      {/* Mobile More Menu Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black overflow-y-auto pb-20">
          <div className="p-4 pt-20">
            {/* User Profile Card */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-[#ffd700]/20 mb-6">
              <button
                onClick={() => { handleProfilePictureClick(); setSidebarOpen(false); }}
                className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#ffd700]/30 flex-shrink-0"
              >
                {user.profilePictureUrl && !profileImageError ? (
                  <img
                    src={user.profilePictureUrl}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    onError={() => setProfileImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-[#ffd700]/10 flex items-center justify-center">
                    <span className="text-2xl text-[#ffd700]">{user.firstName?.charAt(0) || '?'}</span>
                  </div>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <h3 className="text-[#ffd700] font-semibold truncate">{user.firstName} {user.lastName}</h3>
                <p className="text-[#e5e4dd]/60 text-sm truncate">{user.email}</p>
              </div>
              <button
                onClick={() => { handleOpenEditProfile(); setSidebarOpen(false); }}
                className="p-2 rounded-lg bg-white/5 text-[#e5e4dd]/60"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>

            {/* Navigation Grid */}
            <div className="grid grid-cols-2 gap-3">
              {navItems.filter(item => !['dashboard', 'agent-pages', 'calls', 'courses'].includes(item.id)).map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all ${
                    activeSection === item.id
                      ? 'bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700]'
                      : 'bg-white/5 border border-white/10 text-[#e5e4dd]/70'
                  }`}
                >
                  <span className="text-2xl mb-2">{item.icon}</span>
                  <span className="text-sm font-medium text-center">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full mt-6 flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400"
            >
              <span>Logout</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Dashboard Layout */}
      <div className="max-w-[2500px] mx-auto px-4 sm:px-8 md:px-12 pb-24 md:pb-20 pt-20 md:pt-28">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar Navigation - Desktop only */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-4">
              {/* User Profile Section */}
              <div className="rounded-xl p-4 bg-black/80 md:bg-black/30 md:backdrop-blur-sm border border-[#ffd700]/15">
                {/* Hidden file input for profile picture upload */}
                {/* Using specific MIME types + extensions for cross-platform compatibility */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp,.jpg,.jpeg,.png,.gif,.webp"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />

                {/* Profile Picture */}
                <div className="flex flex-col items-center mb-4">
                  <button
                    onClick={handleProfilePictureClick}
                    className="relative group w-[130px] h-[130px] rounded-full overflow-hidden border-2 border-[#ffd700]/30 hover:border-[#ffd700] transition-colors mb-3"
                    title="Click to change profile picture"
                  >
                    {user.profilePictureUrl && !profileImageError ? (
                      <img
                        src={user.profilePictureUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                        onError={() => setProfileImageError(true)}
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
              <nav className="rounded-xl p-4 space-y-2 bg-black/80 md:bg-black/30 md:backdrop-blur-sm border border-[#ffd700]/15">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                    // Trigger shake animation
                    setShakingItem(item.id);
                    setTimeout(() => setShakingItem(null), 300);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-200
                    ${activeSection === item.id
                      ? 'bg-[#ffd700]/10 text-[#ffd700] border border-[#ffd700]/30'
                      : 'text-body hover:text-[#e5e4dd] hover:bg-white/5 border border-transparent'
                    }
                  `}
                  style={shakingItem === item.id ? { animation: 'shake 0.3s ease-in-out' } : undefined}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium font-taskor text-sm">{item.label}</span>
                </button>
              ))}
              </nav>
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

            {/* My Agent Pages */}
            {activeSection === 'agent-pages' && (
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
              />
            )}
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
                  className="relative group w-[196px] h-[196px] rounded-full overflow-hidden border-2 border-[#ffd700]/30 hover:border-[#ffd700] transition-colors"
                >
                  {user.profilePictureUrl && !profileImageError ? (
                    <img
                      src={user.profilePictureUrl}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                      onError={() => setProfileImageError(true)}
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

      {/* Loading Screen Overlay - Fades out like a veil lifting to reveal the dashboard */}
      {showLoadingScreen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgb(12, 12, 12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isLoadingFadingOut ? 0 : 1,
            transition: 'opacity 0.8s ease-out',
            pointerEvents: isLoadingFadingOut ? 'none' : 'auto',
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
                  animation: 'breatheGlow 3s ease-in-out infinite',
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
                  animation: 'loadingSlide 1.5s ease-in-out infinite',
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
                animation: 'messageFade 2s ease-in-out infinite',
              }}
            >
              Loading Portal...
            </p>
          </div>

          <style>{`
            @keyframes shimmerSlide {
              0% { background-position: 0% 0%; }
              50% { background-position: 100% 100%; }
              100% { background-position: 0% 0%; }
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
                <p className="text-body opacity-70">
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
    <SectionWrapper>
      <FAQ items={faqItems} allowMultiple defaultOpenIndex={0} />
    </SectionWrapper>
  );
}

// ============================================================================
// Team Calls Section
// ============================================================================
function TeamCallsSection() {
  return (
    <SectionWrapper>
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

interface TemplateCategory {
  id: string;
  label: string;
  icon: string;
  description: string;
  templates: Template[];
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

function TemplatesSection() {
  const [activeCategory, setActiveCategory] = useState(TEMPLATE_CATEGORIES[0].id);

  const currentCategory = TEMPLATE_CATEGORIES.find(c => c.id === activeCategory) || TEMPLATE_CATEGORIES[0];

  // No SectionWrapper - render directly to avoid container causing tap highlight issues
  return (
    <div className="space-y-6 px-2 sm:px-4">
        {/* Header */}
        <div className="text-center pb-2">
          <p className="text-sm text-[#e5e4dd]/60">
            Use your eXp credentials to access Canva templates
          </p>
        </div>

        {/* Category Grid - All visible, no scrolling */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {TEMPLATE_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-[#ffd700] text-black shadow-lg shadow-[#ffd700]/20'
                  : 'bg-black/40 border border-white/10 text-[#e5e4dd]/80 hover:border-[#ffd700]/30 hover:text-[#ffd700] hover:bg-black/60'
              }`}
            >
              <span className="text-base">{category.icon}</span>
              <span className="truncate">{category.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ml-auto ${
                activeCategory === category.id
                  ? 'bg-black/20 text-black'
                  : 'bg-white/10 text-[#e5e4dd]/60'
              }`}>
                {category.templates.length}
              </span>
            </button>
          ))}
        </div>

        {/* Category Description */}
        <div className="text-center">
          <p className="text-sm text-[#e5e4dd]/50">{currentCategory.description}</p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {currentCategory.templates.map((template, index) => (
            <a
              key={`${template.name}-${template.variant || ''}-${index}`}
              href={template.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-[#151515] border border-white/10 hover:border-[#ffd700]/40 transition-all hover:shadow-[0_0_20px_rgba(255,215,0,0.15)]"
            >
              {/* Template Preview Image */}
              <div className="relative aspect-[7/6] bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] overflow-hidden">
                {template.preview ? (
                  <img
                    src={`https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/template-${template.preview}/mobile`}
                    srcSet={`
                      https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/template-${template.preview}/mobile 400w,
                      https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/template-${template.preview}/tablet 800w
                    `}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                      {getFormatIcon(template.format)}
                    </span>
                  </div>
                )}

                {/* Format Badge */}
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-black/70 text-[#e5e4dd] backdrop-blur-sm">
                    {template.format}
                  </span>
                  {template.variant && (
                    <span className={`px-1.5 py-0.5 text-xs font-bold rounded backdrop-blur-sm ${
                      template.variant === 'W'
                        ? 'bg-white/90 text-black'
                        : 'bg-black/90 text-white border border-white/20'
                    }`}>
                      {template.variant}
                    </span>
                  )}
                </div>

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
              </div>

              {/* Template Name */}
              <div className="px-3 py-2">
                <p className="text-xs text-[#e5e4dd]/80 truncate group-hover:text-[#ffd700] transition-colors">
                  {template.name}
                </p>
              </div>
            </a>
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
    <SectionWrapper>
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
    <SectionWrapper>
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
    <SectionWrapper>
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
    <SectionWrapper>
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
    <SectionWrapper>
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
  show_phone: boolean;
  phone_text_only: boolean;
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
}: AgentPagesSectionProps) {
  const [pageData, setPageData] = useState<AgentPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const attractionFileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    display_first_name: '',
    display_last_name: '',
    phone: '',
    show_phone: false,
    phone_text_only: false,
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    youtube_url: '',
    tiktok_url: '',
    linkedin_url: '',
  });

  // Custom links state
  const [customLinks, setCustomLinks] = useState<CustomLink[]>([]);
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkIcon, setNewLinkIcon] = useState<string | null>(null);
  const [showIconPicker, setShowIconPicker] = useState(false);

  // Links page global settings state
  const [linksSettings, setLinksSettings] = useState<LinksSettings>(DEFAULT_LINKS_SETTINGS);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showStylesModal, setShowStylesModal] = useState(false);

  // Tab navigation state for new UI
  type TabId = 'profile' | 'design' | 'links' | 'attraction';
  const [activeTab, setActiveTab] = useState<TabId>('profile');

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

  // Fetch agent page data
  useEffect(() => {
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
              phone: data.page.phone || '',
              show_phone: data.page.show_phone || false,
              phone_text_only: data.page.phone_text_only || false,
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
  }, [user.id]);

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
      <SectionWrapper>
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-[#ffd700]/30 border-t-[#ffd700] rounded-full animate-spin" />
        </div>
      </SectionWrapper>
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
          phone: data.page.phone || '',
          show_phone: data.page.show_phone || false,
          phone_text_only: data.page.phone_text_only || false,
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
      <SectionWrapper>
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
      </SectionWrapper>
    );
  }

  // TODO: Change to smartagentalliance.com when domain migration is complete
  const pageUrl = `https://saabuildingblocks.pages.dev/${generatedSlug || pageData.slug}`;
  const linktreeUrl = `https://saabuildingblocks.pages.dev/${generatedSlug || pageData.slug}-links`;

  return (
    <SectionWrapper>
      <div className="space-y-6">
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

        {/* Two-Column Layout: Preview (Left) + Settings (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">

          {/* LEFT COLUMN: Live Preview (Sticky on Desktop) */}
          <div className="lg:sticky lg:top-6 lg:self-start order-2 lg:order-1">
            <div className="rounded-xl bg-gradient-to-b from-[#0a0a0a] to-[#151515] border border-white/10 overflow-hidden">
              {/* Preview Header */}
              <div className="px-4 py-3 border-b border-white/10 bg-black/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#e5e4dd]/50 uppercase tracking-wider">Live Preview</span>
                  <span className={`text-xs ${activeTab === 'attraction' ? 'text-[#ffd700]' : 'text-[#4ecdc4]'}`}>
                    {activeTab === 'attraction' ? 'Agent Attraction Page' : 'Linktree'}
                  </span>
                </div>
              </div>

              {/* Preview Content - Attraction Page preview */}
              {activeTab === 'attraction' && (
                <div className="relative w-full overflow-hidden" style={{ height: '600px' }}>
                  {pageData.activated && (generatedSlug || pageData.slug) ? (
                    <iframe
                      src={pageUrl}
                      className="border-0"
                      style={{
                        transform: 'scale(0.35)',
                        transformOrigin: 'top left',
                        width: '286%',
                        height: '286%',
                        pointerEvents: 'none',
                      }}
                      title="Attraction Page Preview"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-[#e5e4dd]/50 text-sm">
                      Activate your page to see preview
                    </div>
                  )}
                  <div className="absolute inset-0 bg-transparent" />
                </div>
              )}

              {/* Preview Content - Linktree preview for Profile/Design/Links tabs */}
              {activeTab !== 'attraction' && (
                <div className="p-0">
                  {/* Linktree Preview */}
                  <div className="flex flex-col items-center gap-4 max-w-[260px] mx-auto">
                    {/* Profile Photo */}
                    <div
                      className="w-24 h-24 rounded-full border-2 flex items-center justify-center overflow-hidden"
                      style={{ borderColor: linksSettings.accentColor, backgroundColor: 'rgba(0,0,0,0.5)' }}
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

                    {/* Name with Neon Effect - matches H1 glow framework from master controller */}
                    <span
                      className="font-bold text-xl text-center"
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

                    {/* Social Icons */}
                    {filledSocialLinks > 0 && (
                      <div className="flex gap-2 flex-wrap justify-center">
                        {formData.facebook_url && (
                          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: `${linksSettings.accentColor}20`, border: `1px solid ${linksSettings.accentColor}40` }}>
                            <svg className="w-3.5 h-3.5" fill={linksSettings.accentColor} viewBox="0 0 24 24"><path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z"/></svg>
                          </div>
                        )}
                        {formData.instagram_url && (
                          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: `${linksSettings.accentColor}20`, border: `1px solid ${linksSettings.accentColor}40` }}>
                            <svg className="w-3.5 h-3.5" fill={linksSettings.accentColor} viewBox="0 0 24 24"><path d="M12,2.16c3.2,0,3.58.01,4.85.07,3.25.15,4.77,1.69,4.92,4.92.06,1.27.07,1.65.07,4.85s-.01,3.58-.07,4.85c-.15,3.23-1.66,4.77-4.92,4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.38,3.92,3.9,2.38,7.15,2.23,8.42,2.18,8.8,2.16,12,2.16ZM12,0C8.74,0,8.33.01,7.05.07,2.7.27.27,2.7.07,7.05.01,8.33,0,8.74,0,12s.01,3.67.07,4.95c.2,4.36,2.62,6.78,6.98,6.98,1.28.06,1.69.07,4.95.07s3.67-.01,4.95-.07c4.35-.2,6.78-2.62,6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.63-6.78-6.98-6.98C15.67.01,15.26,0,12,0Zm0,5.84A6.16,6.16,0,1,0,18.16,12,6.16,6.16,0,0,0,12,5.84ZM12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16ZM18.41,4.15a1.44,1.44,0,1,0,1.44,1.44A1.44,1.44,0,0,0,18.41,4.15Z"/></svg>
                          </div>
                        )}
                        {formData.twitter_url && (
                          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: `${linksSettings.accentColor}20`, border: `1px solid ${linksSettings.accentColor}40` }}>
                            <svg className="w-3.5 h-3.5" fill={linksSettings.accentColor} viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                          </div>
                        )}
                        {formData.youtube_url && (
                          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: `${linksSettings.accentColor}20`, border: `1px solid ${linksSettings.accentColor}40` }}>
                            <svg className="w-3.5 h-3.5" fill={linksSettings.accentColor} viewBox="0 0 24 24"><path d="M23.5,6.19a3.02,3.02,0,0,0-2.12-2.14C19.53,3.5,12,3.5,12,3.5s-7.53,0-9.38.55A3.02,3.02,0,0,0,.5,6.19,31.62,31.62,0,0,0,0,12a31.62,31.62,0,0,0,.5,5.81,3.02,3.02,0,0,0,2.12,2.14c1.85.55,9.38.55,9.38.55s7.53,0,9.38-.55a3.02,3.02,0,0,0,2.12-2.14A31.62,31.62,0,0,0,24,12,31.62,31.62,0,0,0,23.5,6.19ZM9.55,15.5V8.5L15.82,12Z"/></svg>
                          </div>
                        )}
                        {formData.tiktok_url && (
                          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: `${linksSettings.accentColor}20`, border: `1px solid ${linksSettings.accentColor}40` }}>
                            <svg className="w-3.5 h-3.5" fill={linksSettings.accentColor} viewBox="0 0 24 24"><path d="M19.59,6.69a4.83,4.83,0,0,1-3.77-4.25V2h-3.45V15.94a2.91,2.91,0,0,1-2.91,2.91,2.87,2.87,0,0,1-1.49-.42,2.91,2.91,0,0,1,1.49-5.4,2.81,2.81,0,0,1,.89.14V9.66a6.27,6.27,0,0,0-.89-.07A6.36,6.36,0,0,0,3.09,16a6.36,6.36,0,0,0,10.91,4.44V13.47a8.16,8.16,0,0,0,4.77,1.53h.82V11.55a4.83,4.83,0,0,1-4-4.86Z"/></svg>
                          </div>
                        )}
                        {formData.linkedin_url && (
                          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: `${linksSettings.accentColor}20`, border: `1px solid ${linksSettings.accentColor}40` }}>
                            <svg className="w-3.5 h-3.5" fill={linksSettings.accentColor} viewBox="0 0 24 24"><path d="M20.45,20.45H16.89V14.88c0-1.33,0-3.04-1.85-3.04s-2.14,1.45-2.14,2.94v5.66H9.34V9h3.41v1.56h.05a3.74,3.74,0,0,1,3.37-1.85c3.6,0,4.27,2.37,4.27,5.46v6.28ZM5.34,7.43A2.07,2.07,0,1,1,7.41,5.36,2.07,2.07,0,0,1,5.34,7.43Zm1.78,13H3.56V9H7.12ZM22.22,0H1.77A1.75,1.75,0,0,0,0,1.73V22.27A1.75,1.75,0,0,0,1.77,24H22.22A1.76,1.76,0,0,0,24,22.27V1.73A1.76,1.76,0,0,0,22.22,0Z"/></svg>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Phone Number */}
                    {formData.show_phone && formData.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-[#e5e4dd]/80">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                        <span>{formData.phone}</span>
                        {formData.phone_text_only && (
                          <span className="text-[#e5e4dd]/50">(Text Only)</span>
                        )}
                      </div>
                    )}

                    {/* Sample Buttons */}
                    <div className="w-full space-y-2">
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
                                className="w-full py-2 px-4 rounded-lg text-sm font-medium relative"
                                style={{
                                  backgroundColor: linksSettings.accentColor,
                                  color: linksSettings.iconStyle === 'light' ? '#ffffff' : '#1a1a1a',
                                  fontFamily: linksSettings.font === 'taskor' ? 'var(--font-taskor, sans-serif)' : 'var(--font-synonym, sans-serif)'
                                }}
                              >
                                <svg className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                  <circle cx="9" cy="7" r="4" />
                                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                                <span className="block text-center text-xs">Join my Team</span>
                              </div>
                            );
                          }

                          if (linkId === 'learn-about') {
                            return (
                              <div
                                key="learn-about"
                                className="w-full py-2 px-4 rounded-lg text-sm font-medium relative"
                                style={{
                                  backgroundColor: linksSettings.accentColor,
                                  color: linksSettings.iconStyle === 'light' ? '#ffffff' : '#1a1a1a',
                                  fontFamily: linksSettings.font === 'taskor' ? 'var(--font-taskor, sans-serif)' : 'var(--font-synonym, sans-serif)'
                                }}
                              >
                                <svg className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="10" />
                                  <path d="M12 16v-4" />
                                  <path d="M12 8h.01" />
                                </svg>
                                <span className="block text-center text-xs">Learn About my Team</span>
                              </div>
                            );
                          }

                          // Custom link
                          const iconPath = LINK_ICONS.find(i => i.name === customLink?.icon)?.path;
                          return (
                            <div
                              key={linkId}
                              className="w-full py-2 px-4 rounded-lg text-xs font-medium relative"
                              style={{
                                backgroundColor: linksSettings.accentColor,
                                color: linksSettings.iconStyle === 'light' ? '#ffffff' : '#1a1a1a',
                                fontFamily: linksSettings.font === 'taskor' ? 'var(--font-taskor, sans-serif)' : 'var(--font-synonym, sans-serif)'
                              }}
                            >
                              {iconPath && (
                                <svg className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Settings with Tabs */}
          <div className="order-1 lg:order-2">
            {/* Page Links Section - Above Tabs */}
            {pageData.activated && (
              <div className="mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-green-400">Your pages are live</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] hover:bg-[#ffd700]/20 transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    View Attraction Page
                  </a>
                  <a
                    href={linktreeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#4ecdc4]/10 border border-[#4ecdc4]/30 text-[#4ecdc4] hover:bg-[#4ecdc4]/20 transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    View Linktree
                  </a>
                </div>
              </div>
            )}

            {/* Tab Navigation - Mobile-first with horizontal scroll */}
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
              <div className="flex border-b border-white/10 mb-6 min-w-max sm:min-w-0">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 sm:flex-initial px-3 sm:px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === 'profile'
                      ? 'text-[#4ecdc4]'
                      : 'text-[#e5e4dd]/60 hover:text-[#e5e4dd]'
                  }`}
                >
                  Profile
                  {activeTab === 'profile' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4ecdc4]" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('design')}
                  className={`flex-1 sm:flex-initial px-3 sm:px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === 'design'
                      ? 'text-[#4ecdc4]'
                      : 'text-[#e5e4dd]/60 hover:text-[#e5e4dd]'
                  }`}
                >
                  Design
                  {activeTab === 'design' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4ecdc4]" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('links')}
                  className={`flex-1 sm:flex-initial px-3 sm:px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === 'links'
                      ? 'text-[#4ecdc4]'
                      : 'text-[#e5e4dd]/60 hover:text-[#e5e4dd]'
                  }`}
                >
                  Links
                  {customLinks.length > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-[#4ecdc4]/20 text-[#4ecdc4]">
                      {customLinks.length}
                    </span>
                  )}
                  {activeTab === 'links' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4ecdc4]" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('attraction')}
                  className={`flex-1 sm:flex-initial px-3 sm:px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === 'attraction'
                      ? 'text-[#ffd700]'
                      : 'text-[#e5e4dd]/60 hover:text-[#e5e4dd]'
                  }`}
                >
                  Attraction
                  {activeTab === 'attraction' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ffd700]" />
                  )}
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-4">
              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <>
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

                  {/* Phone Settings - Collapsible */}
                  <div className="rounded-lg bg-black/20 border border-white/10 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleSection('phoneSettings')}
                      className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                    >
                      <h4 className="text-sm font-medium text-[#ffd700]">Phone Settings</h4>
                      <svg
                        className={`w-4 h-4 text-[#e5e4dd]/40 transition-transform ${expandedSections.phoneSettings ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedSections.phoneSettings && (
                      <div className="px-4 pb-4 space-y-3">
                        <div>
                          <label className="block text-xs text-[#e5e4dd]/60 mb-1">Phone Number</label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] text-sm focus:border-[#ffd700]/50 focus:outline-none transition-colors"
                            placeholder="(555) 123-4567"
                          />
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.show_phone}
                            onChange={(e) => handleInputChange('show_phone', e.target.checked)}
                            className="w-4 h-4 rounded border-white/20 bg-black/30 accent-[#ffd700]"
                          />
                          <span className="text-xs text-[#e5e4dd]">Show on pages</span>
                        </label>
                        {formData.show_phone && (
                          <label className="flex items-center gap-2 cursor-pointer ml-6">
                            <input
                              type="checkbox"
                              checked={formData.phone_text_only}
                              onChange={(e) => handleInputChange('phone_text_only', e.target.checked)}
                              className="w-4 h-4 rounded border-white/20 bg-black/30 accent-[#ffd700]"
                            />
                            <span className="text-xs text-[#e5e4dd]">Text only</span>
                          </label>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Social Links - Collapsible */}
                  <div className="rounded-lg bg-black/20 border border-white/10 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleSection('socialLinks')}
                      className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-[#ffd700]">Social Links</h4>
                        <span className="text-xs text-[#e5e4dd]/40">{filledSocialLinks} of 6</span>
                      </div>
                      <svg
                        className={`w-4 h-4 text-[#e5e4dd]/40 transition-transform ${expandedSections.socialLinks ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedSections.socialLinks && (
                      <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-[#e5e4dd]/60 mb-1">Facebook</label>
                          <input
                            type="url"
                            value={formData.facebook_url}
                            onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] text-sm focus:border-[#ffd700]/50 focus:outline-none transition-colors"
                            placeholder="https://facebook.com/..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#e5e4dd]/60 mb-1">Instagram</label>
                          <input
                            type="url"
                            value={formData.instagram_url}
                            onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] text-sm focus:border-[#ffd700]/50 focus:outline-none transition-colors"
                            placeholder="https://instagram.com/..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#e5e4dd]/60 mb-1">X (Twitter)</label>
                          <input
                            type="url"
                            value={formData.twitter_url}
                            onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] text-sm focus:border-[#ffd700]/50 focus:outline-none transition-colors"
                            placeholder="https://x.com/..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#e5e4dd]/60 mb-1">YouTube</label>
                          <input
                            type="url"
                            value={formData.youtube_url}
                            onChange={(e) => handleInputChange('youtube_url', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] text-sm focus:border-[#ffd700]/50 focus:outline-none transition-colors"
                            placeholder="https://youtube.com/@..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#e5e4dd]/60 mb-1">TikTok</label>
                          <input
                            type="url"
                            value={formData.tiktok_url}
                            onChange={(e) => handleInputChange('tiktok_url', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] text-sm focus:border-[#ffd700]/50 focus:outline-none transition-colors"
                            placeholder="https://tiktok.com/@..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#e5e4dd]/60 mb-1">LinkedIn</label>
                          <input
                            type="url"
                            value={formData.linkedin_url}
                            onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] text-sm focus:border-[#ffd700]/50 focus:outline-none transition-colors"
                            placeholder="https://linkedin.com/in/..."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* DESIGN TAB */}
              {activeTab === 'design' && (
                <>
                  {/* Bio */}
                  <div className="p-4 rounded-lg bg-black/20 border border-white/10">
                    <h4 className="text-sm font-medium text-[#4ecdc4] mb-2">Bio</h4>
                    <p className="text-xs text-[#e5e4dd]/50 mb-2">Short description below your name</p>
                    <div className="relative">
                      <textarea
                        value={linksSettings.bio}
                        onChange={(e) => {
                          if (e.target.value.length <= 80) {
                            setLinksSettings(prev => ({ ...prev, bio: e.target.value }));
                            setHasUnsavedChanges(true);
                          }
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] text-sm focus:border-[#4ecdc4]/50 focus:outline-none transition-colors resize-none"
                        rows={2}
                        placeholder="Real estate agent helping families find their dream homes..."
                      />
                      <span className={`absolute bottom-2 right-2 text-xs ${
                        linksSettings.bio.length >= 80 ? 'text-red-400' :
                        linksSettings.bio.length >= 60 ? 'text-yellow-400' :
                        'text-[#e5e4dd]/30'
                      }`}>
                        {linksSettings.bio.length}/80
                      </span>
                    </div>
                  </div>

                  {/* Accent Color */}
                  <div className="p-4 rounded-lg bg-black/20 border border-white/10">
                    <h4 className="text-sm font-medium text-[#4ecdc4] mb-2">Accent Color</h4>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowColorPicker(!showColorPicker)}
                          className="w-10 h-10 rounded-lg cursor-pointer border-2 border-white/20 transition-all hover:border-white/40"
                          style={{ backgroundColor: linksSettings.accentColor }}
                        />
                        {showColorPicker && (
                          <div className="absolute z-50 mt-2 left-0">
                            <div className="fixed inset-0" onClick={() => setShowColorPicker(false)} />
                            <div className="relative">
                              <SketchPicker
                                color={linksSettings.accentColor}
                                onChange={(color: ColorResult) => {
                                  setLinksSettings(prev => ({ ...prev, accentColor: color.hex }));
                                  setHasUnsavedChanges(true);
                                }}
                                presetColors={['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ff9f43', '#a55eea', '#26de81']}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ff9f43', '#a55eea', '#26de81'].map(color => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => {
                              setLinksSettings(prev => ({ ...prev, accentColor: color }));
                              setHasUnsavedChanges(true);
                            }}
                            className={`w-6 h-6 rounded-full border-2 transition-all ${
                              linksSettings.accentColor === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-[#e5e4dd]/40">{linksSettings.accentColor}</span>
                    </div>
                  </div>

                  {/* Style Options - Compact Grid */}
                  <div className="p-4 rounded-lg bg-black/20 border border-white/10">
                    <h4 className="text-sm font-medium text-[#4ecdc4] mb-3">Style Options</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Icon Style */}
                      <div>
                        <label className="block text-xs text-[#e5e4dd]/60 mb-2">Button Icons</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => { setLinksSettings(prev => ({ ...prev, iconStyle: 'light' })); setHasUnsavedChanges(true); }}
                            className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded text-xs border transition-colors ${
                              linksSettings.iconStyle === 'light'
                                ? 'bg-[#4ecdc4]/20 border-[#4ecdc4] text-[#4ecdc4]'
                                : 'bg-black/20 border-white/10 text-[#e5e4dd]/70'
                            }`}
                          >
                            <span className="w-3 h-3 rounded-full bg-white" />
                            Light
                          </button>
                          <button
                            type="button"
                            onClick={() => { setLinksSettings(prev => ({ ...prev, iconStyle: 'dark' })); setHasUnsavedChanges(true); }}
                            className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded text-xs border transition-colors ${
                              linksSettings.iconStyle === 'dark'
                                ? 'bg-[#4ecdc4]/20 border-[#4ecdc4] text-[#4ecdc4]'
                                : 'bg-black/20 border-white/10 text-[#e5e4dd]/70'
                            }`}
                          >
                            <span className="w-3 h-3 rounded-full bg-[#1a1a1a] border border-gray-600" />
                            Dark
                          </button>
                        </div>
                      </div>

                      {/* Photo Style */}
                      <div>
                        <label className="block text-xs text-[#e5e4dd]/60 mb-2">Profile Photo</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => { setLinksSettings(prev => ({ ...prev, showColorPhoto: false })); setHasUnsavedChanges(true); }}
                            className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded text-xs border transition-colors ${
                              !linksSettings.showColorPhoto
                                ? 'bg-[#4ecdc4]/20 border-[#4ecdc4] text-[#4ecdc4]'
                                : 'bg-black/20 border-white/10 text-[#e5e4dd]/70'
                            }`}
                          >
                            B&W
                          </button>
                          <button
                            type="button"
                            onClick={() => { setLinksSettings(prev => ({ ...prev, showColorPhoto: true })); setHasUnsavedChanges(true); }}
                            className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded text-xs border transition-colors ${
                              linksSettings.showColorPhoto
                                ? 'bg-[#4ecdc4]/20 border-[#4ecdc4] text-[#4ecdc4]'
                                : 'bg-black/20 border-white/10 text-[#e5e4dd]/70'
                            }`}
                          >
                            Color
                          </button>
                        </div>
                      </div>

                      {/* Button Font */}
                      <div>
                        <label className="block text-xs text-[#e5e4dd]/60 mb-2">Button Font</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => { setLinksSettings(prev => ({ ...prev, font: 'synonym' })); setHasUnsavedChanges(true); }}
                            className={`flex-1 px-2 py-1.5 rounded text-xs border transition-colors ${
                              linksSettings.font === 'synonym'
                                ? 'bg-[#4ecdc4]/20 border-[#4ecdc4] text-[#4ecdc4]'
                                : 'bg-black/20 border-white/10 text-[#e5e4dd]/70'
                            }`}
                            style={{ fontFamily: 'var(--font-synonym, sans-serif)' }}
                          >
                            Synonym
                          </button>
                          <button
                            type="button"
                            onClick={() => { setLinksSettings(prev => ({ ...prev, font: 'taskor' })); setHasUnsavedChanges(true); }}
                            className={`flex-1 px-2 py-1.5 rounded text-xs border transition-colors ${
                              linksSettings.font === 'taskor'
                                ? 'bg-[#4ecdc4]/20 border-[#4ecdc4] text-[#4ecdc4]'
                                : 'bg-black/20 border-white/10 text-[#e5e4dd]/70'
                            }`}
                            style={{ fontFamily: 'var(--font-taskor, sans-serif)', fontWeight: 'bold' }}
                          >
                            Taskor
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* LINKS TAB */}
              {activeTab === 'links' && (
                <>
                  {/* Unified Links List - Default buttons (yellow) + Custom links */}
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
                      <div className="space-y-2">
                        {allLinkIds.map((linkId, index) => {
                          const isDefault = linkId === 'join-team' || linkId === 'learn-about';
                          const defaultButton = DEFAULT_BUTTONS.find(b => b.id === linkId);
                          const customLink = customLinkMap.get(linkId);

                          if (!isDefault && !customLink) return null;

                          const label = isDefault ? defaultButton?.label : customLink?.label;
                          const url = isDefault ? (linkId === 'join-team' ? 'Opens join form' : 'Links to your page') : customLink?.url;

                          return (
                            <div
                              key={linkId}
                              className={`flex items-center gap-2 p-3 rounded-lg group ${
                                isDefault
                                  ? 'bg-[#4ecdc4]/10 border border-[#4ecdc4]/30'
                                  : 'bg-black/20 border border-white/10'
                              }`}
                            >
                              {/* Reorder buttons */}
                              <div className="flex flex-col gap-0.5">
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
                                  className="p-0.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                  <svg className="w-3 h-3 text-[#e5e4dd]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                  className="p-0.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                  <svg className="w-3 h-3 text-[#e5e4dd]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                              </div>

                              {/* Icon for default or custom */}
                              {isDefault ? (
                                <div className="w-7 h-7 rounded bg-[#4ecdc4]/20 border border-[#4ecdc4]/40 flex items-center justify-center flex-shrink-0">
                                  <svg className="w-3.5 h-3.5 text-[#4ecdc4]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d={linkId === 'join-team' ? 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' : 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'} />
                                  </svg>
                                </div>
                              ) : customLink?.icon && (
                                <div className="w-7 h-7 rounded bg-[#4ecdc4]/10 border border-[#4ecdc4]/30 flex items-center justify-center flex-shrink-0">
                                  <svg className="w-3.5 h-3.5 text-[#4ecdc4]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d={LINK_ICONS.find(i => i.name === customLink.icon)?.path || ''} />
                                  </svg>
                                </div>
                              )}

                              {/* Label and description */}
                              <div className="flex-1 min-w-0">
                                <div className={`text-sm truncate ${isDefault ? 'text-[#4ecdc4]' : 'text-[#e5e4dd]'}`}>
                                  {label}
                                  {isDefault && <span className="ml-2 text-xs text-[#4ecdc4]/60">(default)</span>}
                                </div>
                                <div className="text-xs text-[#e5e4dd]/40 truncate">{url}</div>
                              </div>

                              {/* Delete button - only for custom links */}
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
                                  className="p-1.5 rounded text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* Add New Link */}
                  <div className="p-4 rounded-lg bg-black/20 border border-white/10 space-y-3 mt-4">
                    <h4 className="text-sm font-medium text-[#4ecdc4]">Add Custom Button</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-[#e5e4dd]/60 mb-1">Label</label>
                        <input
                          type="text"
                          value={newLinkLabel}
                          onChange={(e) => setNewLinkLabel(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] text-sm focus:border-[#4ecdc4]/50 focus:outline-none"
                          placeholder="e.g., Book a Call"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#e5e4dd]/60 mb-1">URL</label>
                        <input
                          type="url"
                          value={newLinkUrl}
                          onChange={(e) => setNewLinkUrl(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] text-sm focus:border-[#4ecdc4]/50 focus:outline-none"
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    {/* Icon Picker */}
                    <div>
                      <label className="block text-xs text-[#e5e4dd]/60 mb-1">Icon (optional)</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowIconPicker(!showIconPicker)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-[#e5e4dd] text-sm hover:border-[#4ecdc4]/30 transition-colors"
                        >
                          {newLinkIcon ? (
                            <>
                              <svg className="w-4 h-4 text-[#4ecdc4]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d={LINK_ICONS.find(i => i.name === newLinkIcon)?.path || ''} />
                              </svg>
                              <span>{LINK_ICONS.find(i => i.name === newLinkIcon)?.label}</span>
                            </>
                          ) : (
                            <span className="text-[#e5e4dd]/50">Select icon...</span>
                          )}
                        </button>
                        {showIconPicker && (
                          <div className="absolute z-10 mt-2 w-full max-h-48 overflow-y-auto rounded-lg bg-[#1a1a1a] border border-white/20 shadow-xl">
                            <div className="grid grid-cols-5 gap-1 p-2">
                              {LINK_ICONS.map(icon => (
                                <button
                                  key={icon.name}
                                  type="button"
                                  onClick={() => { setNewLinkIcon(icon.name); setShowIconPicker(false); }}
                                  className={`flex flex-col items-center gap-1 p-2 rounded transition-colors ${
                                    newLinkIcon === icon.name ? 'bg-[#4ecdc4]/20 text-[#4ecdc4]' : 'hover:bg-white/10 text-[#e5e4dd]/70'
                                  }`}
                                  title={icon.label}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d={icon.path} />
                                  </svg>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
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
                          // Add to linkOrder
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
                      className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-[#4ecdc4]/10 border border-[#4ecdc4]/30 text-[#4ecdc4] hover:bg-[#4ecdc4]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      + Add Button
                    </button>
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-4 text-xs text-[#e5e4dd]/50 mt-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-yellow-500/20 border border-yellow-500/40"></div>
                      <span>Default buttons (cannot be deleted)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-black/20 border border-white/10"></div>
                      <span>Custom buttons</span>
                    </div>
                  </div>
                </>
              )}

              {/* ATTRACTION TAB */}
              {activeTab === 'attraction' && (
                <div className="space-y-6">
                  {/* Copy Link Buttons */}
                  <div className="p-4 rounded-xl bg-black/30 border border-white/10">
                    <h3 className="text-sm font-medium text-[#e5e4dd]/80 mb-3">Share Your Pages</h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(linktreeUrl);
                          setCopiedLink('linktree');
                          setTimeout(() => setCopiedLink(null), 2000);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#4ecdc4]/10 border border-[#4ecdc4]/30 text-[#4ecdc4] hover:bg-[#4ecdc4]/20 transition-colors text-sm font-medium"
                      >
                        {copiedLink === 'linktree' ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                            Copy Linktree Link
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(pageUrl);
                          setCopiedLink('attraction');
                          setTimeout(() => setCopiedLink(null), 2000);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] hover:bg-[#ffd700]/20 transition-colors text-sm font-medium"
                      >
                        {copiedLink === 'attraction' ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                            Copy Attraction Link
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* How It Works Section */}
                  <div className="p-5 rounded-xl bg-black/20 border border-[#ffd700]/10">
                    <h3 className="text-lg font-medium text-[#ffd700] mb-4">How Your Pages Work Together</h3>

                    <div className="space-y-4 text-sm text-[#e5e4dd]/80">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#4ecdc4]/20 border border-[#4ecdc4]/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-[#4ecdc4] font-bold">1</span>
                        </div>
                        <div>
                          <p className="font-medium text-[#e5e4dd] mb-1">Share Your Linktree Everywhere</p>
                          <p className="text-[#e5e4dd]/60">Your Linktree is your <strong className="text-[#4ecdc4]">one link for everything</strong> - social media bios, email signatures, business cards. It works for both production and attraction simultaneously.</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#ffd700]/20 border border-[#ffd700]/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-[#ffd700] font-bold">2</span>
                        </div>
                        <div>
                          <p className="font-medium text-[#e5e4dd] mb-1">Built-In Agent Attraction</p>
                          <p className="text-[#e5e4dd]/60">Your Attraction Page is linked directly from your Linktree. When competitors scope out your profiles, they see your SAA-branded page, get curious, and land on your attraction funnel.</p>
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
                          <p className="text-[#e5e4dd]/60">Your custom accent color and SAA branding create intrigue. The funnel works in the background - no extra effort from you. Just share your Linktree and let it do both jobs.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* What Happens When Section */}
                  <div className="p-5 rounded-xl bg-black/20 border border-[#ffd700]/10">
                    <h3 className="text-lg font-medium text-[#ffd700] mb-4">What Happens When Prospects Take Action</h3>

                    <div className="space-y-4 text-sm">
                      <div className="p-4 rounded-lg bg-[#ffd700]/5 border border-[#ffd700]/20">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-[#ffd700] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <p className="font-medium text-[#e5e4dd] mb-1">When someone books a call</p>
                            <p className="text-[#e5e4dd]/60">You receive an invite to the meeting. <strong className="text-[#ffd700]">SAA handles the closing</strong> with the prospect. Joining the call is optional - you can attend or let SAA handle it entirely.</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                          <div>
                            <p className="font-medium text-[#e5e4dd] mb-1">When someone clicks &quot;Join&quot; or applies</p>
                            <p className="text-[#e5e4dd]/60">They&apos;re instructed to enter <strong className="text-green-400">your name</strong> as their sponsor when applying to eXp. You get credit for the referral and they join under your downline.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Use Cases */}
                  <div className="p-5 rounded-xl bg-black/20 border border-[#ffd700]/10">
                    <h3 className="text-lg font-medium text-[#ffd700] mb-4">Where to Share Your Pages</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-[#e5e4dd]/70">
                        <svg className="w-4 h-4 text-[#4ecdc4]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                        Email signature
                      </div>
                      <div className="flex items-center gap-2 text-[#e5e4dd]/70">
                        <svg className="w-4 h-4 text-[#4ecdc4]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                        </svg>
                        Social media bio links
                      </div>
                      <div className="flex items-center gap-2 text-[#e5e4dd]/70">
                        <svg className="w-4 h-4 text-[#4ecdc4]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/>
                        </svg>
                        Facebook groups
                      </div>
                      <div className="flex items-center gap-2 text-[#e5e4dd]/70">
                        <svg className="w-4 h-4 text-[#4ecdc4]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                        </svg>
                        Business cards (QR code)
                      </div>
                      <div className="flex items-center gap-2 text-[#e5e4dd]/70">
                        <svg className="w-4 h-4 text-[#4ecdc4]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                        </svg>
                        Direct messages to prospects
                      </div>
                      <div className="flex items-center gap-2 text-[#e5e4dd]/70">
                        <svg className="w-4 h-4 text-[#4ecdc4]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        Recruitment presentations
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>


            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-end mt-6 pt-4 border-t border-white/10">
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
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

// ============================================================================
// Section Wrapper Component
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
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#4ecdc4]/10 text-[#4ecdc4] border border-[#4ecdc4]/20">
          Linktree
        </span>
      )}
    </div>
  );
}
