# SAA Icon Library

React/TypeScript icon display components with grid layouts and interaction support.

## IconLibrary Component

### Basic Usage

```tsx
import { IconLibrary, Icon } from '@/components/saa';

// Full icon library with defaults
<IconLibrary />

// Custom size and configuration
<IconLibrary size="large" columns={6} showLabels />

// Custom icons
const customIcons = [
  { id: 'email', label: 'Email', className: 'email-icon' },
  { id: 'linkedin', label: 'LinkedIn', className: 'linkedin-icon' }
];

<IconLibrary icons={customIcons} onIconClick={(icon) => console.log(icon)} />
```

### Props

- `icons?: IconConfig[]` - Custom icon set (defaults to SAA icons)
- `size?: 'small' | 'medium' | 'large' | 'xl'` - Icon size
- `columns?: number` - Grid columns
- `showLabels?: boolean` - Display labels (default: true)
- `onIconClick?: (icon: IconConfig) => void` - Click handler

### Single Icon Usage

```tsx
<Icon icon="email" size="large" />
<Icon icon="linkedin" size="small" ariaLabel="LinkedIn profile" />
```

### Default Icons

#### Social (5 icons)
- email-icon, webinar-icon, linkedin-icon, youtube-icon, calendar-icon

#### UI (4 icons)
- rocket (bi--rocket-takeoff), bolt, trophy, team

#### Navigation (4 arrows)
- up, down, left, right (saa-arrow)

#### Status (2 icons)
- check, x (saa-icon-check, saa-icon-x)

### Features

- ✅ Grid layout with auto-fit columns
- ✅ Multiple size variants
- ✅ Click/keyboard interaction
- ✅ Category grouping (IconGrid)
- ✅ Accessible labels
- ✅ Responsive design
