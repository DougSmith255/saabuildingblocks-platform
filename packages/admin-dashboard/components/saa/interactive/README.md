# SAA Interactive Components

React/TypeScript components converted from HTML originals with full state management and animations.

## Accordion Component

### Basic Usage

```tsx
import { Accordion } from '@/components/saa';

const items = [
  {
    title: 'Why Choose eXp Realty?',
    content: (
      <div>
        <p>eXp Realty offers a unique cloud-based model with:</p>
        <ul>
          <li>Global collaboration opportunities</li>
          <li>Industry-leading commission structure</li>
        </ul>
      </div>
    )
  },
  {
    title: 'Revenue Sharing',
    content: <p>Build passive income...</p>
  }
];

<Accordion items={items} />
```

### Props

- `items: AccordionItem[]` - Array of accordion items
- `allowMultiple?: boolean` - Allow multiple items open (default: false)
- `variant?: 'default' | 'small' | 'compact'` - Size variant
- `onExpand?: (itemId: string) => void` - Expand callback
- `onCollapse?: (itemId: string) => void` - Collapse callback

### Features

- ✅ Smooth expand/collapse animations
- ✅ Keyboard navigation (Arrow keys, Home, End)
- ✅ Accessibility (ARIA attributes)
- ✅ Single or multiple item expansion
- ✅ Custom content support (React nodes)
- ✅ Responsive design

### State Management

- Uses React hooks (useState, useEffect, useRef)
- Smooth height calculations for animations
- GPU-accelerated transitions
- Proper cleanup on unmount

### Preserved from Original

- Arrow rotation animations
- Gold glow effects on hover/active
- Glass-card styling
- All CSS transitions and timing
