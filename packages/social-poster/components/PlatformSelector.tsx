'use client';

import { useEffect, useState } from 'react';

interface Platform {
  id: string;
  name: string;
  connected: boolean;
}

interface PlatformSelectorProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  disabled?: boolean;
}

const PLATFORMS: Platform[] = [
  { id: 'twitter', name: 'X (Twitter)', connected: false },
  { id: 'linkedin', name: 'LinkedIn', connected: false },
  { id: 'facebook', name: 'Facebook', connected: false },
  { id: 'pinterest', name: 'Pinterest', connected: false },
  { id: 'medium', name: 'Medium', connected: false },
];

export default function PlatformSelector({ selected, onChange, disabled }: PlatformSelectorProps) {
  const [platforms, setPlatforms] = useState<Platform[]>(PLATFORMS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch platform connection status
    async function checkPlatformStatus() {
      try {
        const response = await fetch('/social-poster/api/platforms/status');
        if (response.ok) {
          const data = await response.json();
          setPlatforms(prevPlatforms =>
            prevPlatforms.map(platform => ({
              ...platform,
              connected: data[platform.id]?.connected || false,
            }))
          );
        }
      } catch (error) {
        console.error('Error checking platform status:', error);
      } finally {
        setIsLoading(false);
      }
    }

    checkPlatformStatus();
  }, []);

  const togglePlatform = (platformId: string) => {
    if (disabled) return;

    if (selected.includes(platformId)) {
      onChange(selected.filter(id => id !== platformId));
    } else {
      onChange([...selected, platformId]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Select Platforms
      </label>

      {isLoading ? (
        <div className="text-sm text-gray-500 dark:text-gray-400">Checking platform connections...</div>
      ) : (
        <div className="space-y-2">
          {platforms.map(platform => (
            <div
              key={platform.id}
              onClick={() => togglePlatform(platform.id)}
              className={`
                flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all
                ${selected.includes(platform.id)
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selected.includes(platform.id)}
                  onChange={() => {}} // Handled by div onClick
                  disabled={disabled}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="font-medium text-gray-900 dark:text-white">
                  {platform.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`
                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${platform.connected
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }
                  `}
                >
                  <span className={`h-2 w-2 rounded-full mr-1.5 ${platform.connected ? 'bg-green-500' : 'bg-red-500'}`} />
                  {platform.connected ? 'Connected' : 'Not Connected'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400">
        Note: Only connected platforms will be able to receive posts
      </p>
    </div>
  );
}
