'use client';

/**
 * PropagationResults Component
 *
 * Displays the results of a token propagation operation
 * Shows success/failure for each location with detailed messages
 */

import { CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';

interface LocationResult {
  success: boolean;
  location?: string;
  error?: string;
  details?: string;
}

interface PropagationResultsProps {
  success: boolean;
  timestamp: string;
  token: {
    id: string;
    service_name: string;
    token_type: string;
  };
  locations: {
    env?: LocationResult;
    github?: LocationResult;
  };
  errors: string[];
  summary: string;
}

export function PropagationResults({
  success,
  timestamp,
  token,
  locations,
  errors,
  summary,
}: PropagationResultsProps) {
  const locationCount = Object.keys(locations).length;
  const successCount = Object.values(locations).filter(loc => loc.success).length;
  const failureCount = locationCount - successCount;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-shrink-0">
          {success ? (
            <CheckCircle className="w-8 h-8 text-green-400" />
          ) : failureCount === locationCount ? (
            <XCircle className="w-8 h-8 text-red-400" />
          ) : (
            <AlertCircle className="w-8 h-8 text-yellow-400" />
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-[var(--font-taskor)] text-white mb-1">
            Propagation {success ? 'Completed' : 'Failed'}
          </h3>
          <p className="text-sm text-gray-400 mb-2">
            {token.service_name} - {token.token_type}
          </p>
          <p className="text-sm text-gray-300">
            {summary}
          </p>
        </div>

        <div className="text-right text-xs text-gray-500">
          {new Date(timestamp).toLocaleString()}
        </div>
      </div>

      {/* Location Results */}
      <div className="space-y-3">
        <h4 className="text-sm font-[var(--font-taskor)] text-gray-300 mb-2">
          Locations ({successCount}/{locationCount} successful)
        </h4>

        {/* .env.local */}
        {locations.env && (
          <LocationResultCard
            name=".env.local"
            icon="📄"
            result={locations.env}
          />
        )}

        {/* GitHub Secrets */}
        {locations.github && (
          <LocationResultCard
            name="GitHub Repository Secrets"
            icon="🔒"
            result={locations.github}
            link={`https://github.com/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/settings/secrets/actions`}
          />
        )}
      </div>

      {/* Error Summary */}
      {errors.length > 0 && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-800 rounded">
          <h4 className="text-sm font-[var(--font-taskor)] text-red-300 mb-2">
            Errors ({errors.length})
          </h4>
          <ul className="space-y-1 text-xs text-red-200">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Individual location result card
 */
function LocationResultCard({
  name,
  icon,
  result,
  link,
}: {
  name: string;
  icon: string;
  result: LocationResult;
  link?: string;
}) {
  return (
    <div
      className={`p-4 rounded border ${
        result.success
          ? 'bg-green-900/10 border-green-800'
          : 'bg-red-900/10 border-red-800'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {result.success ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <XCircle className="w-5 h-5 text-red-400" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{icon}</span>
            <h5 className="text-sm font-[var(--font-taskor)] text-white">
              {name}
            </h5>
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00ff88] hover:text-[#00cc6a] transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          {result.location && (
            <p className="text-xs text-gray-400 mb-1">
              Location: {result.location}
            </p>
          )}

          {result.details && (
            <p className="text-xs text-gray-300">
              {result.details}
            </p>
          )}

          {result.error && (
            <p className="text-xs text-red-300">
              Error: {result.error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Dry Run Preview Component
 *
 * Shows what locations will be updated before actual propagation
 */
export function PropagationPreview({
  locations,
  warnings,
  onConfirm,
  onCancel,
}: {
  locations: string[];
  warnings?: string[];
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-[var(--font-taskor)] text-white mb-4">
        Confirm Token Propagation
      </h3>

      <p className="text-sm text-gray-300 mb-4">
        This will update the token in the following {locations.length} location(s):
      </p>

      <ul className="space-y-2 mb-4">
        {locations.map((location, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-gray-200">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>{location}</span>
          </li>
        ))}
      </ul>

      {warnings && warnings.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-800 rounded">
          <h4 className="text-sm font-[var(--font-taskor)] text-yellow-300 mb-2">
            Warnings
          </h4>
          <ul className="space-y-1 text-xs text-yellow-200">
            {warnings.map((warning, index) => (
              <li key={index}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-[var(--font-taskor)] text-gray-300
                   hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 text-sm font-[var(--font-taskor)] bg-[#00ff88]
                   text-gray-900 rounded hover:bg-[#00cc6a] transition-colors"
        >
          Confirm Propagation
        </button>
      </div>
    </div>
  );
}
