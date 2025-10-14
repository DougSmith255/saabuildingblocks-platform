/**
 * SAA Components - Usage Examples
 *
 * Comprehensive examples for using Scrollport and ScrollGallery components
 */

import React from 'react';
import { Scrollport, ScrollGallery } from '@/components/saa';
import type { ScrollportItem, GalleryItem } from '@/components/saa';

// ============================================================================
// EXAMPLE 1: Basic Scrollport Navigation
// ============================================================================

export function BasicScrollportExample() {
  const items: ScrollportItem[] = [
    {
      id: 'revenue',
      title: 'Revenue Sharing',
      description: 'Build passive income streams',
      sectionId: 'revenue-section',
    },
    {
      id: 'team',
      title: 'Team Building',
      description: 'Scale your business',
      sectionId: 'team-section',
    },
    {
      id: 'training',
      title: 'Training',
      description: 'World-class resources',
      sectionId: 'training-section',
    },
  ];

  return (
    <div>
      <Scrollport
        items={items}
        showArrows
        enableScrollToSection
        onActiveChange={(index, item) => {
          console.log('Active section:', item.title);
        }}
      />

      {/* Your page sections */}
      <section id="revenue-section">
        <h2>Revenue Sharing</h2>
        {/* Content */}
      </section>

      <section id="team-section">
        <h2>Team Building</h2>
        {/* Content */}
      </section>

      <section id="training-section">
        <h2>Training</h2>
        {/* Content */}
      </section>
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Auto-Advance Scrollport Carousel
// ============================================================================

export function AutoAdvanceScrollportExample() {
  const features: ScrollportItem[] = [
    {
      id: '1',
      title: 'Feature 1',
      description: 'Amazing feature',
    },
    {
      id: '2',
      title: 'Feature 2',
      description: 'Another great feature',
    },
    {
      id: '3',
      title: 'Feature 3',
      description: 'Best feature ever',
    },
  ];

  return (
    <Scrollport
      items={features}
      autoAdvanceInterval={5000} // Auto-advance every 5 seconds
      showArrows
      enableKeyboardNav
      className="my-custom-scrollport"
    />
  );
}

// ============================================================================
// EXAMPLE 3: Full-Width Scrollport
// ============================================================================

export function FullWidthScrollportExample() {
  const pages: ScrollportItem[] = [
    { id: 'home', title: 'Home', description: 'Welcome page' },
    { id: 'about', title: 'About', description: 'About us' },
    { id: 'services', title: 'Services', description: 'Our services' },
    { id: 'contact', title: 'Contact', description: 'Get in touch' },
  ];

  return (
    <Scrollport
      items={pages}
      fullWidth // Spans full viewport width
      showArrows
    />
  );
}

// ============================================================================
// EXAMPLE 4: Basic Scroll Gallery
// ============================================================================

export function BasicScrollGalleryExample() {
  const items: GalleryItem[] = [
    {
      id: '1',
      title: 'Premium Services',
      description: 'Comprehensive real estate solutions with personalized attention',
    },
    {
      id: '2',
      title: 'Market Analysis',
      description: 'In-depth market research and competitive pricing strategies',
    },
    {
      id: '3',
      title: 'Lead Generation',
      description: 'Advanced marketing systems to attract qualified buyers',
    },
    {
      id: '4',
      title: 'Team Support',
      description: 'Dedicated team members to support your success',
    },
  ];

  return (
    <ScrollGallery
      items={items}
      showArrows
      showIndicators
    />
  );
}

// ============================================================================
// EXAMPLE 5: Interactive Gallery with Links
// ============================================================================

export function InteractiveGalleryExample() {
  const services: GalleryItem[] = [
    {
      id: 'service-1',
      title: 'Buyer Services',
      description: 'Help clients find their dream home',
      link: '/services/buyers',
    },
    {
      id: 'service-2',
      title: 'Seller Services',
      description: 'Maximize property value and exposure',
      link: '/services/sellers',
    },
    {
      id: 'service-3',
      title: 'Investment',
      description: 'Real estate investment opportunities',
      link: '/services/investment',
    },
  ];

  const handleItemClick = (item: GalleryItem, index: number) => {
    // Track analytics
    console.log('Gallery item clicked:', item.title, 'at index', index);
    // Custom navigation logic can go here
  };

  return (
    <ScrollGallery
      items={services}
      showArrows
      showIndicators
      onItemClick={handleItemClick}
    />
  );
}

// ============================================================================
// EXAMPLE 6: Auto-Scrolling Gallery with Parallax
// ============================================================================

export function AutoScrollGalleryExample() {
  const testimonials: GalleryItem[] = [
    {
      id: 't1',
      title: 'John Smith',
      description: 'Working with SAA transformed my real estate career. Highly recommended!',
    },
    {
      id: 't2',
      title: 'Sarah Johnson',
      description: 'The training and support are unmatched. Best decision I ever made.',
    },
    {
      id: 't3',
      title: 'Mike Davis',
      description: 'Amazing team and resources. My business has grown 300% this year.',
    },
    {
      id: 't4',
      title: 'Lisa Chen',
      description: 'The revenue sharing model provides great passive income streams.',
    },
  ];

  return (
    <ScrollGallery
      items={testimonials}
      autoScrollInterval={6000} // Auto-scroll every 6 seconds
      enableParallax // Scroll-synced movement
      showArrows
      showIndicators
      scrollAmount={1}
    />
  );
}

// ============================================================================
// EXAMPLE 7: Custom Styled Gallery
// ============================================================================

export function CustomStyledGalleryExample() {
  const products: GalleryItem[] = [
    { id: 'p1', title: 'Product 1', description: 'Description 1' },
    { id: 'p2', title: 'Product 2', description: 'Description 2' },
    { id: 'p3', title: 'Product 3', description: 'Description 3' },
  ];

  return (
    <ScrollGallery
      items={products}
      itemWidth={350} // Custom width
      gap={2} // Larger gap (2rem)
      showArrows
      showIndicators
      className="custom-gallery-styles"
    />
  );
}

// ============================================================================
// EXAMPLE 8: Multi-Scroll Gallery (Multiple Items)
// ============================================================================

export function MultiScrollGalleryExample() {
  const features: GalleryItem[] = Array.from({ length: 12 }, (_, i) => ({
    id: `feature-${i + 1}`,
    title: `Feature ${i + 1}`,
    description: `Description for feature ${i + 1}`,
  }));

  return (
    <ScrollGallery
      items={features}
      scrollAmount={3} // Scroll 3 items at a time
      showArrows
      showIndicators
    />
  );
}

// ============================================================================
// EXAMPLE 9: Combined Navigation and Gallery
// ============================================================================

export function CombinedExample() {
  const sections: ScrollportItem[] = [
    {
      id: 'services',
      title: 'Services',
      description: 'Our services',
      sectionId: 'services-section',
    },
    {
      id: 'testimonials',
      title: 'Testimonials',
      description: 'Client reviews',
      sectionId: 'testimonials-section',
    },
  ];

  const services: GalleryItem[] = [
    { id: 's1', title: 'Service 1', description: 'Description 1' },
    { id: 's2', title: 'Service 2', description: 'Description 2' },
  ];

  const testimonials: GalleryItem[] = [
    { id: 't1', title: 'Client 1', description: 'Review 1' },
    { id: 't2', title: 'Client 2', description: 'Review 2' },
  ];

  return (
    <div>
      {/* Navigation */}
      <Scrollport
        items={sections}
        enableScrollToSection
        showArrows
      />

      {/* Services Gallery */}
      <section id="services-section">
        <h2>Our Services</h2>
        <ScrollGallery
          items={services}
          showArrows
          showIndicators
        />
      </section>

      {/* Testimonials Gallery */}
      <section id="testimonials-section">
        <h2>What Our Clients Say</h2>
        <ScrollGallery
          items={testimonials}
          autoScrollInterval={5000}
          enableParallax
          showArrows
        />
      </section>
    </div>
  );
}

// ============================================================================
// EXAMPLE 10: Responsive Gallery (Mobile-First)
// ============================================================================

export function ResponsiveGalleryExample() {
  const items: GalleryItem[] = [
    { id: '1', title: 'Item 1', description: 'Description 1' },
    { id: '2', title: 'Item 2', description: 'Description 2' },
    { id: '3', title: 'Item 3', description: 'Description 3' },
  ];

  return (
    <div className="responsive-gallery-wrapper">
      <ScrollGallery
        items={items}
        showArrows // Hidden on mobile via CSS
        showIndicators
        itemWidth={300} // Desktop width
        gap={1.5}
        // On mobile, touch scrolling is enabled automatically
      />

      <style jsx>{`
        @media (max-width: 768px) {
          .responsive-gallery-wrapper :global(.gallery-nav) {
            display: none; /* Hide arrows on mobile */
          }

          .responsive-gallery-wrapper :global(.gallery-item) {
            min-width: 250px; /* Smaller items on mobile */
          }
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// EXAMPLE 11: Dynamic Data Loading
// ============================================================================

export function DynamicDataExample() {
  const [items, setItems] = React.useState<GalleryItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate API call
    async function loadData() {
      const response = await fetch('/api/gallery-items');
      const data = await response.json();
      setItems(data);
      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) {
    return <div>Loading gallery...</div>;
  }

  return (
    <ScrollGallery
      items={items}
      showArrows
      showIndicators
      onItemClick={(item) => {
        // Track click event
        console.log('Clicked:', item.title);
      }}
    />
  );
}

// ============================================================================
// EXAMPLE 12: Accessibility-First Example
// ============================================================================

export function AccessibleExample() {
  const items: GalleryItem[] = [
    { id: '1', title: 'Accessible Item 1', description: 'Description 1' },
    { id: '2', title: 'Accessible Item 2', description: 'Description 2' },
  ];

  return (
    <div
      role="region"
      aria-label="Features gallery"
    >
      <h2 id="gallery-heading">Our Features</h2>

      <ScrollGallery
        items={items}
        showArrows
        showIndicators
        // Keyboard navigation enabled by default
        // Screen reader support included
        // Respects prefers-reduced-motion
      />

      <p className="sr-only">
        Use arrow buttons or swipe to navigate through features.
        Press Tab to navigate to individual items.
      </p>
    </div>
  );
}

// ============================================================================
// EXAMPLE 13: Performance-Optimized Example
// ============================================================================

export const PerformanceOptimizedExample = React.memo(() => {
  const items = React.useMemo<GalleryItem[]>(
    () => [
      { id: '1', title: 'Item 1', description: 'Description 1' },
      { id: '2', title: 'Item 2', description: 'Description 2' },
    ],
    []
  );

  const handleClick = React.useCallback((item: GalleryItem) => {
    console.log('Clicked:', item.title);
  }, []);

  return (
    <ScrollGallery
      items={items}
      showArrows
      onItemClick={handleClick}
    />
  );
});

PerformanceOptimizedExample.displayName = 'PerformanceOptimizedExample';

// ============================================================================
// Export all examples
// ============================================================================

export default {
  BasicScrollportExample,
  AutoAdvanceScrollportExample,
  FullWidthScrollportExample,
  BasicScrollGalleryExample,
  InteractiveGalleryExample,
  AutoScrollGalleryExample,
  CustomStyledGalleryExample,
  MultiScrollGalleryExample,
  CombinedExample,
  ResponsiveGalleryExample,
  DynamicDataExample,
  AccessibleExample,
  PerformanceOptimizedExample,
};
