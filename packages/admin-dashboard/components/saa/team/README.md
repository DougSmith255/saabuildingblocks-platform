# SAA Team Carousel

React/TypeScript 3D carousel for team member displays with full animation support.

## TeamCarousel Component

### Basic Usage

```tsx
import { TeamCarousel, TeamCarouselSimple } from '@/components/saa';

const members = [
  {
    name: 'Sarah Johnson',
    role: 'Team Leader & Mentor',
    image: '/team/sarah.jpg',
    social: {
      linkedin: 'https://linkedin.com/in/sarah',
      email: 'sarah@example.com'
    }
  },
  {
    name: 'Michael Chen',
    role: 'Luxury Home Specialist',
    image: '/team/michael.jpg'
  }
];

// Full carousel with all features
<TeamCarousel members={members} showSocial autoRotate={5000} />

// Simplified version
<TeamCarouselSimple members={members} />
```

### Props

- `members: TeamMember[]` - Array of team members
- `autoRotate?: number` - Auto-rotate interval in ms (0 to disable)
- `showArrows?: boolean` - Show navigation arrows (default: true)
- `showDots?: boolean` - Show navigation dots (default: true)
- `showSocial?: boolean` - Show social icons (default: false)
- `onMemberChange?: (member, index) => void` - Member change callback

### TeamMember Interface

```typescript
interface TeamMember {
  id?: string;
  name: string;
  role: string;
  image?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}
```

### Features

- ✅ 3D carousel with depth positioning
- ✅ 5 visible cards (center, up-1, up-2, down-1, down-2)
- ✅ Smooth slide animations
- ✅ Keyboard navigation (Arrow keys)
- ✅ Touch/swipe support
- ✅ Auto-rotation option
- ✅ Social media links
- ✅ Responsive (desktop/tablet/mobile)
- ✅ Image lazy loading
- ✅ Accessibility (ARIA labels)

### State Management

- Uses React hooks for carousel state
- Smooth transitions with GPU acceleration
- Touch gesture detection
- Auto-rotation with cleanup
- Keyboard event handling

### Preserved from Original

- 3D transform effects (translateY, scale, translateZ)
- Card position classes (center, up-1, up-2, down-1, down-2)
- Gold glow on active member
- Grayscale filters on non-center cards
- Mobile overlay layout
- Desktop sidebar controls
- All CSS animations and timing
