/**
 * Export Button Component
 * Phase 3: Activity Log UI
 *
 * Button to export audit logs to CSV
 */

'use client';

import { Download } from 'lucide-react';
import { exportAuditLogsToCSV } from '@/lib/utils/export-csv';
import type { AuditLog } from '@/lib/api/audit-logs';

interface ExportButtonProps {
  logs: AuditLog[];
  disabled?: boolean;
}

export function ExportButton({ logs, disabled = false }: ExportButtonProps) {
  const handleExport = () => {
    if (logs.length === 0) {
      alert('No logs to export');
      return;
    }

    exportAuditLogsToCSV(logs);
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || logs.length === 0}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
        ${
          disabled || logs.length === 0
            ? 'bg-[#404040]/50 text-[#dcdbd5]/50 cursor-not-allowed'
            : 'bg-[#404040]/60 text-[#ffd700] hover:bg-[#404040] border border-[#ffd700]/30 hover:border-[#ffd700]'
        }
      `}
      style={
        !disabled && logs.length > 0
          ? {
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }
          : undefined
      }
    >
      <Download className="w-4 h-4" />
      <span>Export CSV</span>
      {logs.length > 0 && (
        <span className="ml-1 text-xs text-[#dcdbd5]/70">({logs.length})</span>
      )}
    </button>
  );
}
