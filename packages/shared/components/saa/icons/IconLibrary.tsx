'use client';

/**
 * Icon configuration interface
 */
export interface IconConfig {
  /** Unique identifier for the icon */
  id: string;
  /** Display name/label for the icon */
  label: string;
  /** CSS class name for the icon */
  className: string;
  /** Optional category for grouping */
  category?: 'social' | 'ui' | 'navigation' | 'status' | 'custom';
}

/**
 * IconLibraryProps interface
 */
export interface IconLibraryProps {
  /** Array of icons to display */
  icons?: IconConfig[];
  /** Size variant for icons */
  size?: 'small' | 'medium' | 'large' | 'xl';
  /** Number of columns in grid layout */
  columns?: number;
  /** Show icon labels */
  showLabels?: boolean;
  /** Custom class name */
  className?: string;
  /** Callback when icon is clicked */
  onIconClick?: (icon: IconConfig) => void;
}

/**
 * Default SAA icon set - Complete library from home page footer
 */
const DEFAULT_ICONS: IconConfig[] = [
  // Social/Communication icons
  { id: 'email', label: 'Email', className: 'email-icon', category: 'social' },
  { id: 'webinar', label: 'Webinar', className: 'webinar-icon', category: 'social' },
  { id: 'linkedin', label: 'LinkedIn', className: 'linkedin-icon', category: 'social' },
  { id: 'youtube', label: 'YouTube', className: 'youtube-icon', category: 'social' },
  { id: 'calendar', label: 'Calendar', className: 'calendar-icon', category: 'social' },

  // Action/UI icons
  { id: 'rocket', label: 'Rocket', className: 'bi--rocket-takeoff', category: 'ui' },
  { id: 'bolt', label: 'Bolt', className: 'heroicons--bolt-16-solid', category: 'ui' },
  { id: 'trophy', label: 'Trophy', className: 'heroicons--trophy-16-solid', category: 'ui' },
  { id: 'team', label: 'Team', className: 'fluent--people-team-16-filled', category: 'ui' },

  // Navigation arrows
  { id: 'arrow-up', label: 'Up Arrow', className: 'saa-arrow up', category: 'navigation' },
  { id: 'arrow-down', label: 'Down Arrow', className: 'saa-arrow down', category: 'navigation' },
  { id: 'arrow-left', label: 'Left Arrow', className: 'saa-arrow left', category: 'navigation' },
  { id: 'arrow-right', label: 'Right Arrow', className: 'saa-arrow right', category: 'navigation' },

  // Status icons
  { id: 'check', label: 'Check', className: 'saa-icon-check', category: 'status' },
  { id: 'x', label: 'X Mark', className: 'saa-icon-x', category: 'status' }
];

/**
 * IconLibrary Component
 *
 * Displays a grid of SAA design system icons with optional labels and interaction.
 * Supports multiple size variants and custom icon sets.
 *
 * @example
 * ```tsx
 * // Default icon library
 * <IconLibrary />
 *
 * // Custom size and columns
 * <IconLibrary size="large" columns={6} />
 *
 * // Custom icons with click handler
 * const customIcons = [
 *   { id: 'custom1', label: 'Custom Icon', className: 'custom-icon' }
 * ];
 * <IconLibrary icons={customIcons} onIconClick={(icon) => console.log(icon)} />
 * ```
 */
export function IconLibrary({
  icons = DEFAULT_ICONS,
  size = 'medium',
  columns = 4,
  showLabels = true,
  className = '',
  onIconClick
}: IconLibraryProps) {
  const sizeClass = `icon-${size}`;

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fit, minmax(120px, 1fr))`,
    gap: 'var(--space-4)',
    textAlign: 'center' as const,
    padding: 'var(--space-4)'
  };

  return (
    <div className={`saa-icon-library ${className}`} style={gridStyle}>
      {icons.map((icon) => (
        <IconItem
          key={icon.id}
          icon={icon}
          size={sizeClass}
          showLabel={showLabels}
          onClick={onIconClick}
        />
      ))}
    </div>
  );
}

/**
 * IconItem Component
 * Individual icon with optional label
 */
interface IconItemProps {
  icon: IconConfig;
  size: string;
  showLabel: boolean;
  onClick?: (icon: IconConfig) => void;
}

function IconItem({ icon, size, showLabel, onClick }: IconItemProps) {
  const handleClick = () => {
    onClick?.(icon);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className="saa-icon-item"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease'
      }}
    >
      <div
        className={`${icon.className} ${size}`}
        style={{ marginBottom: 'var(--space-2)' }}
        aria-label={icon.label}
      />
      {showLabel && (
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.875rem',
            margin: 0
          }}
        >
          {icon.label}
        </p>
      )}
    </div>
  );
}

/**
 * IconGrid Component - Alternative layout with category grouping
 */
export interface IconGridProps extends IconLibraryProps {
  /** Group icons by category */
  groupByCategory?: boolean;
}

export function IconGrid({
  icons = DEFAULT_ICONS,
  size = 'medium',
  showLabels = true,
  groupByCategory = false,
  className = '',
  onIconClick
}: IconGridProps) {
  if (!groupByCategory) {
    return (
      <IconLibrary
        icons={icons}
        size={size}
        showLabels={showLabels}
        className={className}
        onIconClick={onIconClick}
      />
    );
  }

  // Group icons by category
  const groupedIcons = icons.reduce((acc, icon) => {
    const category = icon.category || 'custom';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(icon);
    return acc;
  }, {} as Record<string, IconConfig[]>);

  return (
    <div className={`saa-icon-grid ${className}`}>
      {Object.entries(groupedIcons).map(([category, categoryIcons]) => (
        <div key={category} style={{ marginBottom: 'var(--space-8)' }}>
          <h3
            style={{
              color: 'var(--gold-primary, #FFD700)',
              marginBottom: 'var(--space-4)',
              textTransform: 'capitalize'
            }}
          >
            {category}
          </h3>
          <IconLibrary
            icons={categoryIcons}
            size={size}
            showLabels={showLabels}
            onIconClick={onIconClick}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Single Icon Component - Render individual icon
 */
export interface SingleIconProps {
  /** Icon identifier or className */
  icon: string;
  /** Size variant */
  size?: 'small' | 'medium' | 'large' | 'xl';
  /** Custom className */
  className?: string;
  /** Aria label for accessibility */
  ariaLabel?: string;
}

export function Icon({ icon, size = 'medium', className = '', ariaLabel }: SingleIconProps) {
  const sizeClass = `icon-${size}`;
  const iconClass = icon.includes(' ') ? icon : DEFAULT_ICONS.find(i => i.id === icon)?.className || icon;

  return (
    <div
      className={`${iconClass} ${sizeClass} ${className}`}
      aria-label={ariaLabel || icon}
      role="img"
    />
  );
}
