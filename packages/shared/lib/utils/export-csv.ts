/**
 * CSV Export Utility
 * Phase 3: Activity Log UI
 *
 * Converts data to CSV format and triggers download
 */

import type { AuditLog } from '@/lib/api/audit-logs';

/**
 * Convert audit logs to CSV format
 */
export function convertAuditLogsToCSV(logs: AuditLog[]): string {
  const headers = [
    'Timestamp',
    'User Email',
    'User Name',
    'Event Type',
    'Category',
    'Severity',
    'Description',
    'IP Address',
    'User Agent',
    'Success',
    'Error Message',
  ];

  const rows = logs.map((log) => [
    log.created_at,
    log.user?.email || 'N/A',
    log.user?.full_name || 'N/A',
    log.event_type,
    log.event_category,
    log.severity,
    log.description || '',
    log.ip_address || 'N/A',
    log.user_agent || 'N/A',
    log.success ? 'Success' : 'Failed',
    log.error_message || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row
        .map((cell) =>
          // Escape commas and quotes in cell content
          typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))
            ? `"${cell.replace(/"/g, '""')}"`
            : cell
        )
        .join(',')
    ),
  ].join('\n');

  return csvContent;
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Export audit logs to CSV file
 */
export function exportAuditLogsToCSV(logs: AuditLog[]): void {
  const csvContent = convertAuditLogsToCSV(logs);
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `audit-logs-${timestamp}.csv`;

  downloadCSV(csvContent, filename);
}
