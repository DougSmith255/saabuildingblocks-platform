'use client';

interface StatusResult {
  status: 'pending' | 'posting' | 'success' | 'failed';
  message?: string;
}

interface PostingStatusProps {
  results: Record<string, StatusResult>;
}

const PLATFORM_NAMES: Record<string, string> = {
  twitter: 'X (Twitter)',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  pinterest: 'Pinterest',
  medium: 'Medium',
};

export default function PostingStatus({ results }: PostingStatusProps) {
  const getStatusIcon = (status: StatusResult['status']) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'failed':
        return '❌';
      case 'posting':
        return '⏳';
      default:
        return '⏱️';
    }
  };

  const getStatusColor = (status: StatusResult['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      case 'posting':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusText = (status: StatusResult['status']) => {
    switch (status) {
      case 'success':
        return 'Posted successfully';
      case 'failed':
        return 'Failed';
      case 'posting':
        return 'Posting...';
      default:
        return 'Pending';
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Posting Status
      </h3>

      <div className="space-y-2">
        {Object.entries(results).map(([platformId, result]) => (
          <div
            key={platformId}
            className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getStatusIcon(result.status)}</span>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {PLATFORM_NAMES[platformId] || platformId}
                </div>
                <div className={`text-sm ${getStatusColor(result.status)}`}>
                  {getStatusText(result.status)}
                  {result.message && ` - ${result.message}`}
                </div>
              </div>
            </div>

            {result.status === 'posting' && (
              <div className="flex items-center">
                <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
