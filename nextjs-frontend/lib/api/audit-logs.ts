/**
 * Audit Logs API Client
 * Phase 3: Activity Log UI
 *
 * Client-side functions for fetching and filtering audit logs
 */

export interface AuditLog {
  id: string;
  user_id: string | null;
  event_type: string;
  event_category: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  description: string | null;
  metadata: Record<string, any>;
  ip_address: string | null;
  user_agent: string | null;
  request_method: string | null;
  request_path: string | null;
  success: boolean;
  error_message: string | null;
  created_at: string;
  user?: {
    id: string;
    email: string;
    full_name: string | null;
  };
}

export interface AuditLogFilters {
  userId?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  severity?: string;
  limit?: number;
  offset?: number;
}

export interface AuditLogResponse {
  logs: AuditLog[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Fetch audit logs with optional filters
 */
export async function fetchAuditLogs(
  filters: AuditLogFilters = {}
): Promise<AuditLogResponse> {
  const params = new URLSearchParams();

  if (filters.userId) params.append('userId', filters.userId);
  if (filters.action) params.append('action', filters.action);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.severity) params.append('severity', filters.severity);
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.offset) params.append('offset', filters.offset.toString());

  const response = await fetch(`/api/audit-logs?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch audit logs: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Export audit logs to CSV
 */
export async function exportAuditLogs(
  filters: AuditLogFilters = {}
): Promise<Blob> {
  const params = new URLSearchParams();

  if (filters.userId) params.append('userId', filters.userId);
  if (filters.action) params.append('action', filters.action);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.severity) params.append('severity', filters.severity);

  const response = await fetch(`/api/audit-logs/export?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to export audit logs: ${response.statusText}`);
  }

  return response.blob();
}
