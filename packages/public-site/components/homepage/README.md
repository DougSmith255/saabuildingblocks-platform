# Homepage Components

This directory contains all components specific to the Smart Agent Alliance homepage.

## HeroSection Component

### Overview
The `HeroSection` component is the main hero section for the homepage, featuring dynamic content fetched from the WordPress API.

### Features
- **Dynamic Content**: Fetches hero data from WordPress REST API
- **Animations**: Framer Motion fade-in-up animations on mount
- **Responsive Design**: Mobile-first responsive layout
- **Brand Colors**: Gold color scheme (gold-500 for CTA)
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- **Error Handling**: Graceful loading and error states
- **Performance**: ISR with 1-hour revalidation

### Data Structure

```typescript
interface HeroData {
  headline: string;      // Main headline text
  subheadline: string;   // Subheadline/description
  cta_text: string;      // Call-to-action button text
  cta_url: string;       // CTA destination URL
}
```

### API Endpoint

**Endpoint**: `GET /wp-json/saa/v1/homepage`

**Response**:
```json
{
  "hero": {
    "headline": "Welcome to Smart Agent Alliance",
    "subheadline": "Team-focused support for real estate professionals",
    "cta_text": "Get Started",
    "cta_url": "/join"
  }
}
```

### Usage

```tsx
import { HeroSection } from '@/components/homepage';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      {/* Other homepage sections */}
    </main>
  );
}
```

### Styling

- **Background**: Gradient from neutral-50 to white
- **Headline**: Display-xl typography (fluid, responsive)
- **Subheadline**: Body-lg typography with neutral-600 color
- **CTA Button**: 
  - Background: gold-500
  - Text: neutral-900
  - Hover: gold-600 with scale and shadow effects
  - Focus: gold-500 ring for accessibility

### Animation Details

Uses Framer Motion with staggered animations:
1. Container: 0s delay
2. Headline: 0.1s delay
3. Subheadline: 0.2s delay
4. CTA Button: 0.3s delay

All animations use 0.6s duration with easeOut easing.

### Error States

- **Loading**: Skeleton UI with pulsing placeholders
- **Error**: Red alert box with error message
- **Missing Data**: Fallback error state

### Environment Variables

Required:
- `NEXT_PUBLIC_WORDPRESS_API_URL`: WordPress API base URL
  - Example: `https://saabuildingblocks.com/wp-json/wp/v2`

### TypeScript Support

Fully typed with TypeScript interfaces for:
- Hero data structure
- API response format
- Component props (none required)

### Accessibility Features

- Semantic HTML (`<section>`, `<h1>`, `<p>`)
- ARIA labels for screen readers
- Keyboard navigation support
- Focus visible states
- Proper heading hierarchy

### Browser Support

- Modern browsers (ES2020+)
- Next.js 16 compatible
- React 19 compatible
- Framer Motion 12+ required

### Performance

- **ISR**: 1-hour revalidation for fresh content
- **Code Splitting**: Client component with dynamic imports
- **Optimized Animations**: GPU-accelerated transforms
- **Lazy Loading**: Content below fold can be deferred

## Development

### Testing the Component

```bash
# Start development server
npm run dev

# Visit http://localhost:3000
```

### Modifying Content

Content is managed in WordPress. To update:
1. Log into WordPress admin
2. Navigate to custom endpoint settings
3. Update hero section fields
4. Content will refresh after 1 hour (or on rebuild)

### Customization

To customize styling, edit:
- Typography: `/app/globals.css` (display-xl, body-lg classes)
- Colors: Tailwind config and CSS variables
- Animations: Framer Motion variants in component
- Layout: Container padding and responsive breakpoints
