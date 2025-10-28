/**
 * Action Badge Component
 * Phase 3: Activity Log UI
 *
 * Color-coded badges for audit log event types
 */

interface ActionBadgeProps {
  action: string;
  severity?: 'info' | 'warning' | 'error' | 'critical';
}

export function ActionBadge({ action, severity = 'info' }: ActionBadgeProps) {
  const getActionColor = (actionType: string): string => {
    const normalizedAction = actionType.toLowerCase();

    // CREATE → Green
    if (normalizedAction.includes('create') || normalizedAction.includes('register')) {
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    }

    // UPDATE → Blue
    if (normalizedAction.includes('update') || normalizedAction.includes('edit')) {
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }

    // DELETE → Red
    if (normalizedAction.includes('delete') || normalizedAction.includes('remove')) {
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    }

    // LOGIN → Gold
    if (normalizedAction.includes('login') || normalizedAction.includes('signin')) {
      return 'bg-[#ffd700]/20 text-[#ffd700] border-[#ffd700]/30';
    }

    // LOGOUT → Gray
    if (normalizedAction.includes('logout') || normalizedAction.includes('signout')) {
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }

    // Default based on severity
    switch (severity) {
      case 'critical':
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const colorClass = getActionColor(action);

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
        ${colorClass}
      `}
    >
      {action}
    </span>
  );
}
