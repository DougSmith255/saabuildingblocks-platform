/**
 * Example usage of GlossyCategoryCard component
 *
 * This file demonstrates how to use the GlossyCategoryCard component
 * with various configurations for the Agent Success Hub category filters.
 */

import React from 'react';
import { GlossyCategoryCard, PlaceholderIcon } from './GlossyCategoryCard';

// Example custom icon components
const AboutIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,0.1)" />
    <path d="M12 16V12M12 8H12.01" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const TrainingIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,0.1)" />
    <path d="M2 17L12 22L22 17" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" />
    <path d="M2 12L12 17L22 12" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const TechIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,0.1)" />
    <path d="M8 8L16 16M16 8L8 16" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CompensationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="#ffd700" strokeWidth="2" fill="rgba(255,215,0,0.1)" />
    <text x="12" y="16" textAnchor="middle" fill="#ffd700" fontSize="14" fontWeight="bold">$</text>
  </svg>
);

/**
 * Example: Basic usage with placeholder icon
 */
export const BasicExample = () => (
  <div style={{ padding: '20px', background: '#0a0a0a' }}>
    <GlossyCategoryCard
      icon={<PlaceholderIcon />}
      title="Category Name"
      description="Brief description of what's in this category"
      count={25}
      onClick={() => console.log('Card clicked!')}
    />
  </div>
);

/**
 * Example: Grid of category cards for Agent Success Hub
 */
export const CategoryGridExample = () => {
  const categories = [
    {
      id: 'about-exp',
      icon: <AboutIcon />,
      title: 'About eXp Realty',
      description: 'Learn about the cloud-based brokerage model and company culture',
      count: 58,
    },
    {
      id: 'training',
      icon: <TrainingIcon />,
      title: 'Training & Development',
      description: 'Professional development resources and learning paths',
      count: 142,
    },
    {
      id: 'technology',
      icon: <TechIcon />,
      title: 'Technology & Tools',
      description: 'Platform tutorials, integrations, and tech support',
      count: 89,
    },
    {
      id: 'compensation',
      icon: <CompensationIcon />,
      title: 'Compensation & Revenue',
      description: 'Commission structure, revenue share, and financial planning',
      count: 76,
    },
    {
      id: 'marketing',
      icon: <PlaceholderIcon />,
      title: 'Marketing & Branding',
      description: 'Lead generation, social media strategies, and personal branding',
      count: 103,
    },
    {
      id: 'success-stories',
      icon: <PlaceholderIcon />,
      title: 'Success Stories',
      description: 'Agent achievements, case studies, and best practices',
      count: 45,
    },
  ];

  const handleCategoryClick = (categoryId: string) => {
    console.log(`Category clicked: ${categoryId}`);
    // In real app: navigate or filter posts by category
  };

  return (
    <div style={{
      padding: '40px',
      background: '#0a0a0a',
      minHeight: '100vh',
    }}>
      <h1 style={{
        color: '#e5e4dd',
        fontSize: '32px',
        marginBottom: '32px',
        textAlign: 'center',
      }}>
        Explore Categories
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {categories.map((category) => (
          <GlossyCategoryCard
            key={category.id}
            icon={category.icon}
            title={category.title}
            description={category.description}
            count={category.count}
            onClick={() => handleCategoryClick(category.id)}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Example: Responsive layout
 */
export const ResponsiveExample = () => (
  <div style={{
    padding: '20px',
    background: '#0a0a0a',
  }}>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '16px',
    }}>
      <GlossyCategoryCard
        icon={<AboutIcon />}
        title="Getting Started"
        description="Everything you need to know to begin your journey"
        count={32}
      />
      <GlossyCategoryCard
        icon={<TrainingIcon />}
        title="Advanced Topics"
        description="Deep dives into complex subjects and strategies"
        count={18}
      />
    </div>
  </div>
);

/**
 * Example: With custom className
 */
export const CustomClassExample = () => (
  <div style={{ padding: '20px', background: '#0a0a0a' }}>
    <style jsx global>{`
      .featured-card {
        animation: pulse 3s ease-in-out infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.95; }
      }
    `}</style>

    <GlossyCategoryCard
      icon={<CompensationIcon />}
      title="Featured Category"
      description="This category has been highlighted with a custom class"
      count={99}
      className="featured-card"
    />
  </div>
);

export default CategoryGridExample;
